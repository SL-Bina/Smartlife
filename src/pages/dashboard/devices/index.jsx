import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { loadComplexes, loadComplexById, setSelectedComplex } from "@/store/slices/complexSlice";
import complexesAPI from "@/pages/dashboard/management/complexes/api";

import devicesDataRaw from "./api/data.json";
import { devicesAPI } from "./api";

import { DeviceHeader } from "./components/DeviceHeader";
import { DeviceTable } from "./components/DeviceTable";
import { DeviceFormModal } from "./components/modals/DeviceFormModal";
import { AccessRulesModal } from "./components/modals/AccessRulesModal";
import { DeviceUsersModal } from "./components/modals/DeviceUsersModal";
import { DeviceUserFormModal } from "./components/modals/DeviceUserFormModal";
import { DeviceIdentifiersModal } from "./components/modals/DeviceIdentifiersModal";
import { DeviceLogsModal } from "./components/modals/DeviceLogsModal";
import { DeviceComplexSelectModal } from "./components/modals/DeviceComplexSelectModal";
import SmartPagination from "@/components/ui/SmartPagination";
import { Button } from "@material-tailwind/react";
import { ManagementActions } from "@/components/management/ManagementActions";

import { useDeviceList } from "./hooks/useDeviceList";
import { useDeviceForm } from "./hooks/useDeviceForm";

const accessRulesData = devicesDataRaw?.accessRules ?? [];
const logsData = devicesDataRaw?.logs ?? [];
const DEVICES_COMPLEX_STORAGE_KEY = "smartlife_devices_complex_id";
const DEVICES_COMPLEX_COOKIE_KEY = "smartlife_devices_complex_id";

const setCookieValue = (key, value, days = 30) => {
  try {
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(String(value))}; expires=${expiresAt}; path=/; SameSite=Lax`;
  } catch (error) {
    // Ignore cookie write errors.
  }
};

const getCookieValue = (key) => {
  try {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    const match = cookies.find((item) => item.startsWith(`${key}=`));
    if (!match) return null;
    return decodeURIComponent(match.split("=").slice(1).join("="));
  } catch (error) {
    return null;
  }
};

const getPersistedDevicesComplexId = () => {
  const cookieValue = getCookieValue(DEVICES_COMPLEX_COOKIE_KEY);
  if (cookieValue != null && cookieValue !== "") {
    const parsedCookie = Number(cookieValue);
    if (Number.isFinite(parsedCookie)) return parsedCookie;
  }

  try {
    const raw = localStorage.getItem(DEVICES_COMPLEX_STORAGE_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

const isTruthyFlag = (value) => value === true || value === "true" || value === 1 || value === "1";

const canLoadBasipProjectForComplex = (complexDetails) => {
  const config = complexDetails?.config || {};
  const integrationRoot = config?.integrations || {};
  const deviceIntegration = integrationRoot?.device || {};

  const connectionType =
    deviceIntegration?.device_connection ||
    deviceIntegration?.device_integration ||
    integrationRoot?.device_integration ||
    config?.device_integration ||
    "";

  if (String(connectionType).toLowerCase() === "basip_project") return true;

  const hasProject =
    deviceIntegration?.has_project ??
    integrationRoot?.has_project ??
    config?.has_project ??
    complexDetails?.has_project;

  return isTruthyFlag(hasProject);
};

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
  const persistedDevicesComplexId = getPersistedDevicesComplexId();

  const form = useDeviceForm();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [accessRulesOpen, setAccessRulesOpen] = useState(false);
  const [deviceUsersOpen, setDeviceUsersOpen] = useState(false);
  const [deviceUsers, setDeviceUsers] = useState([]);
  const [deviceUsersLoading, setDeviceUsersLoading] = useState(false);
  const [deviceUsersPage, setDeviceUsersPage] = useState(1);
  const [deviceUsersTotal, setDeviceUsersTotal] = useState(0);
  const [selectedComplexId, setSelectedComplexId] = useState(
    persistedDevicesComplexId || selectedComplexIdFromStore || null
  );
  const [complexSelectionOpen, setComplexSelectionOpen] = useState(false);
  const [complexSelectionRequired, setComplexSelectionRequired] = useState(false);
  const [eligibleComplexes, setEligibleComplexes] = useState([]);
  const [eligibleComplexesLoading, setEligibleComplexesLoading] = useState(false);
  const [eligibleComplexesError, setEligibleComplexesError] = useState("");

  const selectedComplexName =
    eligibleComplexes.find((c) => c.id === Number(selectedComplexId))?.name ||
    complexes.find((c) => c.id === Number(selectedComplexId))?.name ||
    "";
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userFormSaving, setUserFormSaving] = useState(false);
  const [userFormData, setUserFormData] = useState({
    complex_id: persistedDevicesComplexId || selectedComplexIdFromStore || "",
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
  const [deviceIdentifiers, setDeviceIdentifiers] = useState([]);
  const [deviceIdentifiersLoading, setDeviceIdentifiersLoading] = useState(false);
  const [deviceIdentifiersPage, setDeviceIdentifiersPage] = useState(1);
  const [deviceIdentifiersTotal, setDeviceIdentifiersTotal] = useState(0);
  const [deviceLogsOpen, setDeviceLogsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(filterStatus);

  const applyComplexSelection = useCallback(
    (complexId, { closeModal = true } = {}) => {
      const normalizedId = Number(complexId);
      if (!Number.isFinite(normalizedId) || normalizedId <= 0) return;

      setSelectedComplexId(normalizedId);

      try {
        localStorage.setItem(DEVICES_COMPLEX_STORAGE_KEY, String(normalizedId));
      } catch (error) {
        // Ignore storage write errors and continue with in-memory selection.
      }

      setCookieValue(DEVICES_COMPLEX_COOKIE_KEY, normalizedId, 30);

      dispatch(setSelectedComplex({ id: normalizedId }));
      dispatch(loadComplexById(normalizedId));

      if (closeModal) {
        setComplexSelectionOpen(false);
        setComplexSelectionRequired(false);
      }
    },
    [dispatch]
  );

  const loadDeviceUsers = useCallback(async (opts = {}) => {
    const complex_id = Number(opts.complex_id ?? selectedComplexId);
    if (!complex_id) {
      setDeviceUsers([]);
      setDeviceUsersTotal(0);
      setDeviceUsersPage(1);
      return;
    }

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
      if (opts.complex_id) {
        applyComplexSelection(opts.complex_id, { closeModal: false });
      }
    } catch (error) {
      console.error("Failed to load Basip users", error);
      setDeviceUsers([]);
    } finally {
      setDeviceUsersLoading(false);
    }
  }, [applyComplexSelection, selectedComplexId, deviceUsersPage]);

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
    if (!complexSelectionOpen) return;
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
  }, [complexSelectionOpen, dispatch]);

  useEffect(() => {
    let mounted = true;

    const resolveEligibleComplexes = async () => {
      if (!complexes?.length) {
        if (mounted) {
          setEligibleComplexes([]);
          setEligibleComplexesError("");
        }
        return;
      }

      setEligibleComplexesLoading(true);
      setEligibleComplexesError("");

      try {
        const responses = await Promise.all(
          complexes.map(async (complex) => {
            try {
              const response = await complexesAPI.getById(complex.id);
              return {
                complex,
                details: response?.data?.data || null,
              };
            } catch (error) {
              return {
                complex,
                details: null,
              };
            }
          })
        );

        const filtered = responses
          .filter((item) => canLoadBasipProjectForComplex(item.details))
          .map((item) => item.complex);

        if (mounted) {
          setEligibleComplexes(filtered);
        }
      } catch (error) {
        if (mounted) {
          setEligibleComplexes([]);
          setEligibleComplexesError(
            t("devices.complexSelection.loadError") || "Kompleks konfiqurasiyasi yuklenmedi"
          );
        }
      } finally {
        if (mounted) {
          setEligibleComplexesLoading(false);
        }
      }
    };

    resolveEligibleComplexes();

    return () => {
      mounted = false;
    };
  }, [complexes, t]);

  useEffect(() => {
    if (eligibleComplexesLoading) return;

    if (!eligibleComplexes.length) {
      setComplexSelectionOpen(false);
      setComplexSelectionRequired(false);
      return;
    }

    if (eligibleComplexes.length === 1) {
      applyComplexSelection(eligibleComplexes[0].id, { closeModal: false });
      setComplexSelectionOpen(false);
      setComplexSelectionRequired(false);
      return;
    }

    const hasValidSelection = eligibleComplexes.some((complex) => complex.id === Number(selectedComplexId));
    if (hasValidSelection) {
      setComplexSelectionRequired(false);
      return;
    }

    setComplexSelectionRequired(true);
    setComplexSelectionOpen(true);
  }, [applyComplexSelection, eligibleComplexes, eligibleComplexesLoading, selectedComplexId]);

  useEffect(() => {
    if (deviceUsersOpen && selectedComplexId) {
      loadDeviceUsers({ page: 1 });
    }
  }, [deviceUsersOpen, loadDeviceUsers, selectedComplexId]);

  const handleOpenDeviceUsers = () => {
    setDeviceUsersOpen(true);
  };

  const handleCloseDeviceUsers = () => {
    setDeviceUsersOpen(false);
  };

  const handleOpenDeviceIdentifiers = () => {
    setDeviceIdentifiersOpen(true);
  };

  const handleCloseDeviceIdentifiers = () => {
    setDeviceIdentifiersOpen(false);
  };

  const handleDeviceUsersPageChange = (nextPage) => {
    const safePage = Math.max(1, Number(nextPage) || 1);
    setDeviceUsersPage(safePage);
    loadDeviceUsers({ page: safePage });
  };

  const loadDeviceIdentifiers = useCallback(async (opts = {}) => {
    const complex_id = Number(opts.complex_id ?? selectedComplexId);
    if (!complex_id) {
      setDeviceIdentifiers([]);
      setDeviceIdentifiersTotal(0);
      setDeviceIdentifiersPage(1);
      return;
    }

    const pageNo = opts.page ?? deviceIdentifiersPage;
    setDeviceIdentifiersLoading(true);

    try {
      const response = await devicesAPI.getBasipIdentifiers({
        complex_id,
        page: pageNo,
        size: 20,
      });
      const identifiers = response?.data?.body?.data ?? [];
      const pagination = response?.data?.body?.pagination ?? {};

      setDeviceIdentifiers(identifiers);
      setDeviceIdentifiersPage(pagination.page || 1);
      setDeviceIdentifiersTotal(pagination.total || identifiers.length);

      if (opts.complex_id) {
        applyComplexSelection(opts.complex_id, { closeModal: false });
      }
    } catch (error) {
      console.error("Failed to load Basip identifiers", error);
      setDeviceIdentifiers([]);
    } finally {
      setDeviceIdentifiersLoading(false);
    }
  }, [applyComplexSelection, deviceIdentifiersPage, selectedComplexId]);

  const handleDeviceIdentifiersPageChange = (nextPage) => {
    const safePage = Math.max(1, Number(nextPage) || 1);
    setDeviceIdentifiersPage(safePage);
    loadDeviceIdentifiers({ page: safePage });
  };

  useEffect(() => {
    if (deviceIdentifiersOpen && selectedComplexId) {
      loadDeviceIdentifiers({ page: 1 });
    }
  }, [deviceIdentifiersOpen, loadDeviceIdentifiers, selectedComplexId]);

  const handleComplexChange = useCallback((newComplexId) => {
    const normalizedId = Number(newComplexId);
    if (!normalizedId) return;

    applyComplexSelection(normalizedId, { closeModal: false });

    if (deviceUsersOpen) {
      loadDeviceUsers({ complex_id: normalizedId, page: 1 });
    }

    if (deviceIdentifiersOpen) {
      loadDeviceIdentifiers({ complex_id: normalizedId, page: 1 });
    }
  }, [
    applyComplexSelection,
    deviceIdentifiersOpen,
    deviceUsersOpen,
    loadDeviceIdentifiers,
    loadDeviceUsers,
  ]);

  const renderDeviceExtraControls = (isMobile = false) => {
    const wrapperClass = isMobile ? "flex flex-wrap gap-2" : "flex flex-wrap gap-2 md:gap-2";
    const baseActionButtonClass =
      "flex items-center justify-center px-4 !bg-transparent !shadow-none hover:!shadow-none border transition-all duration-200";

    const actionStyles = {
      complex: { color: "#1d4ed8", borderColor: "#93c5fd" },
      users: { color: "#7c3aed", borderColor: "#c4b5fd" },
      access: { color: "#0f766e", borderColor: "#99f6e4" },
      identifiers: { color: "#b45309", borderColor: "#fcd34d" },
      logs: { color: "#374151", borderColor: "#d1d5db" },
    };

    return (
      <div className={wrapperClass}>
        {eligibleComplexes.length > 1 ? (
          <Button
            type="button"
            size={isMobile ? "sm" : "md"}
            onClick={() => {
              setComplexSelectionRequired(false);
              setComplexSelectionOpen(true);
            }}
            className={baseActionButtonClass}
            style={actionStyles.complex}
          >
            {selectedComplexName
              ? `${t("devices.complexSelection.changeButton") || "Kompleks sec"}: ${selectedComplexName}`
              : t("devices.complexSelection.changeButton") || "Kompleks sec"}
          </Button>
        ) : null}

        <Button
          type="button"
          size={isMobile ? "sm" : "md"}
          onClick={handleOpenDeviceUsers}
          className={baseActionButtonClass}
          style={actionStyles.users}
        >
          {t("devices.actions.deviceUsers") || "Istifadeciler"}
        </Button>

        <Button
          type="button"
          size={isMobile ? "sm" : "md"}
          onClick={() => setAccessRulesOpen(true)}
          className={baseActionButtonClass}
          style={actionStyles.access}
        >
          {t("devices.actions.accessRules") || "Icaze qaydalari"}
        </Button>

        <Button
          type="button"
          size={isMobile ? "sm" : "md"}
          onClick={handleOpenDeviceIdentifiers}
          className={baseActionButtonClass}
          style={actionStyles.identifiers}
        >
          {t("devices.actions.deviceIdentifiers") || "Identifikatorlar"}
        </Button>

        <Button
          type="button"
          size={isMobile ? "sm" : "md"}
          onClick={() => setDeviceLogsOpen(true)}
          className={baseActionButtonClass}
          style={actionStyles.logs}
        >
          {t("devices.actions.deviceLogs") || "Loglar"}
        </Button>
      </div>
    );
  };

  const handleOpenUserForm = () => {
    if (!selectedComplexId) {
      setUserFormErrors({ form: t("devices.deviceUsers.selectComplex") || "Kompleks secin" });
      return;
    }

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
    const effectiveComplexId = Number(userFormData.complex_id || selectedComplexId);

    if (!userFormData.name?.trim()) errors.name = "Ad tələb olunur";
    if (!userFormData.email?.trim()) errors.email = "E-poçt tələb olunur";
    if (!userFormData.domain_id) errors.domain_id = "Domain ID tələb olunur";
    if (!effectiveComplexId) errors.form = t("devices.deviceUsers.selectComplex") || "Kompleks secin";
    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    setUserFormSaving(true);
    try {
      await devicesAPI.addBasipUser({
        complex_id: effectiveComplexId,
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
      loadDeviceUsers({ complex_id: effectiveComplexId, page: 1 });
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

  const handleCreateIdentifier = async (payload) => {
    const effectiveComplexId = Number(selectedComplexId);
    if (!effectiveComplexId) {
      throw new Error(t("devices.deviceUsers.selectComplex") || "Kompleks secin");
    }

    await devicesAPI.addBasipIdentifier({
      complex_id: effectiveComplexId,
      ...payload,
    });

    await loadDeviceIdentifiers({ complex_id: effectiveComplexId, page: deviceIdentifiersPage || 1 });
  };

  const handleUpdateIdentifier = async ({ id, ...payload }) => {
    const effectiveComplexId = Number(selectedComplexId);
    if (!effectiveComplexId) {
      throw new Error(t("devices.deviceUsers.selectComplex") || "Kompleks secin");
    }

    await devicesAPI.updateBasipIdentifier({
      id,
      complex_id: effectiveComplexId,
      ...payload,
    });

    await loadDeviceIdentifiers({ complex_id: effectiveComplexId, page: deviceIdentifiersPage || 1 });
  };

  const handleDeleteIdentifier = async (identifierId) => {
    const effectiveComplexId = Number(selectedComplexId);
    if (!effectiveComplexId) return;

    setDeviceIdentifiersLoading(true);
    try {
      await devicesAPI.deleteBasipIdentifier({ id: identifierId, complex_id: effectiveComplexId });
      await loadDeviceIdentifiers({ complex_id: effectiveComplexId, page: deviceIdentifiersPage || 1 });
    } catch (error) {
      console.error("Failed to delete Basip identifier", error);
    } finally {
      setDeviceIdentifiersLoading(false);
    }
  };

  return (
    <div className="space-y-4 px-1">
      <DeviceHeader
        selectedComplexName={selectedComplexName}
      />

      {!selectedComplexId ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            {eligibleComplexesLoading
              ? t("common.loading") || "Yuklenir..."
              : eligibleComplexesError ||
                t("devices.complexSelection.requiredDescription") ||
                "Cihazlar sehifesi ucun kompleks secimi teleb olunur."}
          </p>
        </div>
      ) : (
        <>
          <ManagementActions
            entityLevel="device"
            search={{ name: filterName, status: statusFilter }}
            onCreateClick={handleOpenCreate}
            onApplyNameSearch={handleNameSearch}
            onStatusChange={handleStatusChange}
            totalItems={total}
            showStatus={false}
            renderExtraControls={renderDeviceExtraControls}
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
        </>
      )}

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
        complexId={selectedComplexId}
        complexName={selectedComplexName}
        page={deviceUsersPage}
        total={deviceUsersTotal}
        onPageChange={handleDeviceUsersPageChange}
        itemsPerPage={20}
        onRefresh={() => loadDeviceUsers({ page: deviceUsersPage })}
        onOpenAddUser={handleOpenUserForm}
        onDeleteUser={handleDeleteUser}
      />

      <DeviceUserFormModal
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        formData={userFormData}
        errors={userFormErrors}
        onChange={handleUserFormChange}
        onSave={handleCreateUser}
        saving={userFormSaving}
        complexName={selectedComplexName}
      />

      <DeviceIdentifiersModal
        open={deviceIdentifiersOpen}
        onClose={handleCloseDeviceIdentifiers}
        items={deviceIdentifiers}
        loading={deviceIdentifiersLoading}
        complexId={selectedComplexId}
        complexName={selectedComplexName}
        page={deviceIdentifiersPage}
        total={deviceIdentifiersTotal}
        onPageChange={handleDeviceIdentifiersPageChange}
        itemsPerPage={20}
        onRefresh={() => loadDeviceIdentifiers({ page: deviceIdentifiersPage })}
        onCreate={handleCreateIdentifier}
        onUpdate={handleUpdateIdentifier}
        onDelete={handleDeleteIdentifier}
      />

      <DeviceLogsModal
        open={deviceLogsOpen}
        onClose={() => setDeviceLogsOpen(false)}
        items={logsData}
      />

      <DeviceComplexSelectModal
        open={complexSelectionOpen}
        onClose={() => {
          if (complexSelectionRequired) return;
          setComplexSelectionOpen(false);
        }}
        complexes={eligibleComplexes}
        selectedComplexId={selectedComplexId}
        loading={eligibleComplexesLoading}
        required={complexSelectionRequired}
        onConfirm={(complexId) => {
          handleComplexChange(complexId);
          setComplexSelectionOpen(false);
          setComplexSelectionRequired(false);
        }}
      />
    </div>
  );
};

export default DevicesPage;
