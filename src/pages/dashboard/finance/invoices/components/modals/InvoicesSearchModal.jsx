import React, { useState, useEffect } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Input, Select, Option, Typography,
} from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import { EMPTY_FILTERS } from "../../hooks/useInvoicesFilters";

const INVOICE_TYPES = [
  { value: "daily",      label: "Günlük" },
  { value: "weekly",     label: "Həftəlik" },
  { value: "monthly",    label: "Aylıq" },
  { value: "quarterly",  label: "Rüblük" },
  { value: "biannually", label: "Yarımillik" },
  { value: "yearly",     label: "İllik" },
  { value: "one_time",   label: "Bir dəfəlik" },
];

const INVOICE_STATUSES = [
  { value: "paid",     label: "Ödənilib" },
  { value: "not_paid", label: "Ödənilməmiş" },
  { value: "pending",  label: "Gözləyir" },
  { value: "overdue",  label: "Gecikmiş" },
  { value: "declined", label: "Rədd edilib" },
  { value: "draft",    label: "Qaralama" },
  { value: "pre_paid", label: "Ön ödəniş" },
];

// Kaskad seçim üçün boş state
const EMPTY_CASCADE = {
  mtkId:      null, mtkLabel:      "",
  complexId:  null, complexLabel:  "",
  buildingId: null, buildingLabel: "",
  blockId:    null, blockLabel:    "",
  propertyId: null, propertyLabel: "",
};

export function InvoicesSearchModal({ open, onClose, onSearch, currentFilters = {} }) {
  const [f, setF]         = useState(EMPTY_FILTERS);
  const [cas, setCas]     = useState(EMPTY_CASCADE); // kaskad seçimlər
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

  // Kaskad: yuxarı level dəyişəndə aşağı levelləri sıfırla
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
      serviceIds:  svc.id  ? [svc.id]       : [],
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
            Ətraflı Axtarış
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
              label="Faktura ID"
              value={f.invoiceId}
              onChange={(e) => set("invoiceId", e.target.value)}
              {...inputProps}
            />
            <Select
              label="Status"
              value={f.status}
              onChange={(val) => set("status", val || "")}
              className="dark:text-gray-200"
              labelProps={{ className: "dark:text-gray-300" }}
            >
              <Option value="">Hamısı</Option>
              {INVOICE_STATUSES.map((s) => (
                <Option key={s.value} value={s.value}>{s.label}</Option>
              ))}
            </Select>
            <Select
              label="Növ (type)"
              value={f.type}
              onChange={(val) => set("type", val || "")}
              className="dark:text-gray-200"
              labelProps={{ className: "dark:text-gray-300" }}
            >
              <Option value="">Hamısı</Option>
              {INVOICE_TYPES.map((tp) => (
                <Option key={tp.value} value={tp.value}>{tp.label}</Option>
              ))}
            </Select>
          </div>

          {/* ── Xidmət (API-dən) ── */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Xidmət</p>
            <AsyncSearchSelect
              label="Xidmət seçin"
              endpoint="/module/services/list"
              value={svc.id}
              selectedLabel={svc.label}
              onChange={(id, item) => setSvc({ id, label: item?.name || "" })}
              labelKey="name"
              valueKey="id"
              allowClear
            />
          </div>

          {/* ── Ayırıcı ── */}
          <Divider label="Mənzil seçimi (kaskad)" />

          {/* ── MTK → Complex → Bina → Blok → Mənzil ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MTK */}
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
            {/* Complex */}
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
            {/* Building */}
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
            {/* Block */}
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
          {/* Mənzil — tam genişlikdə */}
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
          <Divider label="Tarix aralıqları" />

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Ödəniş tarixi aralığı (paid_at)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Başlanğıc" type="date" value={f.paidAtFrom} onChange={(e) => set("paidAtFrom", e.target.value)} {...inputProps} />
              <Input label="Son" type="date" value={f.paidAtTo} onChange={(e) => set("paidAtTo", e.target.value)} {...inputProps} />
            </div>
          </div>

          {/* ── Məbləğ aralıqları ── */}
          <Divider label="Məbləğ aralıqları" />

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Faktura məbləği (₼)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Minimum" type="number" min="0" value={f.amountFrom} onChange={(e) => set("amountFrom", e.target.value)} {...inputProps} />
              <Input label="Maksimum" type="number" min="0" value={f.amountTo} onChange={(e) => set("amountTo", e.target.value)} {...inputProps} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Ödənilmiş məbləğ (₼)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Minimum" type="number" min="0" value={f.amountPaidFrom} onChange={(e) => set("amountPaidFrom", e.target.value)} {...inputProps} />
              <Input label="Maksimum" type="number" min="0" value={f.amountPaidTo} onChange={(e) => set("amountPaidTo", e.target.value)} {...inputProps} />
            </div>
          </div>

        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 gap-2">
        <Button variant="text" color="gray" onClick={handleReset}>Təmizlə</Button>
        <Button variant="text" color="gray" onClick={onClose}>Ləğv et</Button>
        <Button variant="filled" color="blue" onClick={handleSearch} className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-4 w-4" />
          Axtar
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
