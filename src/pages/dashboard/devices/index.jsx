import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Static mock data — swap with API calls in devicesAPI when endpoints are ready
import devicesDataRaw from "./api/data.json";

// Components
import { DeviceHeader } from "./components/DeviceHeader";
import { DeviceActions } from "./components/DeviceActions";
import { DeviceTable } from "./components/DeviceTable";
import { DeviceFilterModal } from "./components/modals/DeviceFilterModal";
import { DeviceFormModal } from "./components/modals/DeviceFormModal";
import { AccessRulesModal } from "./components/modals/AccessRulesModal";
import { DeviceUsersModal } from "./components/modals/DeviceUsersModal";
import { DeviceIdentifiersModal } from "./components/modals/DeviceIdentifiersModal";
import { DeviceLogsModal } from "./components/modals/DeviceLogsModal";
import SmartPagination from "@/components/ui/SmartPagination";

// Hooks
import { useDeviceList } from "./hooks/useDeviceList";
import { useDeviceForm } from "./hooks/useDeviceForm";

// Static lookup data — will come from API responses once endpoints are ready
const accessRulesData = devicesDataRaw?.accessRules ?? [];
const usersData = devicesDataRaw?.users ?? [];
const identifiersData = devicesDataRaw?.identifiers ?? [];
const logsData = devicesDataRaw?.logs ?? [];

const DevicesPage = () => {
  const { t } = useTranslation();

  // Data & filters
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

  // Form
  const form = useDeviceForm();

  // Modal visibility
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [accessRulesOpen, setAccessRulesOpen] = useState(false);
  const [deviceUsersOpen, setDeviceUsersOpen] = useState(false);
  const [deviceIdentifiersOpen, setDeviceIdentifiersOpen] = useState(false);
  const [deviceLogsOpen, setDeviceLogsOpen] = useState(false);

  // Inline status filter (via DeviceActions — no modal needed)
  const [statusFilter, setStatusFilter] = useState(filterStatus);

  const handleNameSearch = (value) => {
    applySearch({ name: value, building: filterBuilding, status: statusFilter });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    applySearch({ name: filterName, building: filterBuilding, status: value });
  };

  // Create
  const handleOpenCreate = () => {
    form.resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  // Edit
  const handleEdit = (device) => {
    form.setFormFromDevice(device);
    setFormMode("edit");
    setFormOpen(true);
  };

  // Delete
  const handleDelete = (device) => {
    // TODO: call devicesAPI.delete(device.id) then refresh
    console.log("delete", device.id);
  };

  // Save
  const handleFormSave = () => {
    if (!form.validate()) return;
    // TODO: devicesAPI.create / update
    setFormOpen(false);
  };

  return (
    <div className="space-y-4 px-1">
      {/* Gradient title header */}
      <DeviceHeader
        onOpenAccessRules={() => setAccessRulesOpen(true)}
        onOpenDeviceUsers={() => setDeviceUsersOpen(true)}
        onOpenDeviceIdentifiers={() => setDeviceIdentifiersOpen(true)}
        onOpenDeviceLogs={() => setDeviceLogsOpen(true)}
      />

      {/* Search bar + Add button */}
      <DeviceActions
        filterName={filterName}
        filterStatus={statusFilter}
        onNameSearch={handleNameSearch}
        onStatusChange={handleStatusChange}
        onCreateClick={handleOpenCreate}
        total={total}
      />

      {/* Table */}
      <DeviceTable
        items={items}
        loading={loading}
        page={page}
        lastPage={lastPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={goToPage}
      />

      {/* Pagination */}
      <SmartPagination
        page={page}
        totalPages={lastPage}
        onPageChange={goToPage}
        prevLabel={t("devices.pagination.prev") || "Əvvəlki"}
        nextLabel={t("devices.pagination.next") || "Növbəti"}
        summary={<>Cəm: <b>{total}</b> nəticə</>}
      />

      {/* Modals */}
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
        onClose={() => setDeviceUsersOpen(false)}
        items={usersData}
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
