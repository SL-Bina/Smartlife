import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Alert,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useManagement } from "@/context";
import { useComplexData } from "./hooks/useComplexData";
import { useComplexFilters } from "./hooks/useComplexFilters";
import { useComplexForm } from "./hooks/useComplexForm";

const ComplexPage = () => {
  const { t } = useTranslation();
  const { addComplex, updateComplex, deleteComplex, refreshKey } = useManagement();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useComplexFilters();
  const { complexes, loading, error: dataError, pagination } = useComplexData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromComplex } = useComplexForm();

  // Reset page when filters change
  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);

  const handleFilterApply = () => {
    setPage(1);
    applyFilters();
  };

  const handleFilterClear = () => {
    clearFilters();
    setPage(1);
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedItem(null);
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setItemToView(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromComplex(item);
    setEditOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await addComplex(formData);
      setSuccess(t("complexes.create.success") || "Kompleks uğurla yaradıldı");
      setCreateOpen(false);
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Create Complex Error:", err);
      
      // Xəta mesajını formatla
      let errorMessage = t("complexes.create.error") || "Kompleks yaradılarkən xəta baş verdi";
      
      if (err.allErrors && Array.isArray(err.allErrors)) {
        // Bütün xəta mesajlarını göstər
        errorMessage = err.allErrors.join(", ");
      } else if (err.errors) {
        // Xəta obyektindən mesajları çıxar
        const errorMessages = Object.values(err.errors).flat();
        errorMessage = errorMessages.join(", ");
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (selectedItem) {
      try {
        setSaving(true);
        setError(null);
        setSuccess(null);
        await updateComplex(selectedItem.id, formData);
        setSuccess(t("complexes.edit.success") || "Kompleks uğurla yeniləndi");
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        const errorMessage = err.message || err.errors || (t("complexes.edit.error") || "Kompleks yenilənərkən xəta baş verdi");
        setError(errorMessage);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);
      await deleteComplex(itemToDelete.id);
      setSuccess(t("complexes.delete.success") || "Kompleks uğurla silindi");
      setDeleteOpen(false);
      setItemToDelete(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.message || (t("complexes.delete.error") || "Kompleks silinərkən xəta baş verdi");
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Pagination functions
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= (pagination.totalPages || 1)) {
      setPage(pageNumber);
    }
  };

  const goToPrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (page < (pagination.totalPages || 1)) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
        <h3 className="text-white font-bold">{t("complexes.pageTitle")}</h3>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <Alert color="red" className="mb-4" onClose={() => setError(null)}>
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      )}
      {success && (
        <Alert color="green" className="mb-4" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {dataError && (
        <Alert color="red" className="mb-4">
          {dataError}
        </Alert>
      )}

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
            <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
              {t("complexes.filter.title")}
            </Typography>
          </div>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setFilterOpen(false)}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("complexes.filter.name")}
              </Typography>
              <Input
                placeholder={t("complexes.filter.enterName")}
                value={filters.name || ""}
                onChange={(e) => updateFilter("name", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("complexes.filter.address") || "Ünvan"}
              </Typography>
              <Input
                placeholder={t("complexes.filter.enterAddress") || "Ünvan daxil edin"}
                value={filters.address || ""}
                onChange={(e) => updateFilter("address", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("complexes.filter.status") || "Status"}
              </Typography>
              <select
                value={filters.status || ""}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="" className="dark:bg-gray-800 dark:text-gray-300">
                  {t("complexes.filter.all") || "Hamısı"}
                </option>
                <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
                  {t("complexes.filter.active") || "Aktiv"}
                </option>
                <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
                  {t("complexes.filter.inactive") || "Passiv"}
                </option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("complexes.filter.email") || "Email"}
              </Typography>
              <Input
                placeholder={t("complexes.filter.enterEmail") || "Email daxil edin"}
                value={filters.email || ""}
                onChange={(e) => updateFilter("email", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
                type="email"
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("complexes.filter.phone") || "Telefon"}
              </Typography>
              <Input
                placeholder={t("complexes.filter.enterPhone") || "Telefon daxil edin"}
                value={filters.phone || ""}
                onChange={(e) => updateFilter("phone", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
                type="tel"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outlined" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.clear") || "Təmizlə"}
          </Button>
          <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.search") || "Axtar"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create complex modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="xl" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("complexes.create.title")}
          </Typography>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => { setCreateOpen(false); resetForm(); setError(null); }}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
          <div className="space-y-6 py-2">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.basicInfo") || "Əsas Məlumatlar"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                    {t("complexes.form.name")} <span className="text-red-500">*</span>
                  </Typography>
                  <Input
                    placeholder={t("complexes.form.enterName")}
                    value={formData.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "!min-w-0" }}
                    required
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                    {t("complexes.form.status")} <span className="text-red-500">*</span>
                  </Typography>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
                      {t("complexes.form.active") || "Aktiv"}
                    </option>
                    <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
                      {t("complexes.form.inactive") || "Passiv"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <MapPinIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.metaInfo") || "Yerləşmə Məlumatları"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                    {t("complexes.form.latitude") || "Enlik"}
                  </Typography>
                  <Input
                    placeholder={t("complexes.form.enterLatitude") || "Enlik daxil edin"}
                    value={formData.meta?.lat || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= -90 && parseFloat(value) <= 90)) {
                        updateField("meta.lat", value);
                      }
                    }}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "!min-w-0" }}
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="-90 ilə 90 arası"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    {t("complexes.form.longitude") || "Uzunluq"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterLongitude") || "Uzunluq daxil edin"}
                    value={formData.meta?.lng || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= -180 && parseFloat(value) <= 180)) {
                        updateField("meta.lng", value);
                      }
                    }}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="-180 ilə 180 arası"
                  />
                </div>

                <div className="md:col-span-2">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    {t("complexes.form.description") || "Təsvir"}
                  </Typography>
                  <textarea
                    placeholder={t("complexes.form.enterDescription") || "Təsvir daxil edin"}
                    value={formData.meta?.desc || ""}
                    onChange={(e) => updateField("meta.desc", e.target.value)}
                    className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    {t("complexes.form.address") || "Ünvan"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterAddress") || "Ünvan daxil edin"}
                    value={formData.meta?.address || ""}
                    onChange={(e) => updateField("meta.address", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <EnvelopeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.contactInfo") || "Əlaqə Məlumatları"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    {t("complexes.form.email") || "Email"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterEmail") || "Email daxil edin"}
                    value={formData.meta?.email || ""}
                    onChange={(e) => updateField("meta.email", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="email"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    {t("complexes.form.phone") || "Telefon"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterPhone") || "Telefon daxil edin"}
                    value={formData.meta?.phone || ""}
                    onChange={(e) => updateField("meta.phone", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                    {t("complexes.form.website") || "Veb sayt"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterWebsite") || "Veb sayt daxil edin"}
                    value={formData.meta?.website || ""}
                    onChange={(e) => updateField("meta.website", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Color Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <SwatchIcon className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.colorCode") || "Rəng Kodu"}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("complexes.form.enterColorCode") || "Rəng kodu daxil edin"}
                </Typography>
                <div className="flex gap-3 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("complexes.form.colorPicker") || "Rəng seçin"}
                    </label>
                    <input
                      type="color"
                      value={formData.meta?.color_code || "#237832"}
                      onChange={(e) => updateField("meta.color_code", e.target.value)}
                      className="w-16 h-12 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label={t("complexes.form.enterColorCode") || "Rəng kodu"}
                      value={formData.meta?.color_code || ""}
                      onChange={(e) => updateField("meta.color_code", e.target.value)}
                      className="dark:text-white"
                      labelProps={{ className: "dark:text-gray-400" }}
                      placeholder="#237832"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    />
                  </div>
                  {formData.meta?.color_code && (
                    <div
                      className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: formData.meta.color_code }}
                      title={formData.meta.color_code}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => { setCreateOpen(false); resetForm(); setError(null); }}
            disabled={saving}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
          >
            {t("complexes.create.cancel")}
          </Button>
          <Button
            color="green"
            onClick={handleCreateSave}
            disabled={saving}
            className="dark:bg-green-600 dark:hover:bg-green-700 min-w-[120px]"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("complexes.create.saving") || "Saxlanılır..."}
              </span>
            ) : (
              t("complexes.create.save")
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit complex modal - same as create but with edit title */}
      <Dialog open={editOpen} handler={setEditOpen} size="xl" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("complexes.edit.title")}
          </Typography>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => { setEditOpen(false); setSelectedItem(null); resetForm(); setError(null); }}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
          <div className="space-y-6 py-2">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.basicInfo") || "Əsas Məlumatlar"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                    {t("complexes.form.name")} <span className="text-red-500">*</span>
                  </Typography>
                  <Input
                    placeholder={t("complexes.form.enterName")}
                    value={formData.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "!min-w-0" }}
                    required
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                    {t("complexes.form.status")} <span className="text-red-500">*</span>
                  </Typography>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
                      {t("complexes.form.active") || "Aktiv"}
                    </option>
                    <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
                      {t("complexes.form.inactive") || "Passiv"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <MapPinIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.metaInfo") || "Yerləşmə Məlumatları"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                    {t("complexes.form.latitude") || "Enlik"}
                  </Typography>
                  <Input
                    placeholder={t("complexes.form.enterLatitude") || "Enlik daxil edin"}
                    value={formData.meta?.lat || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= -90 && parseFloat(value) <= 90)) {
                        updateField("meta.lat", value);
                      }
                    }}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "!min-w-0" }}
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="-90 ilə 90 arası"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    {t("complexes.form.longitude") || "Uzunluq"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterLongitude") || "Uzunluq daxil edin"}
                    value={formData.meta?.lng || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= -180 && parseFloat(value) <= 180)) {
                        updateField("meta.lng", value);
                      }
                    }}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="-180 ilə 180 arası"
                  />
                </div>

                <div className="md:col-span-2">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    {t("complexes.form.description") || "Təsvir"}
                  </Typography>
                  <textarea
                    placeholder={t("complexes.form.enterDescription") || "Təsvir daxil edin"}
                    value={formData.meta?.desc || ""}
                    onChange={(e) => updateField("meta.desc", e.target.value)}
                    className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    {t("complexes.form.address") || "Ünvan"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterAddress") || "Ünvan daxil edin"}
                    value={formData.meta?.address || ""}
                    onChange={(e) => updateField("meta.address", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <EnvelopeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.contactInfo") || "Əlaqə Məlumatları"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                    {t("complexes.form.email") || "Email"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterEmail") || "Email daxil edin"}
                    value={formData.meta?.email || ""}
                    onChange={(e) => updateField("meta.email", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="email"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                    {t("complexes.form.phone") || "Telefon"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterPhone") || "Telefon daxil edin"}
                    value={formData.meta?.phone || ""}
                    onChange={(e) => updateField("meta.phone", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                    <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                    {t("complexes.form.website") || "Veb sayt"}
                  </Typography>
                  <Input
                    label={t("complexes.form.enterWebsite") || "Veb sayt daxil edin"}
                    value={formData.meta?.website || ""}
                    onChange={(e) => updateField("meta.website", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {/* Color Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <SwatchIcon className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.colorCode") || "Rəng Kodu"}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("complexes.form.enterColorCode") || "Rəng kodu daxil edin"}
                </Typography>
                <div className="flex gap-3 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t("complexes.form.colorPicker") || "Rəng seçin"}
                    </label>
                    <input
                      type="color"
                      value={formData.meta?.color_code || "#237832"}
                      onChange={(e) => updateField("meta.color_code", e.target.value)}
                      className="w-16 h-12 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label={t("complexes.form.enterColorCode") || "Rəng kodu"}
                      value={formData.meta?.color_code || ""}
                      onChange={(e) => updateField("meta.color_code", e.target.value)}
                      className="dark:text-white"
                      labelProps={{ className: "dark:text-gray-400" }}
                      placeholder="#237832"
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    />
                  </div>
                  {formData.meta?.color_code && (
                    <div
                      className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: formData.meta.color_code }}
                      title={formData.meta.color_code}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => { setEditOpen(false); setSelectedItem(null); resetForm(); setError(null); }}
            disabled={saving}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
          >
            {t("complexes.edit.cancel")}
          </Button>
          <Button
            color="blue"
            onClick={handleEditSave}
            disabled={saving}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 min-w-[120px]"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("complexes.edit.saving") || "Saxlanılır..."}
              </span>
            ) : (
              t("complexes.edit.save")
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete complex modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
              {t("complexes.delete.title") || "Kompleksi sil"}
            </Typography>
          </div>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => { setDeleteOpen(false); setItemToDelete(null); }}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 py-6">
          <Typography className="dark:text-gray-300">
            {t("complexes.delete.message") || "Bu kompleksi silmək istədiyinizə əminsiniz?"} {itemToDelete?.name}
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outlined" color="blue-gray" onClick={() => { setDeleteOpen(false); setItemToDelete(null); }} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("complexes.delete.cancel") || "Ləğv et"}
          </Button>
          <Button color="red" onClick={handleDeleteConfirm} disabled={deleting} className="dark:bg-red-600 dark:hover:bg-red-700">
            {deleting ? t("complexes.delete.deleting") || "Silinir..." : t("complexes.delete.confirm") || "Sil"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)} className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20">
              {t("complexes.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("complexes.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("complexes.loading")}
              </Typography>
            </div>
          ) : complexes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="h6" className="text-blue-gray-400 dark:text-gray-400">
                {t("complexes.noData") || "Məlumat tapılmadı"}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      {[t("complexes.table.id"), t("complexes.table.name"), t("complexes.table.address"), t("complexes.table.buildingsCount"), t("complexes.table.actions")].map(
                        (el, idx) => (
                          <th
                            key={el}
                            className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                              idx === 4 ? "text-right" : ""
                            }`}
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                            >
                              {el}
                            </Typography>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {complexes.map((row, key) => {
                      const className = `py-3 px-6 ${
                        key === complexes.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
                      }`;
                      return (
                        <tr key={row.id} className="dark:hover:bg-gray-700/50">
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.id}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold dark:text-white"
                            >
                              {row.name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.meta?.address || "-"}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.buildings?.length || 0}
                            </Typography>
                          </td>
                          <td className={`${className} text-right`}>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  <EllipsisVerticalIcon
                                    strokeWidth={2}
                                    className="h-5 w-5"
                                  />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                                <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.view")}</MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.edit")}</MenuItem>
                                <MenuItem onClick={() => handleDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.delete")}</MenuItem>
                              </MenuList>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet & mobile cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
                {complexes.map((row) => (
                  <Card
                    key={row.id}
                    className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800"
                    >
                    <CardBody className="space-y-2 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold dark:text-white"
                        >
                          {row.name}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon
                                strokeWidth={2}
                                className="h-5 w-5"
                              />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                            <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.view")}</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.edit")}</MenuItem>
                            <MenuItem onClick={() => handleDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.delete")}</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("complexes.table.id")}: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("complexes.table.address")}: {row.meta?.address || "-"}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("complexes.table.buildingsCount")}: {row.buildings?.length || 0}
                      </Typography>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 px-6 pt-4">
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={goToPrev}
                  disabled={page === 1}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("complexes.pagination.prev")}
                </Button>
                {Array.from({ length: pagination.totalPages || 1 }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === page ? "filled" : "text"}
                      size="sm"
                      color={pageNumber === page ? "blue" : "blue-gray"}
                      onClick={() => goToPage(pageNumber)}
                      className={`min-w-[32px] px-2 ${
                        pageNumber === page 
                          ? "dark:bg-blue-600 dark:hover:bg-blue-700" 
                          : "dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                )}
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={goToNext}
                  disabled={page >= (pagination.totalPages || 1)}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("complexes.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ComplexPage;
