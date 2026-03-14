import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { loadComplexes } from "@/store/slices/complexSlice";

import devicesDataRaw from "./api/data.json";
import { devicesAPI } from "./api";

import { DeviceHeader } from "./components/DeviceHeader";
import { DeviceActions } from "./components/DeviceActions";
import { DeviceTable } from "./components/DeviceTable";
import { DeviceFilterModal } from "./components/modals/DeviceFilterModal";
import { DeviceFormModal } from "./components/modals/DeviceFormModal";
import { AccessRulesModal } from "./components/modals/AccessRulesModal";
import { DeviceUsersModal } from "./components/modals/DeviceUsersModal";
import { DeviceUserFormModal } from "./components/modals/DeviceUserFormModal";
import { DeviceIdentifiersModal } from "./components/modals/DeviceIdentifiersModal";
import { DeviceLogsModal } from "./components/modals/DeviceLogsModal";
import SmartPagination from "@/components/ui/SmartPagination";

import { useDeviceList } from "./hooks/useDeviceList";
import { useDeviceForm } from "./hooks/useDeviceForm";

const accessRulesData = devicesDataRaw?.accessRules ?? [];
const identifiersData = devicesDataRaw?.identifiers ?? [];
const logsData = devicesDataRaw?.logs ?? [];

const DevicesPage = () => {
  const { t } = useTranslation();

  const {
    items,
    loading,
    page,
    lastPage,
    total,
    filterName,
    filterBuilding,
    filterStatus,
    goToPage,
    applySearch,
  } = useDeviceList();

  const dispatch = useAppDispatch();
  const complexes = useAppSelector((state) => state.complex.complexes);
  const selectedComplexIdFromStore = useAppSelector((state) => state.complex.selectedComplexId);

  const form = useDeviceForm();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [accessRulesOpen, setAccessRulesOpen] = useState(false);
  const [deviceUsersOpen, setDeviceUsersOpen] = useState(false);
  const [deviceUsers, setDeviceUsers] = useState([]);
  const [deviceUsersLoading, setDeviceUsersLoading] = useState(false);
  const [deviceUsersPage, setDeviceUsersPage] = useState(1);
  const [deviceUsersTotal, setDeviceUsersTotal] = useState(0);
  const [selectedComplexId, setSelectedComplexId] = useState(selectedComplexIdFromStore || 2);
  const selectedComplexName = complexes.find((c) => c.id === Number(selectedComplexId))?.name || "";
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userFormSaving, setUserFormSaving] = useState(false);
  const [userFormData, setUserFormData] = useState({
    complex_id: 2,
    name: "",
    email: "",
    phone: "",
    domain_id: "",
    role_id: 12,
    address: "",
    markers: [],
    elevator_access_disabled: false,
    use_phone_in_forwarding: false,
  });
  const [userFormErrors, setUserFormErrors] = useState({});
  const [deviceIdentifiersOpen, setDeviceIdentifiersOpen] = useState(false);
  const [deviceLogsOpen, setDeviceLogsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(filterStatus);

  const loadDeviceUsers = useCallback(async (opts = {}) => {
    const complex_id = opts.complex_id ?? selectedComplexId ?? 2;
    const pageNo = opts.page ?? deviceUsersPage;
    setDeviceUsersLoading(true);

    try {
      const response = await devicesAPI.getBasipUsers({ complex_id, page: pageNo, size: 20 });
      const users = response?.data?.body?.data ?? [];
      const pagination = response?.data?.body?.pagination ?? {};
      setDeviceUsers(
        users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.profile?.phone || "",
          status: u.activated_at ? "Onlayn" : "Offline",
          role: u.role?.name,
          domain: u.domains?.[0]?.full_name || "",
        }))
      );
      setDeviceUsersPage(pagination.page || 1);
      setDeviceUsersTotal(pagination.total || users.length);
      if (opts.complex_id) setSelectedComplexId(opts.complex_id);
    } catch (error) {
      console.error("Failed to load Basip users", error);
      setDeviceUsers([]);
    } finally {
      setDeviceUsersLoading(false);
    }
  }, [selectedComplexId, deviceUsersPage]);

  const handleNameSearch = (value) => {
    applySearch({ name: value, building: filterBuilding, status: statusFilter });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    applySearch({ name: filterName, building: filterBuilding, status: value });
  };

  const handleOpenCreate = () => {
    form.resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (device) => {
    form.setFormFromDevice(device);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (device) => {
    // // console.log("delete", device.id);
  };

  const handleFormSave = () => {
    if (!form.validate()) return;
    setFormOpen(false);
  };

  useEffect(() => {
    if (complexes.length === 0) {
      dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, complexes.length]);

  useEffect(() => {
    if (deviceUsersOpen) {
      loadDeviceUsers({ page: 1 });
    }
  }, [deviceUsersOpen, loadDeviceUsers]);

  const handleOpenDeviceUsers = () => {
    setDeviceUsersOpen(true);
  };

  const handleCloseDeviceUsers = () => {
    setDeviceUsersOpen(false);
  };

  const handleComplexChange = (newComplexId) => {
    setSelectedComplexId(Number(newComplexId));
    loadDeviceUsers({ complex_id: Number(newComplexId), page: 1 });
  };

  const handleOpenUserForm = () => {
    setUserFormData({
      complex_id: selectedComplexId,
      name: "",
      email: "",
      phone: "",
      domain_id: "",
      role_id: 12,
      address: "",
      markers: [],
      elevator_access_disabled: false,
      use_phone_in_forwarding: false,
    });
    setUserFormErrors({});
    setUserFormOpen(true);
  };

  const handleUserFormChange = (field, value) => {
    setUserFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    const errors = {};
    if (!userFormData.name?.trim()) errors.name = "Ad tələb olunur";
    if (!userFormData.email?.trim()) errors.email = "E-poçt tələb olunur";
    if (!userFormData.domain_id) errors.domain_id = "Domain ID tələb olunur";
    if (!userFormData.complex_id) errors.complex_id = "Complex ID tələb olunur";
    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    setUserFormSaving(true);
    try {
      await devicesAPI.addBasipUser({
        complex_id: Number(userFormData.complex_id),
        name: userFormData.name,
        role_id: Number(userFormData.role_id),
        email: userFormData.email,
        domain_ids: [Number(userFormData.domain_id)],
        identifiers: [],
        access_rules: [],
        address: userFormData.address,
        phone: userFormData.phone,
        use_phone_in_forwarding: userFormData.use_phone_in_forwarding,
        markers: [],
        elevator_access_disabled: userFormData.elevator_access_disabled,
      });
      setUserFormOpen(false);
      loadDeviceUsers({ complex_id: Number(userFormData.complex_id), page: 1 });
    } catch (error) {
      console.error("Failed to add Basip user", error);
      setUserFormErrors({ form: error?.message || "Xəta baş verdi" });
    } finally {
      setUserFormSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) return;
    setDeviceUsersLoading(true);
    try {
      await devicesAPI.deleteBasipUser({ user_id: userId, complex_id: selectedComplexId });
      loadDeviceUsers({ page: deviceUsersPage });
    } catch (error) {
      console.error("Failed to delete Basip user", error);
    } finally {
      setDeviceUsersLoading(false);
    }
  };

  return (
    <div className="space-y-4 px-1">
      <DeviceHeader
        onOpenAccessRules={() => setAccessRulesOpen(true)}
        onOpenDeviceUsers={handleOpenDeviceUsers}
        onOpenDeviceIdentifiers={() => setDeviceIdentifiersOpen(true)}
        onOpenDeviceLogs={() => setDeviceLogsOpen(true)}
      />

      <DeviceActions
        filterName={filterName}
        filterStatus={statusFilter}
        onNameSearch={handleNameSearch}
        onStatusChange={handleStatusChange}
        onCreateClick={handleOpenCreate}
        total={total}
      />

      <DeviceTable
        items={items}
        loading={loading}
        page={page}
        lastPage={lastPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={goToPage}
      />

      <SmartPagination
        page={page}
        totalPages={lastPage}
        onPageChange={goToPage}
        prevLabel={t("devices.pagination.prev") || "Əvvəlki"}
        nextLabel={t("devices.pagination.next") || "Növbəti"}
        summary={<>Cəm: <b>{total}</b> nəticə</>}
      />

      <DeviceFormModal
        open={formOpen}
        mode={formMode}
        onClose={() => setFormOpen(false)}
        formData={form.formData}
        errors={form.errors}
        onChange={form.updateField}
        onSave={handleFormSave}
      />

      <AccessRulesModal
        open={accessRulesOpen}
        onClose={() => setAccessRulesOpen(false)}
        items={accessRulesData}
      />

      <DeviceUsersModal
        open={deviceUsersOpen}
        onClose={handleCloseDeviceUsers}
        items={deviceUsers}
        loading={deviceUsersLoading}
        complexes={complexes}
        selectedComplexId={selectedComplexId}
        complexName={selectedComplexName}
        page={deviceUsersPage}
        total={deviceUsersTotal}
        onRefresh={() => loadDeviceUsers({ page: deviceUsersPage })}
        onOpenAddUser={handleOpenUserForm}
        onDeleteUser={handleDeleteUser}
        onComplexChange={handleComplexChange}
      />

      <DeviceUserFormModal
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        formData={userFormData}
        errors={userFormErrors}
        onChange={handleUserFormChange}
        onSave={handleCreateUser}
        saving={userFormSaving}
        complexes={complexes}
      />

      <DeviceIdentifiersModal
        open={deviceIdentifiersOpen}
        onClose={() => setDeviceIdentifiersOpen(false)}
        items={identifiersData}
      />

      <DeviceLogsModal
        open={deviceLogsOpen}
        onClose={() => setDeviceLogsOpen(false)}
        items={logsData}
      />
    </div>
  );
};

export default DevicesPage;
