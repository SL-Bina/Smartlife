import React, { useState, useEffect } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Input, Select, Option, Typography,
} from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import { EMPTY_FILTERS } from "@/hooks/finance/invoices/useInvoicesFilters";
import { CustomInput } from "@/components/ui/CustomInput";

const INVOICE_TYPE_VALUES = ["daily", "weekly", "monthly", "quarterly", "biannually", "yearly", "one_time"];
const INVOICE_STATUS_VALUES = ["paid", "not_paid", "pending", "overdue", "declined", "draft", "pre_paid"];

const EMPTY_CASCADE = {
  mtkId: null,
  mtkLabel: "",
  complexId: null,
  complexLabel: "",
  buildingId: null,
  buildingLabel: "",
  blockId: null,
  blockLabel: "",
  propertyId: null,
  propertyLabel: "",
};

export function SearchModal({ open, onClose, onSearch, currentFilters = {}, variant, currentSearch = {} }) {
  if (variant === "property") {
    return (
      <PropertySearchModalInline
        open={open}
        onClose={onClose}
        onSearch={onSearch}
        currentSearch={currentSearch}
      />
    );
  }

  if (variant === "block") {
    return (
      <BlockSearchModalInline
        open={open}
        onClose={onClose}
        onSearch={onSearch}
        currentSearch={currentSearch}
      />
    );
  }

  if (variant === "building") {
    return (
      <BuildingSearchModalInline
        open={open}
        onClose={onClose}
        onSearch={onSearch}
        currentSearch={currentSearch}
      />
    );
  }

  if (variant === "complex") {
    return (
      <ComplexSearchModalInline
        open={open}
        onClose={onClose}
        onSearch={onSearch}
        currentSearch={currentSearch}
      />
    );
  }

  if (variant === "mtk") {
    return (
      <MtkSearchModal
        open={open}
        onClose={onClose}
        onSearch={onSearch}
        currentSearch={currentSearch}
      />
    );
  }

  const { t } = useTranslation();
  const [f, setF]         = useState(EMPTY_FILTERS);
  const [cas, setCas]     = useState(EMPTY_CASCADE);
  const [svc, setSvc]     = useState({ id: null, label: "" }); // xidmət

  // Modal açılanda mövcud filterləri yüklə
  useEffect(() => {
    if (open) {
      setF({ ...EMPTY_FILTERS, ...currentFilters });
      setCas(EMPTY_CASCADE);
      setSvc({ id: null, label: "" });
    }
  }, [open]);

  const set = (key, val) => setF((prev) => ({ ...prev, [key]: val }));

  const setMtk = (id, label) =>
    setCas({ ...EMPTY_CASCADE, mtkId: id, mtkLabel: label });
  const setComplex = (id, label) =>
    setCas((p) => ({ ...p, complexId: id, complexLabel: label, buildingId: null, buildingLabel: "", blockId: null, blockLabel: "", propertyId: null, propertyLabel: "" }));
  const setBuilding = (id, label) =>
    setCas((p) => ({ ...p, buildingId: id, buildingLabel: label, blockId: null, blockLabel: "", propertyId: null, propertyLabel: "" }));
  const setBlock = (id, label) =>
    setCas((p) => ({ ...p, blockId: id, blockLabel: label, propertyId: null, propertyLabel: "" }));
  const setProperty = (id, label) =>
    setCas((p) => ({ ...p, propertyId: id, propertyLabel: label }));

  const handleSearch = () => {
    const result = {
      ...f,
      serviceIds:  svc.id  ? [svc.id] : [],
      propertyIds: cas.propertyId ? [cas.propertyId] : [],
    };
    onSearch(result);
    onClose();
  };

  const handleReset = () => {
    setF(EMPTY_FILTERS);
    setCas(EMPTY_CASCADE);
    setSvc({ id: null, label: "" });
    onSearch({});
    onClose();
  };

  const inputProps = {
    className: "dark:text-gray-200",
    labelProps: { className: "dark:text-gray-300" },
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold dark:text-white">
            {t("invoices.searchModal.title") || "Ətraflı Axtarış"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" onClick={onClose}>
          <XMarkIcon className="h-5 w-5 dark:text-white" />
        </div>
      </DialogHeader>

      <DialogBody divider className="dark:bg-gray-800 overflow-y-auto max-h-[72vh]">
        <div className="space-y-5 py-2">

          {/* ── Ümumi filterlər ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={t("invoices.searchModal.invoiceId") || "Faktura ID"}
              value={f.invoiceId}
              onChange={(e) => set("invoiceId", e.target.value)}
              {...inputProps}
            />
            <Select
              label={t("invoices.table.status") || "Status"}
              value={f.status}
              onChange={(val) => set("status", val || "")}
              className="dark:text-gray-200"
              labelProps={{ className: "dark:text-gray-300" }}
            >
              <Option value="">{t("invoices.searchModal.all") || "Hamısı"}</Option>
              {INVOICE_STATUS_VALUES.map((v) => (
                <Option key={v} value={v}>{t(`invoices.status.${v}`) || v}</Option>
              ))}
            </Select>
            <Select
              label={t("invoices.searchModal.type") || "Növ"}
              value={f.type}
              onChange={(val) => set("type", val || "")}
              className="dark:text-gray-200"
              labelProps={{ className: "dark:text-gray-300" }}
            >
              <Option value="">{t("invoices.searchModal.all") || "Hamısı"}</Option>
              {INVOICE_TYPE_VALUES.map((v) => (
                <Option key={v} value={v}>{t(`invoices.types.${v}`) || v}</Option>
              ))}
            </Select>
          </div>

          {/* ── Xidmət (API-dən) ── */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{t("invoices.searchModal.service") || "Xidmət"}</p>
            <AsyncSearchSelect
              label={t("invoices.searchModal.selectService") || "Xidmət seçin"}
              endpoint="/module/services/list"
              value={svc.id}
              selectedLabel={svc.label}
              onChange={(id, item) => setSvc({ id, label: item?.name || "" })}
              labelKey="name"
              valueKey="id"
              allowClear
            />
          </div>

          <Divider label={t("invoices.searchModal.cascadeSection") || "Mənzil seçimi"} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AsyncSearchSelect
              label="MTK"
              endpoint="/search/module/mtk"
              value={cas.mtkId}
              selectedLabel={cas.mtkLabel}
              onChange={(id, item) => setMtk(id, item?.name || "")}
              labelKey="name"
              valueKey="id"
              allowClear
            />
            <AsyncSearchSelect
              key={`complex-${cas.mtkId}`}
              label="Kompleks"
              endpoint="/search/module/complex"
              searchParams={cas.mtkId ? { mtk_ids: [cas.mtkId] } : {}}
              value={cas.complexId}
              selectedLabel={cas.complexLabel}
              onChange={(id, item) => setComplex(id, item?.name || "")}
              labelKey="name"
              valueKey="id"
              allowClear
              disabled={!cas.mtkId}
            />
            <AsyncSearchSelect
              key={`building-${cas.complexId}`}
              label="Bina"
              endpoint="/search/module/building"
              searchParams={cas.complexId ? { complex_ids: [cas.complexId] } : {}}
              value={cas.buildingId}
              selectedLabel={cas.buildingLabel}
              onChange={(id, item) => setBuilding(id, item?.name || "")}
              labelKey="name"
              valueKey="id"
              allowClear
              disabled={!cas.complexId}
            />
            <AsyncSearchSelect
              key={`block-${cas.buildingId}`}
              label="Blok"
              endpoint="/search/module/block"
              searchParams={cas.buildingId ? { building_ids: [cas.buildingId] } : {}}
              value={cas.blockId}
              selectedLabel={cas.blockLabel}
              onChange={(id, item) => setBlock(id, item?.name || "")}
              labelKey="name"
              valueKey="id"
              allowClear
              disabled={!cas.buildingId}
            />
          </div>

          <AsyncSearchSelect
            key={`property-${cas.blockId}`}
            label="Mənzil"
            endpoint="/search/module/property"
            searchParams={cas.blockId ? { block_ids: [cas.blockId] } : {}}
            value={cas.propertyId}
            selectedLabel={cas.propertyLabel}
            onChange={(id, item) => setProperty(id, item?.name || item?.apartment_number || "")}
            labelKey="name"
            valueKey="id"
            allowClear
            disabled={!cas.blockId}
          />

          {/* ── Tarix aralıqları ── */}
          <Divider label={t("invoices.searchModal.dateRangesSection") || "Tarix aralıqları"} />

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t("invoices.searchModal.paymentDateRange") || "Ödəniş tarixi aralığı"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t("invoices.searchModal.dateFrom") || "Başlanğıc"} type="date" value={f.paidAtFrom} onChange={(e) => set("paidAtFrom", e.target.value)} {...inputProps} />
              <Input label={t("invoices.searchModal.dateTo") || "Son"} type="date" value={f.paidAtTo} onChange={(e) => set("paidAtTo", e.target.value)} {...inputProps} />
            </div>
          </div>

          {/* ── Məbləğ aralıqları ── */}
          <Divider label={t("invoices.searchModal.amountRangesSection") || "Məbləğ aralıqları"} />

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t("invoices.searchModal.invoiceAmount") || "Faktura məbləği (₼)"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t("invoices.searchModal.min") || "Minimum"} type="number" min="0" value={f.amountFrom} onChange={(e) => set("amountFrom", e.target.value)} {...inputProps} />
              <Input label={t("invoices.searchModal.max") || "Maksimum"} type="number" min="0" value={f.amountTo} onChange={(e) => set("amountTo", e.target.value)} {...inputProps} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t("invoices.searchModal.paidAmountLabel") || "Ödənilmiş məbləğ (₼)"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t("invoices.searchModal.min") || "Minimum"} type="number" min="0" value={f.amountPaidFrom} onChange={(e) => set("amountPaidFrom", e.target.value)} {...inputProps} />
              <Input label={t("invoices.searchModal.max") || "Maksimum"} type="number" min="0" value={f.amountPaidTo} onChange={(e) => set("amountPaidTo", e.target.value)} {...inputProps} />
            </div>
          </div>

        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 gap-2">
        <Button variant="text" color="gray" onClick={handleReset}>{t("invoices.searchModal.reset") || "Təmizlə"}</Button>
        <Button variant="text" color="gray" onClick={onClose}>{t("buttons.cancel") || "Ləğv et"}</Button>
        <Button variant="filled" color="blue" onClick={handleSearch} className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-4 w-4" />
          {t("invoices.searchModal.search") || "Axtar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function PropertySearchModalInline({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchData, setSearchData] = useState({
    name: "",
    status: "",
    property_type: "",
    area: "",
    floor: "",
    apartment_number: "",
  });

  useEffect(() => {
    if (open) {
      setSearchData({
        name: currentSearch.name || "",
        status: currentSearch.status || "",
        property_type: currentSearch.property_type || "",
        area: currentSearch.area || "",
        floor: currentSearch.floor || "",
        apartment_number: currentSearch.apartment_number || "",
      });
    }
  }, [open, currentSearch]);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && String(value).trim()) {
        acc[key] = String(value).trim();
      }
      return acc;
    }, {});
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    setSearchData({ name: "", status: "", property_type: "", area: "", floor: "", apartment_number: "" });
    onSearch?.({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <Dialog open={!!open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <Typography variant="h5" className="text-gray-900 dark:text-white font-bold">Mənzil Axtarış və Filtrləmə</Typography>
        <Button variant="text" size="sm" onClick={onClose} className="text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-white/20 rounded-full">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput label="Ad" value={searchData.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select value={searchData.status} onChange={(e) => handleFieldChange("status", e.target.value)} className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-teal-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option value="">Hamısı</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Qeyri-aktiv</option>
            </select>
          </div>
          <CustomInput label="Mənzil tipi" value={searchData.property_type} onChange={(e) => handleFieldChange("property_type", e.target.value)} />
          <CustomInput label="Sahə" value={searchData.area} onChange={(e) => handleFieldChange("area", e.target.value)} />
          <CustomInput label="Mərtəbə" value={searchData.floor} onChange={(e) => handleFieldChange("floor", e.target.value)} />
          <CustomInput label="Mənzil №" value={searchData.apartment_number} onChange={(e) => handleFieldChange("apartment_number", e.target.value)} />
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outlined" onClick={handleClear}>Təmizlə</Button>
          <Button variant="outlined" onClick={onClose}>Ləğv et</Button>
        </div>
        <Button onClick={handleSearch} className="text-white bg-blue-600 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Axtarış
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function BlockSearchModalInline({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchData, setSearchData] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    if (open) {
      setSearchData({
        name: currentSearch.name || "",
        status: currentSearch.status || "",
      });
    }
  }, [open, currentSearch]);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && String(value).trim()) {
        acc[key] = String(value).trim();
      }
      return acc;
    }, {});
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    setSearchData({ name: "", status: "" });
    onSearch?.({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <Dialog open={!!open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <Typography variant="h5" className="text-gray-900 dark:text-white font-bold">Blok Axtarış və Filtrləmə</Typography>
        <Button variant="text" size="sm" onClick={onClose} className="text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-white/20 rounded-full">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput label="Ad" value={searchData.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={searchData.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Hamısı</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Qeyri-aktiv</option>
            </select>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outlined" onClick={handleClear}>Təmizlə</Button>
          <Button variant="outlined" onClick={onClose}>Ləğv et</Button>
        </div>
        <Button onClick={handleSearch} className="text-white bg-blue-600 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Axtarış
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function BuildingSearchModalInline({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchData, setSearchData] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    if (open) {
      setSearchData({
        name: currentSearch.name || "",
        status: currentSearch.status || "",
      });
    }
  }, [open, currentSearch]);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && String(value).trim()) {
        acc[key] = String(value).trim();
      }
      return acc;
    }, {});
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    setSearchData({ name: "", status: "" });
    onSearch?.({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <Dialog open={!!open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <Typography variant="h5" className="text-gray-900 dark:text-white font-bold">Bina Axtarış və Filtrləmə</Typography>
        <Button variant="text" size="sm" onClick={onClose} className="text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-white/20 rounded-full">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput label="Ad" value={searchData.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={searchData.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Hamısı</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Qeyri-aktiv</option>
            </select>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outlined" onClick={handleClear}>Təmizlə</Button>
          <Button variant="outlined" onClick={onClose}>Ləğv et</Button>
        </div>
        <Button onClick={handleSearch} className="text-white bg-blue-600 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Axtarış
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function ComplexSearchModalInline({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchData, setSearchData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    color_code: "",
  });

  useEffect(() => {
    if (open) {
      setSearchData({
        name: currentSearch.name || "",
        address: currentSearch.address || "",
        phone: currentSearch.phone || "",
        email: currentSearch.email || "",
        website: currentSearch.website || "",
        color_code: currentSearch.color_code || "",
      });
    }
  }, [open, currentSearch]);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && String(value).trim()) {
        acc[key] = String(value).trim();
      }
      return acc;
    }, {});
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    setSearchData({ name: "", address: "", phone: "", email: "", website: "", color_code: "" });
    onSearch?.({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <Dialog open={!!open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <Typography variant="h5" className="text-gray-900 dark:text-white font-bold">Complex Axtarış və Filtrləmə</Typography>
        <Button variant="text" size="sm" onClick={onClose} className="text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-white/20 rounded-full">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput label="Ad" value={searchData.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
          <CustomInput label="Ünvan" value={searchData.address} onChange={(e) => handleFieldChange("address", e.target.value)} />
          <CustomInput label="Telefon" value={searchData.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} />
          <CustomInput label="E-mail" value={searchData.email} onChange={(e) => handleFieldChange("email", e.target.value)} />
          <CustomInput label="Website" value={searchData.website} onChange={(e) => handleFieldChange("website", e.target.value)} />
          <CustomInput label="Rəng kodu" value={searchData.color_code} onChange={(e) => handleFieldChange("color_code", e.target.value)} />
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outlined" onClick={handleClear}>Təmizlə</Button>
          <Button variant="outlined" onClick={onClose}>Ləğv et</Button>
        </div>
        <Button onClick={handleSearch} className="text-white bg-blue-600 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Axtarış
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function MtkSearchModal({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchData, setSearchData] = useState({
    phone: "",
    email: "",
    website: "",
    desc: "",
    lat: "",
    lng: "",
    color_code: "",
  });

  useEffect(() => {
    if (open) {
      setSearchData({
        phone: currentSearch.phone || "",
        email: currentSearch.email || "",
        website: currentSearch.website || "",
        desc: currentSearch.desc || "",
        lat: currentSearch.lat || "",
        lng: currentSearch.lng || "",
        color_code: currentSearch.color_code || "",
      });
    }
  }, [open, currentSearch]);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && String(value).trim()) {
        acc[key] = String(value).trim();
      }
      return acc;
    }, {});
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    const emptyData = {
      phone: "",
      email: "",
      website: "",
      desc: "",
      lat: "",
      lng: "",
      color_code: "",
    };
    setSearchData(emptyData);
    onSearch?.({});
    onClose?.();
  };

  if (!open) return null;

  return (
    <Dialog open={!!open} handler={onClose} size="xl" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 backdrop-blur-sm">
            <FunnelIcon className="h-6 w-6 text-blue-500" />
          </div>
          <Typography variant="h5" className="text-gray-900 dark:text-white font-bold">MTK Axtarış və Filtrləmə</Typography>
        </div>
        <Button variant="text" size="sm" onClick={onClose} className="text-gray-700 dark:text-white hover:bg-gray-200/50 dark:hover:bg-white/20 rounded-full">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput label="Telefon" value={searchData.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} />
          <CustomInput label="E-mail" value={searchData.email} onChange={(e) => handleFieldChange("email", e.target.value)} />
          <CustomInput label="Website" value={searchData.website} onChange={(e) => handleFieldChange("website", e.target.value)} />
          <CustomInput label="Təsvir" value={searchData.desc} onChange={(e) => handleFieldChange("desc", e.target.value)} />
          <CustomInput label="Latitude" value={searchData.lat} onChange={(e) => handleFieldChange("lat", e.target.value)} />
          <CustomInput label="Longitude" value={searchData.lng} onChange={(e) => handleFieldChange("lng", e.target.value)} />
          <div className="md:col-span-2">
            <CustomInput label="Rəng kodu" value={searchData.color_code} onChange={(e) => handleFieldChange("color_code", e.target.value)} />
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button variant="outlined" onClick={handleClear}>Təmizlə</Button>
          <Button variant="outlined" onClick={onClose}>Ləğv et</Button>
        </div>
        <Button onClick={handleSearch} className="text-white bg-blue-600 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Axtarış
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

// köməkçi komponent
function Divider({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
