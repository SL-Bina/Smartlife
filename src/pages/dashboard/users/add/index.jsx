import React, { useState, useMemo } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";

const DEFAULT_COLOR = "#dc2626";

import { UserAddHeader } from "./components/UserAddHeader";
import { UsersActions } from "./components/UsersActions";
import { UsersTable } from "./components/UsersTable";
import { UsersCardList } from "./components/UsersCardList";
import { UsersPagination } from "./components/UsersPagination";
import { UserAddFormModal } from "./components/modals/UserAddFormModal";
import { UsersSearchModal } from "./components/modals/UsersSearchModal";

import { useUserAddForm } from "./hooks/useUserAddForm";
import { useUserAddLookups } from "./hooks/useUserAddLookups";
import { useUsersData } from "./hooks/useUsersData";
import usersAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon, 
  CalendarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  KeyIcon,
  CubeIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/store/hooks/useAuth";
import { filterRoutesByRole } from "@/layouts/dashboard";
import routes from "@/routes";

export default function UserAddPage() {
  const navigate = useNavigate();
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { user, hasModuleAccess } = useAuth();
  const colorCode = null;

  const getRgba = (opacity = 1) => {
    const r = 220; const g = 38; const b = 38;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  const getGradientBackground = (direction = "to bottom", opacity1 = 0.1, opacity2 = 0.05) => {
    const color1 = getRgba(opacity1);
    const color2 = getRgba(opacity2);
    return `linear-gradient(${direction}, ${color1}, ${color2}, ${color1})`;
  };

  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const [search, setSearch] = useState("");
  const form = useUserAddForm();
  const lookups = useUserAddLookups(formOpen);
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useUsersData({ search });

  // Find the first visible page in sidebar
  const getFirstPagePath = () => {
    if (!user) {
      return "/dashboard/home";
    }

    const currentLayout = window.location.pathname.startsWith("/resident") ? "resident" : "dashboard";
    const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess, currentLayout);
    


    // Find first visible page
    for (const route of filteredRoutes) {
      if (route.layout === currentLayout && route.pages && route.pages.length > 0) {
        for (const page of route.pages) {
          // Skip if page is hidden in sidenav
          if (page.hideInSidenav) continue;

          // If page has children, get first visible child
          if (page.children && page.children.length > 0) {
            const firstVisibleChild = page.children.find(child => !child.hideInSidenav);
            if (firstVisibleChild && firstVisibleChild.path) {
              const childPath = firstVisibleChild.path.startsWith('/')
                ? firstVisibleChild.path
                : '/' + firstVisibleChild.path;
              if (childPath.startsWith('/dashboard') || childPath.startsWith('/resident')) {
                return childPath;
              }
              return `/${currentLayout}${childPath}`;
            }
          }

          // If page has direct path, use it
          if (page.path) {
            const pagePath = page.path.startsWith('/')
              ? page.path
              : '/' + page.path;
            if (pagePath.startsWith('/dashboard') || pagePath.startsWith('/resident')) {
              return pagePath;
            }
            return `/${currentLayout}${pagePath}`;
          }
        }
      }
    }

    // Fallback to default home
    const userRole =
      user?.role?.name?.toLowerCase() ||
      (typeof user?.role === "string" ? user?.role.toLowerCase() : null);
    if (userRole === "resident") {
      return "/resident/home";
    }
    return "/dashboard/home";
  };

  const mapUserToForm = (user) => ({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      birthday: user?.birthday || "",
      personal_code: user?.personal_code || "",
      role_id: user?.role?.id || "",
      type: user?.type || 1,
      is_user: user?.is_user || 1,

      modules: user?.modules?.map(x => x.id) || [],
      mtk: user?.mtk?.map(x => x.id) || [],
      complex: user?.complex?.map(x => x.id) || [],
      apartments: user?.apartments?.map(x => x.id) || [],
      permissions: user?.permissions?.map(x => x.id) || [],

      profile_photo: null, // şəkil editdə boş qalır
      password: "",
      password_confirmation: "",
    });

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    form.resetForm();
    setFormOpen(true);
  };

  const openEdit = (x) => {
    setMode("edit");
    setSelected(x);

    form.setFormData(mapUserToForm(x)); // 🔥 əsas hissə

    setFormOpen(true);
  };

  const handleView = async (item) => {
    // Get user ID from various possible locations
    const userId = item?.id || item?.user_id || item?.user_data?.id;
    
    if (!userId) {
      showToast("error", "İstifadəçi ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await usersAPI.getById(userId);
      // API returns { success, message, data }
      // data contains: role, role_access_modules, devices, other_devices, active_device, user_data
      setItemToView(response.data || response);
    } catch (error) {
      console.error("Error loading user details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "İstifadəçi məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const openDelete = (x) => {
    setItemToDelete(x);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await usersAPI.delete(itemToDelete.id);
      showToast("success", "İstifadəçi uğurla silindi", "Uğurlu");
      await refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      const errorMessage = error?.message || "İstifadəçi silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitForm = async (payload) => {
    try {
      if (mode === "edit" && selected?.id) {
        await usersAPI.update(selected.id, payload);
        showToast("success", "İstifadəçi uğurla yeniləndi", "Uğurlu");
      } else {
        await usersAPI.addUser(payload);
        showToast("success", "İstifadəçi uğurla əlavə edildi", "Uğurlu");
      }
      await refresh();
      setFormOpen(false);
    } catch (e) {
      console.error(e);
      let errorMessage = "Xəta baş verdi";
      if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.message) {
        errorMessage = e.message;
      } else if (e?.errors && typeof e.errors === "object") {
        try {
          errorMessage = Object.values(e.errors).flat().join(", ");
        } catch (err) {
          errorMessage = "Xəta baş verdi";
        }
      }
      showToast("error", errorMessage, "Xəta");
      throw e;
    }
  };

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const activeColor = colorCode || DEFAULT_COLOR;

  const getCardBackground = () => {
    if (colorCode && sidenavType === "white") {
      const color1 = getRgbaColor(colorCode, 0.05);
      const color2 = getRgbaColor(colorCode, 0.03);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (colorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(colorCode, 0.1);
      const color2 = getRgbaColor(colorCode, 0.07);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
  };

  const cardTypes = {
    dark: colorCode ? "" : "dark:bg-gray-800/50",
    white: colorCode ? "" : "bg-white/80 dark:bg-gray-800/50",
    transparent: "",
  };

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-3 mb-6">
        <UserAddHeader />
      </div>

      <Card
        className={`
          rounded-3xl xl:rounded-[2rem]
          backdrop-blur-2xl backdrop-saturate-150
          border
          ${cardTypes[sidenavType] || ""} 
          ${colorCode ? "" : "border-gray-200/50 dark:border-gray-700/50"}
          shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.3)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]
        `}
        style={{
          ...getCardBackground(),
          borderColor: colorCode ? getRgbaColor(colorCode, 0.15) : undefined,
        }}
      >
        <CardBody className="flex flex-col gap-6 p-6">
          <UsersActions
            search={search}
            onSearchChange={setSearch}
            onSearchClick={() => setSearchModalOpen(true)}
            onCreateClick={openCreate}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <div className="hidden lg:block">
            <UsersTable
              items={items}
              loading={loading}
              onView={handleView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>

          <div className="lg:hidden">
            <UsersCardList
              items={items}
              loading={loading}
              onView={handleView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>

          {!loading && items.length > 0 && (
            <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <UsersPagination page={page} lastPage={lastPage} total={total} onPageChange={goToPage} />
            </div>
          )}

          {!loading && items.length === 0 && !search ? (
            <div className="text-center py-12">
              <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100">
                İstifadəçi siyahısı boşdur
              </Typography>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <UserAddFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        lookups={lookups}
      />

      <UsersSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchString) => {
          setSearch(searchString);
        }}
        currentSearch={search}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="İstifadəçi Məlumatları"
        item={itemToView}
        entityName="istifadəçi"
        loading={viewLoading}
        fields={[
          // User Data Fields
          { 
            key: "user_data.name", 
            label: "Ad", 
            icon: UserIcon,
            getValue: (item) => item?.user_data?.name
          },
          { 
            key: "user_data.username", 
            label: "İstifadəçi adı", 
            icon: IdentificationIcon,
            getValue: (item) => item?.user_data?.username
          },
          { 
            key: "user_data.email", 
            label: "E-mail", 
            icon: EnvelopeIcon,
            getValue: (item) => item?.user_data?.email
          },
          { 
            key: "user_data.phone", 
            label: "Telefon", 
            icon: PhoneIcon,
            getValue: (item) => item?.user_data?.phone
          },
          { 
            key: "user_data.birthday", 
            label: "Doğum tarixi",
            icon: CalendarIcon,
            getValue: (item) => item?.user_data?.birthday,
            format: (value) => value ? new Date(value).toLocaleDateString('az-AZ') : "-"
          },
          { 
            key: "user_data.personal_code", 
            label: "Şəxsiyyət nömrəsi",
            icon: IdentificationIcon,
            getValue: (item) => item?.user_data?.personal_code
          },
          { 
            key: "user_data.gender", 
            label: "Cins",
            icon: UserIcon,
            getValue: (item) => item?.user_data?.gender,
            format: (value) => {
              if (!value) return "-";
              return value === "male" ? "Kişi" : value === "female" ? "Qadın" : value;
            }
          },
          { 
            key: "user_data.status", 
            label: "Status",
            icon: CheckCircleIcon,
            getValue: (item) => item?.user_data?.status
          },
          { 
            key: "user_data.is_user", 
            label: "İstifadəçi tipi",
            icon: UserIcon,
            getValue: (item) => item?.user_data?.is_user,
            format: (value) => value === 1 ? "İstifadəçi" : "Admin"
          },
          // Role Fields
          { 
            key: "role.name", 
            label: "Rol",
            icon: ShieldCheckIcon,
            getValue: (item) => item?.role?.name
          },
          { 
            key: "role.id", 
            label: "Rol ID",
            icon: ShieldCheckIcon,
            getValue: (item) => item?.role?.id
          },
          // Role Access Modules (Custom Render)
          {
            key: "role_access_modules",
            label: "Modul İcazələri",
            icon: CubeIcon,
            fullWidth: true,
            customRender: (item, field) => {
              const modules = item?.role_access_modules || [];
              if (!modules || modules.length === 0) {
                return (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                        {field.label}
                      </Typography>
                    </div>
                    <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                      Modul icazəsi yoxdur
                    </Typography>
                  </>
                );
              }
              return (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                      {field.label}
                    </Typography>
                  </div>
                  <div className="space-y-4">
                    {modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 mb-3">
                          <CubeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white text-sm">
                            {module.module_name || `Modul #${module.module_id}`}
                          </Typography>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            (ID: {module.module_id})
                          </span>
                        </div>
                        {module.permissions && module.permissions.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {module.permissions.map((permission, permIndex) => (
                              <div key={permIndex} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                <KeyIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                <div className="flex-1">
                                  <Typography variant="small" className="font-semibold text-gray-900 dark:text-white text-xs">
                                    {permission.permission}
                                  </Typography>
                                  {permission.detail && (
                                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                                      {permission.detail}
                                    </Typography>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Typography variant="small" className="text-gray-400 dark:text-gray-500 italic text-xs">
                            Bu modul üçün icazə yoxdur
                          </Typography>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              );
            }
          },
          // Devices Fields
          { 
            key: "devices", 
            label: "Cihazlar",
            icon: DevicePhoneMobileIcon,
            getValue: (item) => item?.devices,
            format: (value) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return "Yoxdur";
              if (Array.isArray(value)) return `${value.length} cihaz`;
              return String(value);
            }
          },
          { 
            key: "other_devices", 
            label: "Digər cihazlar",
            icon: ComputerDesktopIcon,
            getValue: (item) => item?.other_devices,
            format: (value) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return "Yoxdur";
              if (Array.isArray(value)) return `${value.length} cihaz`;
              return String(value);
            }
          },
          { 
            key: "active_device", 
            label: "Aktiv cihaz",
            icon: DevicePhoneMobileIcon,
            getValue: (item) => item?.active_device,
            format: (value) => value ? "Var" : "Yoxdur"
          },
          // Timestamps
          { 
            key: "user_data.created_at", 
            label: "Yaradılma tarixi",
            icon: ClockIcon,
            getValue: (item) => item?.user_data?.created_at,
            format: (value) => {
              if (!value) return "-";
              try {
                return new Date(value).toLocaleString('az-AZ');
              } catch {
                return value;
              }
            }
          },
          { 
            key: "user_data.updated_at", 
            label: "Yenilənmə tarixi",
            icon: ClockIcon,
            getValue: (item) => item?.user_data?.updated_at,
            format: (value) => {
              if (!value) return "-";
              try {
                return new Date(value).toLocaleString('az-AZ');
              } catch {
                return value;
              }
            }
          },
        ]}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="İstifadəçini Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="istifadəçi"
        loading={deleteLoading}
      />

      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
        duration={3000}
      />
    </div>
  );
}

