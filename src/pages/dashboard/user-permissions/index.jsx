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

// Mock data - bütün icazələr
const allPermissionsData = {
  "Müraciət": [
    { id: 1, name: "Ticket Status Dəyişdirmə (Employee)", checked: false },
    { id: 2, name: "Ticket Status Dəyişdirmə (Admin)", checked: false },
    { id: 3, name: "Ləğv edilmənin göstərilməsi", checked: false },
    { id: 4, name: "Bütün müraciətlərin göstərilməsi (Səlahiyyətli şəxs)", checked: false },
    { id: 5, name: "Kateqoriya - Silmək", checked: false },
    { id: 6, name: "Kateqoriya - Düzəliş etmək", checked: false },
    { id: 7, name: "Kateqoriya - Yaratmaq", checked: false },
    { id: 8, name: "Kateqoriya - Siyahı", checked: false },
    { id: 9, name: "Müraciət - rate", checked: false },
    { id: 10, name: "Müraciətlərin baxışı", checked: false },
    { id: 11, name: "Müraciətlərin əlavəsi", checked: false },
  ],
  "Maliyyə": [
    { id: 12, name: "Faktura yaratmaq", checked: false },
    { id: 13, name: "Faktura düzəliş etmək", checked: false },
    { id: 14, name: "Faktura silmək", checked: false },
    { id: 15, name: "Ödəniş tarixçəsi", checked: false },
    { id: 16, name: "Hesabatlar", checked: false },
  ],
  "Bina İdarəetməsi": [
    { id: 17, name: "Kompleks yaratmaq", checked: false },
    { id: 18, name: "Bina yaratmaq", checked: false },
    { id: 19, name: "Blok yaratmaq", checked: false },
    { id: 20, name: "Mənzil yaratmaq", checked: false },
  ],
};

// Mock: Hər hüququn icazələri (real tətbiqdə API-dən gələcək)
const getRightPermissions = (rightId) => {
  // Mock: Hər hüququn bəzi icazələri var
  const permissions = JSON.parse(JSON.stringify(allPermissionsData));
  // Admin üçün bütün icazələr aktivdir
  if (rightId === 1) {
    Object.keys(permissions).forEach((category) => {
      permissions[category] = permissions[category].map((perm) => ({ ...perm, checked: true }));
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
  }, [rightId]);

  const handleRightChange = (newRightId) => {
    setSearchParams({ rightId: newRightId });
  };

  const handleSavePermissions = () => {
    // Real tətbiqdə API-yə göndəriləcək
    console.log("Saving permissions for right:", rightId, permissions);
    // Məlumat yadda saxlanıldıqdan sonra hüquqlar səhifəsinə qayıt
    navigate("/dashboard/user-rights");
  };

  const handlePermissionToggle = (category, permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: prev[category].map((perm) =>
        perm.id === permissionId ? { ...perm, checked: !perm.checked } : perm
      ),
    }));
  };

  const handleCategoryToggle = (category) => {
    const allChecked = permissions[category].every((perm) => perm.checked);
    setPermissions((prev) => ({
      ...prev,
      [category]: prev[category].map((perm) => ({ ...perm, checked: !allChecked })),
    }));
  };

  const totalPermissions = Object.values(permissions).reduce(
    (sum, category) => sum + category.length,
    0
  );

  const filteredPermissions = Object.entries(permissions).reduce((acc, [category, perms]) => {
    const filtered = perms.filter((perm) =>
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
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
              <div className="relative w-full sm:w-64">
                <Input
                  type="text"
                  placeholder={t("userPermissions.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full dark:text-white dark:border-gray-600 pr-10"
                  labelProps={{ className: "dark:text-gray-300" }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected Right Info */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-3 border-t border-gray-700">
            <Button
              variant="text"
              size="sm"
              onClick={() => navigate("/dashboard/user-rights")}
              className="flex items-center justify-center gap-2 text-white hover:bg-white/10 w-full sm:w-auto border border-white/20"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">{t("userPermissions.backToRights")}</span>
            </Button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
              <Select
                label={t("userPermissions.selectRight")}
                value={rightId ? String(rightId) : ""}
                onChange={(value) => handleRightChange(parseInt(value))}
                className="dark:text-white flex-1"
                labelProps={{ className: "dark:text-gray-300" }}
              >
                {rightsData.map((right) => (
                  <Option key={right.id} value={String(right.id)}>
                    {right.name}
                  </Option>
                ))}
              </Select>
              {selectedRight && (
                <div className="flex items-center gap-2 bg-gray-800 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-1.5 rounded-full flex-shrink-0">
                    <UserGroupIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <Typography variant="small" className="text-white font-semibold text-xs sm:text-sm">
                    {selectedRight.name}
                  </Typography>
                  <Chip
                    value={selectedRight.status}
                    color="green"
                    size="sm"
                    className="dark:bg-green-600 dark:text-white text-xs"
                  />
                </div>
              )}
            </div>
            {rightId && (
              <Button
                color="green"
                size="sm"
                onClick={handleSavePermissions}
                className="bg-green-600 hover:bg-green-700 text-white border-0 w-full sm:w-auto"
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
          <CardBody className="p-3 sm:p-4 dark:bg-black flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4 pb-2">
              {Object.entries(searchTerm ? filteredPermissions : permissions).map(([category, perms]) => {
                const allChecked = perms.every((perm) => perm.checked);
                const someChecked = perms.some((perm) => perm.checked);

                return (
                  <div key={category} className="space-y-3">
                    {/* Category Header */}
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-2 sm:p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Checkbox
                          checked={allChecked}
                          indeterminate={someChecked && !allChecked}
                          onChange={() => handleCategoryToggle(category)}
                          className="dark:border-gray-500 dark:checked:bg-purple-600"
                        />
                        <div className="bg-purple-100 dark:bg-purple-900/40 p-1.5 rounded flex-shrink-0">
                          <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-300" />
                        </div>
                        <Typography variant="small" className="font-semibold dark:text-white text-xs sm:text-sm flex-1">
                          {category}
                        </Typography>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                          {perms.length} {t("userPermissions.permissions.permission")}
                        </Typography>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="space-y-1.5 sm:space-y-2 pl-2 sm:pl-4">
                      {perms.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded transition-colors"
                        >
                          <Checkbox
                            checked={permission.checked}
                            onChange={() => handlePermissionToggle(category, permission.id)}
                            className="dark:border-gray-500 dark:checked:bg-green-600 flex-shrink-0"
                          />
                          <Typography variant="small" className="dark:text-gray-200 text-xs sm:text-sm flex-1">
                            {permission.name}
                          </Typography>
                        </div>
                      ))}
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

