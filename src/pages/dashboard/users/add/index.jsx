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

import { useUserAddForm } from "./hooks/useUserAddForm";
import { useUserAddLookups } from "./hooks/useUserAddLookups";
import { useUsersData } from "./hooks/useUsersData";
import usersAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
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

    const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess);
    


    // Find first visible page
    for (const route of filteredRoutes) {
      if (route.layout === "dashboard" && route.pages && route.pages.length > 0) {
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
              if (childPath.startsWith('/dashboard')) {
                return childPath;
              }
              return `/dashboard${childPath}`;
            }
          }

          // If page has direct path, use it
          if (page.path) {
            const pagePath = page.path.startsWith('/')
              ? page.path
              : '/' + page.path;
            if (pagePath.startsWith('/dashboard')) {
              return pagePath;
            }
            return `/dashboard${pagePath}`;
          }
        }
      }
    }

    // Fallback to default home
    const userRole =
      user?.role?.name?.toLowerCase() ||
      (typeof user?.role === "string" ? user?.role.toLowerCase() : null);
    if (userRole === "resident") {
      return "/dashboard/resident/home";
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

  const openDelete = (x) => {
    setSelected(x);
    // TODO: Open delete modal
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
            onCreateClick={openCreate}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <div className="hidden lg:block">
            <UsersTable
              items={items}
              loading={loading}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>

          <div className="lg:hidden">
            <UsersCardList
              items={items}
              loading={loading}
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

