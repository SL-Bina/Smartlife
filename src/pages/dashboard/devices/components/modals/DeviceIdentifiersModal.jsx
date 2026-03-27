import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import {
  KeyIcon,
  XMarkIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { Actions as ManagementActions } from "@/components";
import { Pagination } from "@/components";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import AsyncSearchSelect from "@/components/ui/AsyncSearchSelect";
import { devicesAPI } from "@/pages/dashboard/devices/api";

const IDENTIFIER_TYPES = [
  { value: "card", label: "Card" },
  { value: "license_plate", label: "License Plate" },
  { value: "access_code", label: "Access Code" },
  { value: "ukey", label: "UKey" },
];

const OWNER_TYPES = [
  { value: "owner", label: "Owner" },
  { value: "user", label: "User" },
  { value: "resident", label: "Resident" },
  { value: "guest", label: "Guest" },
  { value: "family_member", label: "Family Member" },
];

const STATUS_TYPES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const DEFAULT_FORM = {
  id: null,
  name: "",
  owner: "",
  ownerLabel: "",
  owner_type: "owner",
  type: "card",
  value: "",
  status: "active",
  description: "",
};

export function DeviceIdentifiersModal({
  open,
  onClose,
  items = [],
  loading = false,
  complexName = "",
  complexId = null,
  total = 0,
  page = 1,
  itemsPerPage = 20,
  onPageChange,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const { t } = useTranslation();
  const { getActiveGradient } = useMtkColor();

  const gradientStyle = { background: getActiveGradient(0.92, 0.72) };
  const [searchName, setSearchName] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formSaving, setFormSaving] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState({});

  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / (itemsPerPage || 20)));
  const currentPage = Math.max(1, Number(page) || 1);
  const activeComplexLabel = complexName || (complexId ? `#${complexId}` : t("devices.deviceUsers.selectComplex") || "Kompleks secin");

  useEffect(() => {
    if (!open) {
      setSearchName("");
      setFormOpen(false);
      setFormSaving(false);
      setFormMode("create");
      setFormData(DEFAULT_FORM);
      setFormErrors({});
    }
  }, [open]);

  const filteredItems = useMemo(() => {
    if (!searchName?.trim()) return items;
    const q = searchName.trim().toLowerCase();
    return items.filter((identifier) => {
      const name = String(identifier.name || "").toLowerCase();
      const value = String(identifier.value || identifier.identifier || "").toLowerCase();
      const ownerName = String(identifier.owner?.name || "").toLowerCase();
      return name.includes(q) || value.includes(q) || ownerName.includes(q);
    });
  }, [items, searchName]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setFormData(DEFAULT_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (identifier) => {
    setFormMode("edit");
    setFormData({
      id: identifier.id,
      name: identifier.name || "",
      owner: identifier.owner?.id ? String(identifier.owner.id) : "",
      ownerLabel: identifier.owner?.name || "",
      owner_type: identifier.owner_type || "owner",
      type: identifier.type || "card",
      value: identifier.value || identifier.identifier || "",
      status: identifier.active_status || "active",
      description: identifier.description || "",
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Ad teleb olunur";
    if (!formData.owner) errors.owner = "Owner secimi teleb olunur";
    if (!formData.type) errors.type = "Nov teleb olunur";
    if (!formData.value?.trim()) errors.value = "Value teleb olunur";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      owner: Number(formData.owner),
      owner_type: formData.owner_type,
      type: formData.type,
      value: formData.value.trim(),
      status: formData.status,
      description: formData.description || "",
      access_rules: [],
    };

    setFormSaving(true);
    try {
      if (formMode === "edit" && formData.id) {
        await onUpdate?.({ id: formData.id, ...payload });
      } else {
        await onCreate?.(payload);
      }
      setFormOpen(false);
      setFormData(DEFAULT_FORM);
      setFormErrors({});
    } catch (error) {
      const message = error?.message || t("common.error") || "Xeta bas verdi";
      setFormErrors({ form: message });
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (identifierId) => {
    if (!window.confirm(t("common.confirmDelete") || "Silmeye eminsiniz?")) return;
    await onDelete?.(identifierId);
  };

  return (
    <>
      <Dialog
        open={open}
        handler={onClose}
        size="xl"
        className="dark:bg-gray-900 z-[130] border border-gray-200 dark:border-gray-700"
        dismiss={{ enabled: false }}
      >
        <DialogHeader className="p-0">
          <div className="w-full rounded-t-xl p-5 flex items-center gap-3" style={gradientStyle}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
              <KeyIcon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="h6" className="text-white font-bold">
                {t("devices.deviceIdentifiers.title") || "Cihaz identifikatorlari"}
              </Typography>
              <Typography variant="small" className="text-white/90 text-xs">
                {(t("devices.deviceUsers.complex") || "Kompleks") + ": "}
                <b>{activeComplexLabel}</b>
              </Typography>
            </div>

            <button
              onClick={onRefresh}
              className="text-white/90 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              title={t("devices.deviceUsers.refresh") || "Yenile"}
              type="button"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              type="button"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <DialogBody className="p-4 md:p-5 dark:bg-gray-900 max-h-[72vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
              <Typography variant="small" className="text-gray-500 dark:text-gray-300 flex items-center gap-1.5">
                <BuildingOffice2Icon className="h-4 w-4" />
                {t("devices.deviceUsers.complex") || "Kompleks"}
              </Typography>
              <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
                {activeComplexLabel}
              </Typography>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
              <Typography variant="small" className="text-gray-500 dark:text-gray-300">
                {t("devices.deviceUsers.total") || "Cem"}
              </Typography>
              <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
                {total}
              </Typography>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
              <Typography variant="small" className="text-gray-500 dark:text-gray-300">
                {t("devices.pagination.page") || "Sehife"}
              </Typography>
              <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
                {currentPage} / {totalPages}
              </Typography>
            </div>
          </div>

          <div className="mb-4">
            <ManagementActions
              entityLevel="device"
              search={{ name: searchName, status: "" }}
              onApplyNameSearch={(value) => setSearchName(value || "")}
              onCreateClick={handleOpenCreate}
              showStatus={false}
              totalItems={total}
              renderExtraControls={(isMobile) => (
                <Button
                  size={isMobile ? "sm" : "md"}
                  onClick={onRefresh}
                  className="text-white shadow-md hover:shadow-lg transition-all px-4"
                  style={gradientStyle}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ArrowPathIcon className="h-4 w-4" />
                    {t("devices.deviceUsers.refresh") || "Yenile"}
                  </span>
                </Button>
              )}
            />
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto max-h-[36vh]">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                  <tr>
                    {["ID", "Name", "Value", "Type", "Owner", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredItems.map((identifier) => (
                    <tr key={identifier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">#{identifier.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{identifier.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-mono">{identifier.value || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{identifier.type || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{identifier.owner?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <Chip
                          value={identifier.active_status === "active" ? "Active" : "Inactive"}
                          className={`text-[11px] font-semibold w-fit normal-case ${
                            identifier.active_status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            variant="text"
                            size="sm"
                            color="blue"
                            onClick={() => handleOpenEdit(identifier)}
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            size="sm"
                            color="red"
                            onClick={() => handleDelete(identifier.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                        {t("common.loading") || "Yuklenir..."}
                      </td>
                    </tr>
                  )}

                  {!loading && filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                        {t("common.noData") || "Melumat yoxdur"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(nextPage) => onPageChange?.(nextPage)}
              prevLabel={t("devices.pagination.prev") || "Evvelki"}
              nextLabel={t("devices.pagination.next") || "Novbeti"}
              summary={
                <>
                  {(t("devices.deviceUsers.total") || "Cem")}: <b>{total}</b>
                </>
              }
            />
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-end px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
            {t("devices.actions.close") || "Bagla"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={formOpen}
        handler={() => setFormOpen(false)}
        size="md"
        className="dark:bg-gray-900 z-[141] border border-gray-200 dark:border-gray-700"
        dismiss={{ enabled: false }}
      >
        <DialogHeader className="p-0">
          <div className="w-full rounded-t-xl p-5 flex items-center gap-3" style={gradientStyle}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
              <KeyIcon className="h-6 w-6 text-white" />
            </div>
            <Typography variant="h6" className="text-white font-bold">
              {formMode === "edit"
                ? t("devices.deviceIdentifiers.edit") || "Identifikatoru redakte et"
                : t("devices.deviceIdentifiers.add") || "Yeni identifikator"}
            </Typography>
            <button
              onClick={() => setFormOpen(false)}
              className="ml-auto text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              type="button"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <DialogBody className="px-4 md:px-5 py-4 dark:bg-gray-900 max-h-[70vh] overflow-y-auto space-y-3">
          <CustomInput
            label={t("devices.deviceIdentifiers.name") || "Ad"}
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            error={formErrors.name}
          />

          <AsyncSearchSelect
            label={t("devices.deviceIdentifiers.ownerId") || "Owner"}
            value={formData.owner || null}
            onChange={(value, option) => {
              setFormData((prev) => ({
                ...prev,
                owner: value ? String(value) : "",
                ownerLabel: option?.name || option?.label || "",
              }));
              setFormErrors((prev) => ({ ...prev, owner: undefined }));
            }}
            placeholder={t("devices.deviceIdentifiers.ownerId") || "Owner secin"}
            searchPlaceholder={t("common.search") || "Axtar..."}
            selectedLabel={formData.ownerLabel || null}
            loadOptions={async ({ search = "", page: pageNum = 1, perPage: limit = 20 }) => {
              if (!complexId) return { data: [], lastPage: 1 };

              const response = await devicesAPI.getBasipUsers({
                complex_id: complexId,
                page: pageNum,
                size: limit,
                search,
              });

              const payload = response?.data?.body || {};
              const listRaw = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(response?.data?.data)
                  ? response.data.data
                  : [];

              const list = listRaw
                .map((user) => ({
                  id: user?.id,
                  name: user?.name || user?.full_name || user?.email || `#${user?.id ?? ""}`,
                }))
                .filter((user) => user.id !== null && user.id !== undefined);

              const pagination = payload?.pagination || {};
              const pageSize =
                Number(pagination?.size) ||
                Number(pagination?.per_page) ||
                Number(limit) ||
                20;
              const totalPagesFromApi =
                Number(pagination?.last_page) ||
                Number(pagination?.total_pages) ||
                (Number(pagination?.total) > 0
                  ? Math.ceil(Number(pagination.total) / pageSize)
                  : 0);

              // If API doesn't provide total pages, keep scrolling while page is full.
              const inferredLastPage =
                totalPagesFromApi > 0
                  ? totalPagesFromApi
                  : (list.length < pageSize ? pageNum : pageNum + 1);

              return {
                data: list,
                lastPage: inferredLastPage,
              };
            }}
            perPage={20}
            allowClear={false}
            disabled={!complexId}
            error={formErrors.owner}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomSelect
              label={t("devices.deviceIdentifiers.ownerType") || "Owner Type"}
              value={formData.owner_type}
              onChange={(value) => setFormData((prev) => ({ ...prev, owner_type: value }))}
              options={OWNER_TYPES}
            />
            <CustomSelect
              label={t("devices.deviceIdentifiers.type") || "Nov"}
              value={formData.type}
              onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              options={IDENTIFIER_TYPES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomInput
              label={t("devices.deviceIdentifiers.value") || "Deyer"}
              value={formData.value}
              onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
              error={formErrors.value}
            />
            <CustomSelect
              label={t("devices.deviceIdentifiers.status") || "Status"}
              value={formData.status}
              onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              options={STATUS_TYPES}
            />
          </div>

          <CustomInput
            label={t("common.description") || "Tesvir"}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />

          {formErrors.form ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/20 dark:text-red-300">
              {formErrors.form}
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter className="flex justify-end gap-2 px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setFormOpen(false)}
            className="dark:text-gray-300"
          >
            {t("devices.actions.cancel") || "Legv et"}
          </Button>
          <Button onClick={handleSave} disabled={formSaving} className="text-white" style={gradientStyle}>
            {formSaving
              ? t("devices.actions.saving") || "Yadda saxlanir..."
              : t("devices.actions.save") || "Saxla"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
