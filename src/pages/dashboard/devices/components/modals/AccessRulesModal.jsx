import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  IconButton,
  Chip,
  Switch,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  XMarkIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { Actions as ManagementActions } from "@/components";
import { Pagination } from "@/components";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomTextarea } from "@/components/ui/CustomTextarea";

const DEFAULT_FORM = {
  id: null,
  name: "",
  description: "",
  is_shareable: true,
  devicesText: "",
  identifiersText: "",
  usersText: "",
  domainsText: "",
  timeRulesText: "",
};

const parseIds = (raw) =>
  String(raw || "")
    .split(",")
    .map((item) => Number(String(item).trim()))
    .filter((value) => Number.isFinite(value) && value > 0);

const toObjects = (ids) => ids.map((id) => ({ id }));

const extractId = (item) => {
  if (Number.isFinite(Number(item))) return Number(item);
  if (item && Number.isFinite(Number(item.id))) return Number(item.id);
  return null;
};

const getIdString = (list = []) =>
  list
    .map((item) => extractId(item))
    .filter((id) => Number.isFinite(Number(id)))
    .join(", ");

const normalizeRuleFromResponse = (payload = {}) => {
  const source = payload?.data?.body?.data || payload?.data?.data || payload?.body?.data || payload || {};

  return {
    id: source.id || null,
    name: source.name || "",
    description: source.description || "",
    is_shareable: Boolean(source.is_shareable),
    devicesText: getIdString(source.devices || []),
    identifiersText: getIdString(source.identifiers || []),
    usersText: getIdString(source.users || []),
    domainsText: getIdString(source.domains || []),
    timeRulesText: getIdString(source.time_rules || []),
  };
};

export function AccessRulesModal({
  open,
  onClose,
  items = [],
  loading = false,
  complexId = null,
  complexName = "",
  total = 0,
  page = 1,
  itemsPerPage = 20,
  onPageChange,
  onRefresh,
  onCreate,
  onUpdate,
  onGetById,
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
  const activeComplexLabel =
    complexName || (complexId ? `#${complexId}` : t("devices.deviceUsers.selectComplex") || "Kompleks secin");

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
    return items.filter((rule) => {
      const name = String(rule.name || "").toLowerCase();
      const description = String(rule.description || "").toLowerCase();
      return name.includes(q) || description.includes(q);
    });
  }, [items, searchName]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setFormData(DEFAULT_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = async (rule) => {
    setFormErrors({});
    setFormMode("edit");
    setFormSaving(true);
    setFormOpen(true);

    try {
      if (onGetById && rule?.id) {
        const response = await onGetById(rule.id);
        setFormData(normalizeRuleFromResponse(response));
      } else {
        setFormData({
          id: rule?.id || null,
          name: rule?.name || "",
          description: rule?.description || "",
          is_shareable: rule?.is_shareable !== false,
          devicesText: "",
          identifiersText: "",
          usersText: "",
          domainsText: "",
          timeRulesText: "",
        });
      }
    } catch (error) {
      setFormErrors({ form: error?.message || t("common.error") || "Xeta bas verdi" });
      setFormData({
        id: rule?.id || null,
        name: rule?.name || "",
        description: rule?.description || "",
        is_shareable: rule?.is_shareable !== false,
        devicesText: "",
        identifiersText: "",
        usersText: "",
        domainsText: "",
        timeRulesText: "",
      });
    } finally {
      setFormSaving(false);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!Number(complexId)) errors.form = t("devices.deviceUsers.selectComplex") || "Kompleks secin";
    if (!formData.name?.trim()) errors.name = t("devices.accessRules.nameRequired") || "Ad teleb olunur";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...(formMode === "edit" && formData.id ? { id: Number(formData.id) } : {}),
      complex_id: Number(complexId),
      name: formData.name.trim(),
      description: formData.description || "",
      is_shareable: Boolean(formData.is_shareable),
      devices: toObjects(parseIds(formData.devicesText)),
      identifiers: toObjects(parseIds(formData.identifiersText)),
      users: toObjects(parseIds(formData.usersText)),
      domains: toObjects(parseIds(formData.domainsText)),
      time_rules: toObjects(parseIds(formData.timeRulesText)),
    };

    setFormSaving(true);
    try {
      if (formMode === "edit" && formData.id) {
        await onUpdate?.(payload);
      } else {
        await onCreate?.(payload);
      }

      setFormOpen(false);
      setFormData(DEFAULT_FORM);
      setFormErrors({});
    } catch (error) {
      setFormErrors({ form: error?.message || t("common.error") || "Xeta bas verdi" });
    } finally {
      setFormSaving(false);
    }
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
              <Cog6ToothIcon className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <Typography variant="h6" className="text-white font-bold">
                {t("devices.accessRules.title") || "Cihaz icazələri"}
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
            <div className="hidden lg:block overflow-x-auto max-h-[36vh]">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                  <tr>
                    {["ID", "Name", "Description", "Shareable", "Devices", ""].map((h) => (
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
                  {filteredItems.map((rule) => {
                    const deviceCount = Number(rule.deviceCount ?? rule.devices_count ?? rule.devices?.length ?? 0);

                    return (
                      <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">#{rule.id}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{rule.name || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{rule.description || "-"}</td>
                        <td className="px-4 py-3">
                          <Chip
                            value={rule.is_shareable ? "Yes" : "No"}
                            className={`text-[11px] font-semibold w-fit normal-case ${
                              rule.is_shareable
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{deviceCount}</td>
                        <td className="px-4 py-3 text-right">
                          <IconButton variant="text" size="sm" color="blue" onClick={() => handleOpenEdit(rule)}>
                            <PencilSquareIcon className="h-4 w-4" />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}

                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                        {t("common.loading") || "Yuklenir..."}
                      </td>
                    </tr>
                  )}

                  {!loading && filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                        {t("common.noData") || "Melumat yoxdur"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden p-3 space-y-3 max-h-[36vh] overflow-y-auto">
              {loading ? (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                  {t("common.loading") || "Yuklenir..."}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                  {t("common.noData") || "Melumat yoxdur"}
                </div>
              ) : (
                filteredItems.map((rule) => {
                  const deviceCount = Number(rule.deviceCount ?? rule.devices_count ?? rule.devices?.length ?? 0);

                  return (
                    <div
                      key={rule.id}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Typography className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            #{rule.id} - {rule.name || "-"}
                          </Typography>
                          <Typography className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {rule.description || "-"}
                          </Typography>
                          <div className="mt-2 flex items-center gap-2">
                            <Chip
                              value={rule.is_shareable ? "Shareable" : "Private"}
                              className={`text-[10px] font-semibold normal-case ${
                                rule.is_shareable
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            />
                            <Typography className="text-xs text-gray-600 dark:text-gray-300">
                              {(t("devices.accessRules.deviceCount") || "Cihaz sayı") + ": "}
                              <b>{deviceCount}</b>
                            </Typography>
                          </div>
                        </div>

                        <IconButton variant="text" size="sm" color="blue" onClick={() => handleOpenEdit(rule)}>
                          <PencilSquareIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  );
                })
              )}
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
              <Cog6ToothIcon className="h-6 w-6 text-white" />
            </div>
            <Typography variant="h6" className="text-white font-bold">
              {formMode === "edit"
                ? t("devices.accessRules.edit") || "Icaze qaydasini redakte et"
                : t("devices.accessRules.add") || "Yeni icaze qaydasi"}
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
            label={t("devices.accessRules.name") || "Ad"}
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            error={formErrors.name}
          />

          <CustomTextarea
            label={t("devices.accessRules.description") || "Tesvir"}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5">
            <Switch
              color="green"
              checked={Boolean(formData.is_shareable)}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_shareable: e.target.checked }))}
              label={
                <Typography className="text-sm text-gray-700 dark:text-gray-200">
                  {t("devices.accessRules.isShareable") || "Paylasila bilen"}
                </Typography>
              }
            />
          </div>

          <CustomInput
            label={t("devices.accessRules.devices") || "Device IDs (comma separated)"}
            value={formData.devicesText}
            onChange={(e) => setFormData((prev) => ({ ...prev, devicesText: e.target.value }))}
            placeholder="139, 136"
          />

          <CustomInput
            label={t("devices.accessRules.identifiers") || "Identifier IDs (comma separated)"}
            value={formData.identifiersText}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifiersText: e.target.value }))}
            placeholder="12238, 12277"
          />

          <CustomInput
            label={t("devices.accessRules.users") || "User IDs (comma separated)"}
            value={formData.usersText}
            onChange={(e) => setFormData((prev) => ({ ...prev, usersText: e.target.value }))}
            placeholder="2001, 2002"
          />

          <CustomInput
            label={t("devices.accessRules.domains") || "Domain IDs (comma separated)"}
            value={formData.domainsText}
            onChange={(e) => setFormData((prev) => ({ ...prev, domainsText: e.target.value }))}
            placeholder="1, 2"
          />

          <CustomInput
            label={t("devices.accessRules.timeRules") || "Time rule IDs (comma separated)"}
            value={formData.timeRulesText}
            onChange={(e) => setFormData((prev) => ({ ...prev, timeRulesText: e.target.value }))}
            placeholder="11, 12"
          />

          {formErrors.form ? (
            <Typography variant="small" color="red" className="font-medium">
              {formErrors.form}
            </Typography>
          ) : null}
        </DialogBody>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 gap-2">
          <Button variant="text" color="blue-gray" onClick={() => setFormOpen(false)} disabled={formSaving}>
            {t("devices.actions.close") || "Bagla"}
          </Button>
          <Button onClick={handleSave} disabled={formSaving} style={gradientStyle} className="text-white shadow-none">
            {formSaving
              ? t("common.loading") || "Yuklenir..."
              : formMode === "edit"
                ? t("devices.actions.save") || "Yadda saxla"
                : t("devices.actions.add") || "Elave et"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
