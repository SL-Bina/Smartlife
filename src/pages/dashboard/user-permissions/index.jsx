import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Checkbox,
  Select,
  Option,
  Chip,
} from "@material-tailwind/react";
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock data - hüquqlar
const rightsData = [
  { id: 1, name: "Admin", status: "Aktiv" },
  { id: 2, name: "Moderator", status: "Aktiv" },
  { id: 3, name: "Property Owner", status: "Aktiv" },
  { id: 4, name: "Family member", status: "Aktiv" },
  { id: 5, name: "Tenant", status: "Aktiv" },
  { id: 6, name: "Employee", status: "Aktiv" },
  { id: 7, name: "Guest", status: "Aktiv" },
  { id: 8, name: "Manager", status: "Aktiv" },
  { id: 9, name: "Accountant", status: "Aktiv" },
  { id: 10, name: "Security", status: "Aktiv" },
  { id: 11, name: "Maintenance", status: "Aktiv" },
];

// Mock data - bütün icazələr (submenu strukturu ilə)
const allPermissionsData = {
  "Müraciət": {
    "Ticket İdarəetməsi": [
      { id: 1, name: "Ticket Status Dəyişdirmə (Employee)", checked: false },
      { id: 2, name: "Ticket Status Dəyişdirmə (Admin)", checked: false },
      { id: 3, name: "Ticket yaratmaq", checked: false },
      { id: 4, name: "Ticket düzəliş etmək", checked: false },
      { id: 5, name: "Ticket silmək", checked: false },
      { id: 6, name: "Ticket baxışı", checked: false },
      { id: 7, name: "Ticket təyinatı", checked: false },
      { id: 8, name: "Ticket prioritet dəyişdirmə", checked: false },
    ],
    "Kateqoriya İdarəetməsi": [
      { id: 9, name: "Kateqoriya - Silmək", checked: false },
      { id: 10, name: "Kateqoriya - Düzəliş etmək", checked: false },
      { id: 11, name: "Kateqoriya - Yaratmaq", checked: false },
      { id: 12, name: "Kateqoriya - Siyahı", checked: false },
      { id: 13, name: "Kateqoriya - Aktiv/Deaktiv etmək", checked: false },
    ],
    "Müraciət Əməliyyatları": [
      { id: 14, name: "Ləğv edilmənin göstərilməsi", checked: false },
      { id: 15, name: "Bütün müraciətlərin göstərilməsi (Səlahiyyətli şəxs)", checked: false },
      { id: 16, name: "Müraciət - rate", checked: false },
      { id: 17, name: "Müraciətlərin baxışı", checked: false },
      { id: 18, name: "Müraciətlərin əlavəsi", checked: false },
      { id: 19, name: "Müraciət şərhləri", checked: false },
      { id: 20, name: "Müraciət faylları", checked: false },
    ],
  },
  "Maliyyə": {
    "Faktura İdarəetməsi": [
      { id: 21, name: "Faktura yaratmaq", checked: false },
      { id: 22, name: "Faktura düzəliş etmək", checked: false },
      { id: 23, name: "Faktura silmək", checked: false },
      { id: 24, name: "Faktura baxışı", checked: false },
      { id: 25, name: "Faktura çap etmək", checked: false },
      { id: 26, name: "Faktura göndərmək", checked: false },
      { id: 27, name: "Faktura ləğv etmək", checked: false },
    ],
    "Ödəniş İdarəetməsi": [
      { id: 28, name: "Ödəniş tarixçəsi", checked: false },
      { id: 29, name: "Ödəniş yaratmaq", checked: false },
      { id: 30, name: "Ödəniş düzəliş etmək", checked: false },
      { id: 31, name: "Ödəniş silmək", checked: false },
      { id: 32, name: "Ödəniş təsdiqləmək", checked: false },
      { id: 33, name: "Ödəniş ləğv etmək", checked: false },
    ],
    "Hesabatlar": [
      { id: 34, name: "Hesabatlar", checked: false },
      { id: 35, name: "Hesabat yaratmaq", checked: false },
      { id: 36, name: "Hesabat export etmək", checked: false },
      { id: 37, name: "Hesabat filterləmək", checked: false },
      { id: 38, name: "Hesabat çap etmək", checked: false },
    ],
    "Depozit və Borc": [
      { id: 39, name: "Depozit yaratmaq", checked: false },
      { id: 40, name: "Depozit düzəliş etmək", checked: false },
      { id: 41, name: "Borc yaratmaq", checked: false },
      { id: 42, name: "Borc düzəliş etmək", checked: false },
      { id: 43, name: "Borc ödənişi", checked: false },
    ],
  },
  "Bina İdarəetməsi": {
    "Kompleks İdarəetməsi": [
      { id: 44, name: "Kompleks yaratmaq", checked: false },
      { id: 45, name: "Kompleks düzəliş etmək", checked: false },
      { id: 46, name: "Kompleks silmək", checked: false },
      { id: 47, name: "Kompleks baxışı", checked: false },
      { id: 48, name: "Kompleks parametrləri", checked: false },
    ],
    "Bina İdarəetməsi": [
      { id: 49, name: "Bina yaratmaq", checked: false },
      { id: 50, name: "Bina düzəliş etmək", checked: false },
      { id: 51, name: "Bina silmək", checked: false },
      { id: 52, name: "Bina baxışı", checked: false },
      { id: 53, name: "Bina parametrləri", checked: false },
      { id: 54, name: "Bina xidmətləri", checked: false },
    ],
    "Blok İdarəetməsi": [
      { id: 55, name: "Blok yaratmaq", checked: false },
      { id: 56, name: "Blok düzəliş etmək", checked: false },
      { id: 57, name: "Blok silmək", checked: false },
      { id: 58, name: "Blok baxışı", checked: false },
    ],
    "Mənzil İdarəetməsi": [
      { id: 59, name: "Mənzil yaratmaq", checked: false },
      { id: 60, name: "Mənzil düzəliş etmək", checked: false },
      { id: 61, name: "Mənzil silmək", checked: false },
      { id: 62, name: "Mənzil baxışı", checked: false },
      { id: 63, name: "Mənzil parametrləri", checked: false },
      { id: 64, name: "Mənzil sahibləri", checked: false },
    ],
  },
  "İstifadəçi İdarəetməsi": {
    "Hüquqlar və İcazələr": [
      { id: 65, name: "Hüquq yaratmaq", checked: false },
      { id: 66, name: "Hüquq düzəliş etmək", checked: false },
      { id: 67, name: "Hüquq silmək", checked: false },
      { id: 68, name: "İcazə təyin etmək", checked: false },
      { id: 69, name: "İcazə düzəliş etmək", checked: false },
      { id: 70, name: "İcazə silmək", checked: false },
    ],
    "İstifadəçi Əməliyyatları": [
      { id: 71, name: "İstifadəçi yaratmaq", checked: false },
      { id: 72, name: "İstifadəçi düzəliş etmək", checked: false },
      { id: 73, name: "İstifadəçi silmək", checked: false },
      { id: 74, name: "İstifadəçi baxışı", checked: false },
      { id: 75, name: "İstifadəçi aktiv/deaktiv etmək", checked: false },
    ],
  },
  "Bildirişlər": {
    "Bildiriş İdarəetməsi": [
      { id: 76, name: "Bildiriş yaratmaq", checked: false },
      { id: 77, name: "Bildiriş düzəliş etmək", checked: false },
      { id: 78, name: "Bildiriş silmək", checked: false },
      { id: 79, name: "Bildiriş göndərmək", checked: false },
      { id: 80, name: "Bildiriş baxışı", checked: false },
    ],
    "Şablon İdarəetməsi": [
      { id: 81, name: "Şablon yaratmaq", checked: false },
      { id: 82, name: "Şablon düzəliş etmək", checked: false },
      { id: 83, name: "Şablon silmək", checked: false },
      { id: 84, name: "Şablon baxışı", checked: false },
    ],
  },
};

// Mock: Hər hüququn icazələri (real tətbiqdə API-dən gələcək)
const getRightPermissions = (rightId) => {
  // Mock: Hər hüququn bəzi icazələri var
  const permissions = JSON.parse(JSON.stringify(allPermissionsData));
  // Admin üçün bütün icazələr aktivdir
  if (rightId === 1) {
    Object.keys(permissions).forEach((category) => {
      Object.keys(permissions[category]).forEach((subCategory) => {
        permissions[category][subCategory] = permissions[category][subCategory].map((perm) => ({ ...perm, checked: true }));
      });
    });
  }
  return permissions;
};

const UserPermissionsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState({});
  const [openSubCategories, setOpenSubCategories] = useState({});
  const rightId = searchParams.get("rightId") ? parseInt(searchParams.get("rightId")) : null;
  const selectedRight = rightId ? rightsData.find((r) => r.id === rightId) : null;
  const [permissions, setPermissions] = useState(() => 
    rightId ? getRightPermissions(rightId) : allPermissionsData
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (rightId) {
      setPermissions(getRightPermissions(rightId));
    } else {
      setPermissions(allPermissionsData);
    }
    // Reset open states when right changes
    setOpenCategories({});
    setOpenSubCategories({});
  }, [rightId]);

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSubCategory = (category, subCategory) => {
    const key = `${category}-${subCategory}`;
    setOpenSubCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRightChange = (newRightId) => {
    setSearchParams({ rightId: newRightId });
  };

  const handleSavePermissions = () => {
    // Real tətbiqdə API-yə göndəriləcək
    console.log("Saving permissions for right:", rightId, permissions);
    // Məlumat yadda saxlanıldıqdan sonra hüquqlar səhifəsinə qayıt
    navigate("/dashboard/user-rights");
  };

  const handlePermissionToggle = (category, subCategory, permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: prev[category][subCategory].map((perm) =>
          perm.id === permissionId ? { ...perm, checked: !perm.checked } : perm
        ),
      },
    }));
  };

  const handleSubCategoryToggle = (category, subCategory) => {
    const allChecked = permissions[category][subCategory].every((perm) => perm.checked);
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: prev[category][subCategory].map((perm) => ({ ...perm, checked: !allChecked })),
      },
    }));
  };

  const handleCategoryToggle = (category) => {
    const allSubCategories = Object.values(permissions[category]);
    const allChecked = allSubCategories.every((subCategory) =>
      subCategory.every((perm) => perm.checked)
    );
    setPermissions((prev) => ({
      ...prev,
      [category]: Object.keys(prev[category]).reduce((acc, subCategory) => {
        acc[subCategory] = prev[category][subCategory].map((perm) => ({ ...perm, checked: !allChecked }));
        return acc;
      }, {}),
    }));
  };

  const totalPermissions = Object.values(permissions).reduce(
    (sum, category) => {
      if (typeof category === 'object' && category !== null) {
        return sum + Object.values(category).reduce((subSum, subCategory) => subSum + subCategory.length, 0);
      }
      return sum;
    },
    0
  );

  const filteredPermissions = Object.entries(permissions).reduce((acc, [category, subCategories]) => {
    const filteredCategory = {};
    Object.entries(subCategories).forEach(([subCategory, perms]) => {
      const filtered = perms.filter((perm) =>
        perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        filteredCategory[subCategory] = filtered;
      }
    });
    if (Object.keys(filteredCategory).length > 0) {
      acc[category] = filteredCategory;
    }
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-black my-2 sm:my-3 lg:my-4 p-3 sm:p-4 rounded-lg shadow-lg mb-3 sm:mb-4 lg:mb-5 border border-red-600 dark:border-red-600 flex-shrink-0">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Typography variant="h5" className="text-white font-bold text-lg sm:text-xl leading-tight">
                {t("userPermissions.pageTitle")}
              </Typography>
              <Typography variant="small" className="text-white/90 dark:text-white/90 mt-1.5 text-xs sm:text-sm font-medium">
                {t("userPermissions.subtitle")}
              </Typography>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Input
                  type="text"
                  placeholder={t("userPermissions.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full dark:text-white dark:bg-gray-800/50 pr-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                  labelProps={{ className: "dark:text-gray-300" }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected Right Info */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-700/50">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => navigate("/dashboard/user-rights")}
              className="flex items-center justify-center gap-2 text-white hover:bg-white/10 border-white/30 hover:border-white/50 w-full sm:w-auto"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">{t("userPermissions.backToRights")}</span>
            </Button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
              <Select
                label={t("userPermissions.selectRight")}
                value={rightId ? String(rightId) : ""}
                onChange={(value) => handleRightChange(parseInt(value))}
                className="dark:text-white dark:border-gray-600 flex-1"
                labelProps={{ className: "dark:text-gray-300" }}
              >
                {rightsData.map((right) => (
                  <Option key={right.id} value={String(right.id)}>
                    {right.name}
                  </Option>
                ))}
              </Select>
              {selectedRight && (
                <div className="flex items-center gap-2.5 bg-gray-800/80 dark:bg-gray-800/70 px-4 py-2.5 rounded-lg border border-gray-700/50 shadow-sm">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-1.5 rounded-full flex-shrink-0">
                    <UserGroupIcon className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <Typography variant="small" className="text-white font-semibold text-sm">
                    {selectedRight.name}
                  </Typography>
                  <Chip
                    value={selectedRight.status}
                    color="green"
                    size="sm"
                    className="dark:bg-green-600 dark:text-white text-[10px] sm:text-xs px-2 py-0.5 h-5 sm:h-6"
                  />
                </div>
              )}
            </div>
            {rightId && (
              <Button
                color="green"
                size="sm"
                onClick={handleSavePermissions}
                className="dark:bg-green-600 dark:hover:bg-green-700 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                <span className="text-xs sm:text-sm font-medium">{t("userPermissions.savePermissions")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="h-6 w-6 dark:text-blue-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
            {t("userPermissions.loading")}
          </Typography>
        </div>
      ) : (
        <Card className="border border-red-600 dark:border-red-600 shadow-lg dark:bg-black flex flex-col flex-1 min-h-0">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-3 sm:p-4 dark:bg-black border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white text-base sm:text-lg">
                {t("userPermissions.permissions.title")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300 text-xs sm:text-sm">
                {t("userPermissions.permissions.total")}: {totalPermissions} {t("userPermissions.permissions.permission")}
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-4 sm:p-6 dark:bg-black flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-5 sm:space-y-6">
              {Object.entries(searchTerm ? filteredPermissions : permissions).map(([category, subCategories]) => {
                const allSubCategories = Object.values(subCategories);
                const allCategoryChecked = allSubCategories.every((subCategory) =>
                  subCategory.every((perm) => perm.checked)
                );
                const someCategoryChecked = allSubCategories.some((subCategory) =>
                  subCategory.some((perm) => perm.checked)
                );
                const categoryTotal = allSubCategories.reduce((sum, subCategory) => sum + subCategory.length, 0);

                return (
                  <div key={category} className="space-y-4">
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-4 sm:p-5 rounded-lg border border-purple-200 dark:border-purple-700/50 shadow-sm">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Checkbox
                          checked={allCategoryChecked}
                          indeterminate={someCategoryChecked && !allCategoryChecked ? true : undefined}
                          onChange={() => handleCategoryToggle(category)}
                          className="dark:border-gray-400 dark:checked:bg-purple-600"
                          ripple={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="bg-white dark:bg-purple-900/60 p-2.5 rounded-lg shadow-sm flex-shrink-0">
                          <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <Typography variant="h5" className="font-bold dark:text-white text-base sm:text-lg flex-1">
                          {category}
                        </Typography>
                        <div className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm">
                          <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold">
                            {categoryTotal} {t("userPermissions.permissions.permission")}
                          </Typography>
                        </div>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => toggleCategory(category)}
                          className="dark:text-white dark:hover:bg-purple-800/50"
                        >
                          <ChevronDownIcon
                            strokeWidth={2}
                            className={`h-5 w-5 transition-transform duration-300 ${
                              openCategories[category] ? "rotate-180" : ""
                            }`}
                          />
                        </IconButton>
                      </div>
                    </div>

                    {/* Sub Categories */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openCategories[category] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-3 pl-2 sm:pl-4 pt-2">
                      {Object.entries(subCategories).map(([subCategory, perms]) => {
                        const allChecked = perms.every((perm) => perm.checked);
                        const someChecked = perms.some((perm) => perm.checked);

                        return (
                          <div key={subCategory} className="space-y-2">
                            {/* Sub Category Header */}
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 sm:p-3.5 rounded-lg border border-blue-200 dark:border-blue-700/50 shadow-sm">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <Checkbox
                                  checked={allChecked}
                                  indeterminate={someChecked && !allChecked ? true : undefined}
                                  onChange={() => handleSubCategoryToggle(category, subCategory)}
                                  className="dark:border-gray-400 dark:checked:bg-blue-600"
                                  ripple={false}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="bg-white dark:bg-blue-900/50 p-1.5 rounded flex-shrink-0">
                                  <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-300" />
                                </div>
                                <Typography variant="h6" className="font-semibold dark:text-white text-sm sm:text-base flex-1">
                                  {subCategory}
                                </Typography>
                                <div className="bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full">
                                  <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                                    {perms.length} {t("userPermissions.permissions.permission")}
                                  </Typography>
                                </div>
                                <IconButton
                                  variant="text"
                                  size="sm"
                                  onClick={() => toggleSubCategory(category, subCategory)}
                                  className="dark:text-white dark:hover:bg-blue-800/50"
                                >
                                  <ChevronDownIcon
                                    strokeWidth={2}
                                    className={`h-4 w-4 transition-transform duration-300 ${
                                      openSubCategories[`${category}-${subCategory}`] ? "rotate-180" : ""
                                    }`}
                                  />
                                </IconButton>
                              </div>
                            </div>

                            {/* Permissions */}
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                openSubCategories[`${category}-${subCategory}`]
                                  ? "max-h-[2000px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="space-y-2 pl-2 sm:pl-3 pt-2">
                              {perms.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-center gap-3 p-2.5 sm:p-3 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700/50 transition-all duration-200 cursor-pointer group"
                                  onClick={() => handlePermissionToggle(category, subCategory, permission.id)}
                                >
                                  <Checkbox
                                    checked={permission.checked}
                                    onChange={() => handlePermissionToggle(category, subCategory, permission.id)}
                                    className="dark:border-gray-400 dark:checked:bg-green-600 flex-shrink-0"
                                    ripple={false}
                                  />
                                  <Typography variant="small" className="dark:text-gray-200 text-sm sm:text-base flex-1 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {permission.name}
                                  </Typography>
                                  {permission.checked && (
                                    <div className="flex-shrink-0">
                                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default UserPermissionsPage;

