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
import { permissionsAPI } from "./api";

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
  const [apiModules, setApiModules] = useState([]);
  const [error, setError] = useState(null);
  const rightId = searchParams.get("rightId") ? parseInt(searchParams.get("rightId")) : null;
  const selectedRight = rightId ? rightsData.find((r) => r.id === rightId) : null;
  const [permissions, setPermissions] = useState({});

  // API-dən permissions məlumatlarını gətir
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await permissionsAPI.getAll({ page: 1, per_page: 1000 });
        
        if (response.success && response.data && response.data.data) {
          const modules = response.data.data;
          setApiModules(modules);
          
          // API-dən gələn strukturla permissions state-ini yarat
          const formattedPermissions = {};
          
          modules.forEach((item) => {
            const module = item.module;
            if (!module || !module.name) return;
            
            const moduleName = module.name;
            const modulePermissions = module.permissions || [];
            
            // Hər modul üçün permissions array-i yarat
            if (!formattedPermissions[moduleName]) {
              formattedPermissions[moduleName] = [];
            }
            
            // Hər permission üçün formatla
            modulePermissions.forEach((perm) => {
              formattedPermissions[moduleName].push({
                id: perm.id,
                permission: perm.permission, // view, add, edit, delete
                details: perm.details || perm.permission,
                checked: false, // Default olaraq false
              });
            });
          });
          
          setPermissions(formattedPermissions);
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError(err.message || "Permissions yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {
    // Reset open states when right changes
    setOpenCategories({});
  }, [rightId]);

  const toggleCategory = (moduleName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handleRightChange = (newRightId) => {
    setSearchParams({ rightId: newRightId });
  };

  const handleSavePermissions = () => {
    // Real tətbiqdə API-yə göndəriləcək
    // Məlumat yadda saxlanıldıqdan sonra hüquqlar səhifəsinə qayıt
    navigate("/dashboard/user-rights");
  };

  const handlePermissionToggle = (moduleName, permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleName]: prev[moduleName].map((perm) =>
        perm.id === permissionId ? { ...perm, checked: !perm.checked } : perm
      ),
    }));
  };

  const handleModuleToggle = (moduleName) => {
    const allChecked = permissions[moduleName]?.every((perm) => perm.checked) || false;
    setPermissions((prev) => ({
      ...prev,
      [moduleName]: prev[moduleName].map((perm) => ({ ...perm, checked: !allChecked })),
    }));
  };

  const totalPermissions = Object.values(permissions).reduce(
    (sum, modulePerms) => {
      if (Array.isArray(modulePerms)) {
        return sum + modulePerms.length;
      }
      return sum;
    },
    0
  );

  const filteredPermissions = Object.entries(permissions).reduce((acc, [moduleName, perms]) => {
    if (!Array.isArray(perms)) return acc;
    
    const filtered = perms.filter((perm) =>
      perm.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.permission?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moduleName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[moduleName] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-gray-800 my-2 sm:my-3 lg:my-4 p-3 sm:p-4 rounded-lg shadow-lg mb-3 sm:mb-4 lg:mb-5 border border-red-600 dark:border-gray-700 flex-shrink-0">
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
        <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 flex flex-col flex-1 min-h-0">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-3 sm:p-4 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
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
          <CardBody className="p-4 sm:p-6 dark:bg-gray-800 flex-1 min-h-0">
            {error ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Typography variant="h6" color="red" className="dark:text-red-400 mb-2">
                  {t("userPermissions.error") || "Xəta"}
                </Typography>
                <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                  {error}
                </Typography>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {Object.keys(searchTerm ? filteredPermissions : permissions).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Typography variant="h6" color="blue-gray" className="dark:text-gray-400 mb-2">
                      {t("userPermissions.noPermissions") || "İcazə tapılmadı"}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("userPermissions.noPermissionsDesc") || "Hələ heç bir icazə yoxdur"}
                    </Typography>
                  </div>
                ) : (
                  Object.entries(searchTerm ? filteredPermissions : permissions).map(([moduleName, perms]) => {
                    if (!Array.isArray(perms) || perms.length === 0) return null;
                    
                    const allChecked = perms.every((perm) => perm.checked);
                    const someChecked = perms.some((perm) => perm.checked);

                    return (
                      <div key={moduleName} className="space-y-4">
                        {/* Module Header */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-4 sm:p-5 rounded-lg border border-purple-200 dark:border-purple-700/50 shadow-sm">
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <Checkbox
                              checked={allChecked}
                              indeterminate={someChecked && !allChecked ? true : undefined}
                              onChange={() => handleModuleToggle(moduleName)}
                              className="dark:border-gray-400 dark:checked:bg-purple-600"
                              ripple={false}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="bg-white dark:bg-purple-900/60 p-2.5 rounded-lg shadow-sm flex-shrink-0">
                              <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <Typography variant="h5" className="font-bold dark:text-white text-base sm:text-lg flex-1 capitalize">
                              {moduleName}
                            </Typography>
                            <div className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm">
                              <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold">
                                {perms.length} {t("userPermissions.permissions.permission")}
                              </Typography>
                            </div>
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => toggleCategory(moduleName)}
                              className="dark:text-white dark:hover:bg-purple-800/50"
                            >
                              <ChevronDownIcon
                                strokeWidth={2}
                                className={`h-5 w-5 transition-transform duration-300 ${
                                  openCategories[moduleName] ? "rotate-180" : ""
                                }`}
                              />
                            </IconButton>
                          </div>
                        </div>

                        {/* Permissions List */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            openCategories[moduleName] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="space-y-2 pl-2 sm:pl-4 pt-2">
                            {perms.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center gap-3 p-2.5 sm:p-3 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700/50 transition-all duration-200 cursor-pointer group"
                                onClick={() => handlePermissionToggle(moduleName, permission.id)}
                              >
                                <Checkbox
                                  checked={permission.checked}
                                  onChange={() => handlePermissionToggle(moduleName, permission.id)}
                                  className="dark:border-gray-400 dark:checked:bg-green-600 flex-shrink-0"
                                  ripple={false}
                                />
                                <div className="flex-1">
                                  <Typography variant="small" className="dark:text-gray-200 text-sm sm:text-base font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {permission.details || permission.permission}
                                  </Typography>
                                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                    {permission.permission}
                                  </Typography>
                                </div>
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
                  })
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default UserPermissionsPage;

