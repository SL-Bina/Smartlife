import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon, CreditCardIcon, CurrencyDollarIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function Table({ variant = "invoices", invoices, items, loading, onView, onEdit, onDelete, onPay, onSelect, selectedComplexId, selectedBuildingId, selectedBlockId, selectedPropertyId, onOpenParams, onServiceFee, onAddBalance }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    const statusMap = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      unpaid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      not_paid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      overdue: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      declined: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      draft: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pre_paid: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return statusMap[status] || statusMap.unpaid;
  };

  const getStatusLabel = (status) =>
    t(`invoices.status.${status}`) || status;

  const getTypeLabel = (type) =>
    t(`invoices.types.${type}`) || type;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const calculateRemaining = (amount, amountPaid) => {
    const remaining = parseFloat(amount || 0) - parseFloat(amountPaid || 0);
    return remaining.toFixed(2);
  };

  const getMtkStatusColor = (status) => {
    const normalized = String(status || "").trim().toLowerCase();

    const statusMap = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      blocked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      suspended: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      deleted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    return statusMap[normalized] || "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  };

  const getMtkStatusLabel = (status) => {
    const normalized = String(status || "").trim().toLowerCase();

    const labels = {
      active: "Aktiv",
      inactive: "Qeyri-aktiv",
      pending: "Gözləmədə",
      blocked: "Bloklanıb",
      suspended: "Dayandırılıb",
      deleted: "Silinib",
    };

    return labels[normalized] || (status || "-");
  };

  const getValidHexColor = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return null;

    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized) ? normalized : null;
  };

  const getMtkApiColor = (item) => {
    const directMetaColor = getValidHexColor(item?.meta?.color_code);
    if (directMetaColor) return directMetaColor;

    if (typeof item?.meta === "string") {
      try {
        const parsedMeta = JSON.parse(item.meta);
        const parsedMetaColor = getValidHexColor(parsedMeta?.color_code);
        if (parsedMetaColor) return parsedMetaColor;
      } catch {
        // ignore invalid json meta
      }
    }

    const directColor = getValidHexColor(item?.color_code);
    if (directColor) return directColor;

    return null;
  };

  const data = variant === "mtk" || variant === "complex" || variant === "building" || variant === "block" || variant === "property" ? items : invoices;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          {t("invoices.actions.loading") || "Yüklənir..."}
        </Typography>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          {variant === "mtk" || variant === "complex" || variant === "building" || variant === "block" || variant === "property" ? "Məlumat tapılmadı" : t("invoices.noData") || "Faktura tapılmadı"}
        </Typography>
      </div>
    );
  }

  if (variant === "property") {
    return (
      <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <table className="w-full min-w-[1120px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { label: "ID", align: "text-left" },
                { label: "Ad", align: "text-left" },
                { label: "MTK", align: "text-left" },
                { label: "Complex", align: "text-left" },
                { label: "Bina", align: "text-left" },
                { label: "Blok", align: "text-left" },
                { label: "Mənzil №", align: "text-left" },
                { label: "Mərtəbə", align: "text-left" },
                { label: "Sahə", align: "text-left" },
                { label: "Status", align: "text-left" },
                { label: "Əməliyyatlar", align: "text-left" },
              ].map(({ label, align }) => (
                <th key={label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    {label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item?.name || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.mtk?.name || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.complex?.name || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.building?.name || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.block?.name || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.apartment_number || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.floor || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.area || "-"}</Typography></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left"><Chip value={getMtkStatusLabel(item?.status)} className={`${getMtkStatusColor(item?.status)} text-xs font-medium w-fit`} size="sm" /></td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedPropertyId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
                    >
                      {selectedPropertyId === item.id ? "Seçilib" : "Seç"}
                    </button>
                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                        <MenuItem onClick={() => onView?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"><EyeIcon className="h-4 w-4" />Bax</MenuItem>
                        <MenuItem onClick={() => onServiceFee?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"><CurrencyDollarIcon className="h-4 w-4" />Servis haqqı</MenuItem>
                        <MenuItem onClick={() => onAddBalance?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"><BanknotesIcon className="h-4 w-4" />Balans artır</MenuItem>
                        <MenuItem onClick={() => onEdit?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
                        <MenuItem onClick={() => onDelete?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === "block") {
    return (
      <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { label: "ID", align: "text-left" },
                { label: "Ad", align: "text-left" },
                { label: "Complex", align: "text-left" },
                { label: "Bina", align: "text-left" },
                { label: "Mərtəbə", align: "text-left" },
                { label: "Mənzil", align: "text-left" },
                { label: "Status", align: "text-left" },
                { label: "Əməliyyatlar", align: "text-left" },
              ].map(({ label, align }) => (
                <th key={label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    {label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.complex?.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.building?.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.total_floor || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.total_apartment || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Chip value={getMtkStatusLabel(item?.status)} className={`${getMtkStatusColor(item?.status)} text-xs font-medium w-fit`} size="sm" />
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedBlockId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
                    >
                      {selectedBlockId === item.id ? "Seçilib" : "Seç"}
                    </button>
                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                        <MenuItem onClick={() => onView?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          Bax
                        </MenuItem>
                        <MenuItem onClick={() => onEdit?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
                        <MenuItem onClick={() => onDelete?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === "building") {
    return (
      <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { label: "ID", align: "text-left" },
                { label: "Ad", align: "text-left" },
                { label: "Complex", align: "text-left" },
                { label: "Təsvir", align: "text-left" },
                { label: "Status", align: "text-left" },
                { label: "Əməliyyatlar", align: "text-left" },
              ].map(({ label, align }) => (
                <th key={label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    {label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.complex?.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.desc || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Chip value={getMtkStatusLabel(item?.status)} className={`${getMtkStatusColor(item?.status)} text-xs font-medium w-fit`} size="sm" />
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedBuildingId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
                    >
                      {selectedBuildingId === item.id ? "Seçilib" : "Seç"}
                    </button>
                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                        <MenuItem onClick={() => onView?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          Bax
                        </MenuItem>
                        <MenuItem onClick={() => onEdit?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
                        <MenuItem onClick={() => onDelete?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === "complex") {
    return (
      <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { label: "ID", align: "text-left" },
                { label: "Ad", align: "text-left" },
                { label: "MTK", align: "text-left" },
                { label: "Ünvan", align: "text-left" },
                { label: "Status", align: "text-left" },
                { label: "Əməliyyatlar", align: "text-left" },
              ].map(({ label, align }) => (
                <th key={label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    {label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.mtk?.name || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.address || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Chip value={getMtkStatusLabel(item?.status)} className={`${getMtkStatusColor(item?.status)} text-xs font-medium w-fit`} size="sm" />
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedComplexId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
                    >
                      {selectedComplexId === item.id ? "Seçilib" : "Seç"}
                    </button>
                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                        <MenuItem onClick={() => onView?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          Bax
                        </MenuItem>
                        <MenuItem onClick={() => onOpenParams?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                          <CreditCardIcon className="h-4 w-4" />
                          Parametrlər
                        </MenuItem>
                        <MenuItem onClick={() => onEdit?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
                        <MenuItem onClick={() => onDelete?.(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === "mtk") {
    return (
      <div className="overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {[
                { label: "ID", align: "text-left" },
                { label: "Ad", align: "text-left" },
                { label: "Ünvan", align: "text-left" },
                { label: "Əlaqə", align: "text-left" },
                { label: "Status", align: "text-left" },
                { label: "Əməliyyatlar", align: "text-left" },
              ].map(({ label, align }) => (
                <th key={label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    {label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  {(() => {
                    const apiColor = getMtkApiColor(item);
                    return (
                  <Typography
                    variant="small"
                    className={`font-semibold ${!apiColor ? "text-gray-700 dark:text-gray-300" : ""}`}
                    style={apiColor ? { color: apiColor } : undefined}
                  >
                    {item.name || "-"}
                  </Typography>
                    );
                  })()}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.address || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.phone || item?.meta?.email || "-"}</Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Chip
                    value={getMtkStatusLabel(item?.status)}
                    className={`${getMtkStatusColor(item?.status)} text-xs font-medium w-fit`}
                    size="sm"
                  />
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                      <MenuItem onClick={() => onView(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                        <EyeIcon className="h-4 w-4" />
                        Bax
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        Redaktə et
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        Sil
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="hidden lg:block overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            {[
              { label: t("invoices.table.id") || "ID", align: "text-left" },
              { label: t("invoices.table.service") || "Xidmət", align: "text-left" },
              { label: t("invoices.table.property") || "Mənzil", align: "text-left" },
              { label: t("invoices.table.residents") || "Sakinlər", align: "text-left" },
              { label: t("invoices.table.type") || "Növ", align: "text-left" },
              { label: t("invoices.table.amount") || "Məbləğ", align: "text-right" },
              { label: t("invoices.table.paidAmount") || "Ödənilmiş", align: "text-right" },
              { label: t("invoices.table.remaining") || "Qalıq", align: "text-right" },
              { label: t("invoices.table.status") || "Status", align: "text-center" },
              { label: t("invoices.table.startDate") || "Başlama tarixi", align: "text-left" },
              { label: t("invoices.table.dueDate") || "Son tarix", align: "text-left" },
              { label: t("invoices.table.paymentMethod") || "Ödəniş metodu", align: "text-left" },
              { label: t("invoices.table.operations") || "Əməliyyatlar", align: "text-left" },
            ].map(({ label, align }) => (
              <th key={label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  {label}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.map((invoice) => {
            const remaining = calculateRemaining(invoice.amount, invoice.amount_paid);
            return (
              <tr
                key={invoice.id}
                className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">
                    {invoice.id}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {invoice.service?.name || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {invoice.property?.name ||
                      invoice.property?.meta?.apartment_number ||
                      invoice.property?.apartment_number ||
                      (invoice.property?.id != null
                        ? `Mənzil #${invoice.property.id}`
                        : invoice.property_id != null
                        ? `Mənzil #${invoice.property_id}`
                        : "-")}
                  </Typography>
                  {invoice.property?.complex?.name && (
                    <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                      {invoice.property.complex.name}
                    </Typography>
                  )}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  {invoice.residents && invoice.residents.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {invoice.residents.slice(0, 2).map((resident) => (
                        <Typography key={resident.id} variant="small" className="text-gray-700 dark:text-gray-300">
                          {resident.name}
                        </Typography>
                      ))}
                      {invoice.residents.length > 2 && (
                        <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                          +{invoice.residents.length - 2} daha
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400">-</Typography>
                  )}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {getTypeLabel(invoice.type)}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-right">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {parseFloat(invoice.amount || 0).toFixed(2)} ₼
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-right">
                  <Typography variant="small" className="text-green-600 dark:text-green-400 font-semibold">
                    {parseFloat(invoice.amount_paid || 0).toFixed(2)} ₼
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-right">
                  <Typography
                    variant="small"
                    className={`font-semibold ${parseFloat(remaining) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {remaining} ₼
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-center">
                  <Chip
                    value={getStatusLabel(invoice.status)}
                    className={`${getStatusColor(invoice.status)} text-xs font-medium`}
                    size="sm"
                  />
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {formatDate(invoice.start_date)}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {formatDate(invoice.due_date)}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {invoice.payment_method?.name || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                      <MenuItem onClick={() => onView(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                        <EyeIcon className="h-4 w-4" />
                        {t("invoices.actions.view") || "Bax"}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("invoices.actions.edit") || "Redaktə et"}
                      </MenuItem>
                      {onPay && (
                        <MenuItem onClick={() => onPay(invoice)} className="dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <CreditCardIcon className="h-4 w-4" />
                          {t("invoices.actions.pay") || "Ödə"}
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => onDelete(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("invoices.actions.delete") || "Sil"}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
