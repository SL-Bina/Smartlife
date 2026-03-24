import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import {
  CalendarIcon,
  CubeIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  EyeIcon,
  IdentificationIcon,
  KeyIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  Actions,
  DeleteConfirmModal,
  EditConfirmModal,
  ENTITY_LEVELS,
  FormModal,
  Header,
  Pagination,
  SearchModal,
  Skeleton,
  Table,
  ViewModal,
} from "@/components";
import { CustomSelect } from "@/components/ui/CustomSelect";
import usersAPI from "@/services/users/usersApi";

const DEFAULT_ITEMS_PER_PAGE = 10;
const FETCH_PER_PAGE = 100;

const emptyForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  birthday: "",
  personal_code: "",
  type: 1,
  is_user: 1,
  role_id: "",
  modules: [],
  mtkComplexPairs: [],
  apartments: [],
  permissions: [],
  assigned_access_preview: "",
  profile_photo: null,
};

const mapUser = (x) => ({
  id: x?.id || x?.user_id || x?.user_data?.id || null,
  name: x?.name || x?.user_data?.name || x?.full_name || "",
  username: x?.username || x?.user_data?.username || "",
  email: x?.email || x?.user_data?.email || "",
  phone: x?.phone || x?.user_data?.phone || "",
  role: x?.role || x?.user_role || null,
  status: x?.status || x?.user_status || "active",
});

const normalizeList = (res) => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const mapUserToForm = (user) => {
  const mtkIds = user?.mtk?.map((x) => x.id) || [];
  const complexIds = user?.complex?.map((x) => x.id) || [];
  
  // Create pairs from existing mtk and complex arrays
  // If user has multiple MTKs and Complexes, create all combinations
  const pairs = [];
  if (mtkIds.length > 0 && complexIds.length > 0) {
    mtkIds.forEach((mtkId) => {
      complexIds.forEach((complexId) => {
        pairs.push({ mtk_id: mtkId, complex_id: complexId });
      });
    });
  }

  return {
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birthday: user?.birthday || "",
    personal_code: user?.personal_code || "",
    role_id: user?.role?.id || "",
    type: user?.type || 1,
    is_user: user?.is_user || 1,
    modules: user?.modules?.map((x) => x.id) || [],
    mtkComplexPairs: pairs,
    apartments: user?.apartments?.map((x) => x.id) || [],
    permissions: user?.permissions?.map((x) => x.id) || [],
    assigned_access_preview: "",
    profile_photo: null,
    password: "",
    password_confirmation: "",
  };
};

const toNumberSafe = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getRoleId = (role) => toNumberSafe(role?.id ?? role?.role_id);

const getRoleAccessMeta = (role) => {
  const modules = Array.isArray(role?.role_access_modules) ? role.role_access_modules : [];
  const allowedModuleIds = new Set();
  const allowedPermissionIds = new Set();

  modules.forEach((moduleItem) => {
    const moduleId = toNumberSafe(moduleItem?.module_id ?? moduleItem?.id);
    if (moduleId !== null) {
      allowedModuleIds.add(moduleId);
    }

    if (Array.isArray(moduleItem?.permissions)) {
      moduleItem.permissions.forEach((permission) => {
        const permissionId = toNumberSafe(permission?.id);
        if (permissionId !== null) {
          allowedPermissionIds.add(permissionId);
        }
      });
    }
  });

  return {
    allowedModuleIds,
    allowedPermissionIds,
  };
};

const buildRoleAccessPreview = (role) => {
  const roleModules = Array.isArray(role?.role_access_modules) ? role.role_access_modules : [];
  if (roleModules.length === 0) {
    return "Secilen role aid modul ve icaze tapilmadi";
  }

  const header = `Secilen role ucun access xulasesi\nModul sayi: ${roleModules.length}\n`;

  const body = roleModules
    .map((moduleItem, index) => {
      const moduleName = moduleItem?.module_name || `Modul #${moduleItem?.module_id || "-"}`;
      const permissions = Array.isArray(moduleItem?.permissions) ? moduleItem.permissions : [];

      if (permissions.length === 0) {
        return [
          `${index + 1}) ${moduleName}`,
          "   - Icazeler: yoxdur",
        ].join("\n");
      }

      const permissionLines = permissions
        .map((permission) => permission?.permission || permission?.name || permission?.id)
        .filter(Boolean)
        .map((permissionName) => `   - ${permissionName}`)
        .join("\n");

      return [
        `${index + 1}) ${moduleName}`,
        "   Icazeler:",
        permissionLines,
      ].join("\n");
    })
    .join("\n\n");

  return `${header}\n${body}`;
};

export default function UsersPage() {
  const [search, setSearch] = useState({});
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);

  const [lookups, setLookups] = useState({
    roles: [],
    modules: [],
    mtks: [],
    complexes: [],
    permissions: [],
  });

  const [formOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formSaving, setFormSaving] = useState(false);

  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [itemToView, setItemToView] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  const [selectedRoleDetails, setSelectedRoleDetails] = useState(null);
  const [loadingRoleDetails, setLoadingRoleDetails] = useState(false);
  
  const [mtkComplexesMap, setMtkComplexesMap] = useState({});
  const [loadingMtkComplexes, setLoadingMtkComplexes] = useState(false);

  const createRoleOptions = useMemo(
    () => lookups.roles.map((role) => ({ value: role.id, label: role.name })),
    [lookups.roles]
  );

  const roleOptions = useMemo(
    () => [
      { value: "", label: "Butun rollar" },
      ...lookups.roles.map((role) => ({ value: String(role.id), label: role.name })),
    ],
    [lookups.roles]
  );

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = { page: 1, per_page: FETCH_PER_PAGE };
      if (search.name && String(search.name).trim()) {
        params.search = String(search.name).trim();
      }
      if (search.username && String(search.username).trim()) {
        params.username = String(search.username).trim();
      }
      if (search.email && String(search.email).trim()) {
        params.email = String(search.email).trim();
      }
      if (search.phone && String(search.phone).trim()) {
        params.phone = String(search.phone).trim();
      }

      const first = await usersAPI.getAll(params);
      const firstData = first?.data || first;
      const firstItems = Array.isArray(firstData?.data) ? firstData.data : [];
      const lastPage = firstData?.last_page || firstData?.meta?.last_page || 1;

      let merged = [...firstItems];
      if (lastPage > 1) {
        const requests = [];
        for (let pageNumber = 2; pageNumber <= lastPage; pageNumber += 1) {
          requests.push(usersAPI.getAll({ ...params, page: pageNumber }));
        }

        const results = await Promise.all(requests);
        results.forEach((res) => {
          const data = res?.data || res;
          const list = Array.isArray(data?.data) ? data.data : [];
          merged = merged.concat(list);
        });
      }

      setAllUsers(merged.map(mapUser));
      setFeedback({ type: "", message: "" });
    } catch (error) {
      setAllUsers([]);
      setFeedback({ type: "error", message: error?.message || "Istifadeci siyahisi yuklenmedi" });
    } finally {
      setLoadingUsers(false);
    }
  }, [search]);

  const fetchLookups = useCallback(async () => {
    try {
      const [rolesRes, modulesRes, mtkRes, complexRes] = await Promise.all([
        usersAPI.getRoles(),
        usersAPI.getModules(),
        usersAPI.getMtks(),
        usersAPI.getComplexes(),
      ]);

      const roles = normalizeList(rolesRes).map((role) => ({
        id: role.role_id || role.id,
        name: role.role_name || role.name,
        role_access_modules: role.role_access_modules || [],
      }));

      const modulesRaw = normalizeList(modulesRes);
      const modules = modulesRaw
        .map((moduleItem) => ({
          id: moduleItem?.module?.id,
          name: moduleItem?.module?.name,
        }))
        .filter((item) => item.id && item.name);

      const permissions = [];
      modulesRaw.forEach((moduleItem) => {
        if (Array.isArray(moduleItem?.module?.permissions)) {
          moduleItem.module.permissions.forEach((permission) => {
            permissions.push({
              id: permission.id,
              name: permission.permission,
              module_id: moduleItem?.module?.id,
            });
          });
        }
      });

      const mtks = normalizeList(mtkRes).map((item) => ({ id: item.id, name: item.name }));
      const complexes = normalizeList(complexRes).map((item) => ({ id: item.id, name: item.name }));

      setLookups({ roles, modules, permissions, mtks, complexes });
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Lookup melumatlari yuklenmedi" });
    }
  }, []);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    setPage(1);
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const effectiveRoleId = selectedRoleId || search.role_id || "";
    if (!effectiveRoleId) return allUsers;
    const selectedId = Number(effectiveRoleId);
    return allUsers.filter((item) => Number(item?.role?.id || item?.role_id) === selectedId);
  }, [allUsers, selectedRoleId, search.role_id]);

  const lastPage = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  const pageItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, page, itemsPerPage]);

  useEffect(() => {
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, lastPage]);

  const addNewMtkComplexPair = () => {
    setFormData((prev) => ({
      ...prev,
      mtkComplexPairs: [...prev.mtkComplexPairs, { mtk_id: null, complex_id: null }],
    }));
  };

  const updateMtkComplexPair = (index, field, value) => {
    const newValue = value === "" || value === null ? null : value;
    
    // If MTK is being updated, fetch complexes for that MTK
    if (field === "mtk_id" && newValue) {
      fetchComplexesForMtk(newValue);
      // Also clear the complex_id when MTK changes
      setFormData((prev) => {
        const updated = [...prev.mtkComplexPairs];
        updated[index] = {
          ...updated[index],
          [field]: newValue,
          complex_id: null, // Reset complex when MTK changes
        };
        return { ...prev, mtkComplexPairs: updated };
      });
      return;
    }
    
    setFormData((prev) => {
      const updated = [...prev.mtkComplexPairs];
      updated[index] = {
        ...updated[index],
        [field]: newValue,
      };
      return { ...prev, mtkComplexPairs: updated };
    });
  };

  const removeMtkComplexPair = (index) => {
    setFormData((prev) => ({
      ...prev,
      mtkComplexPairs: prev.mtkComplexPairs.filter((_, i) => i !== index),
    }));
  };

  const getMtkName = (mtkId) => {
    if (!mtkId) return "";
    return lookups.mtks.find((m) => m.id === mtkId)?.name || `MTK #${mtkId}`;
  };

  const getComplexName = (complexId) => {
    if (!complexId) return "";
    return lookups.complexes.find((c) => c.id === complexId)?.name || `Complex #${complexId}`;
  };

  const getComplexesByMtk = (mtkId) => {
    if (!mtkId) return lookups.complexes;
    // Return cached complexes for this MTK, or all if not cached
    return mtkComplexesMap[mtkId] || lookups.complexes;
  };

  const fetchComplexesForMtk = useCallback(async (mtkId) => {
    if (!mtkId || mtkComplexesMap[mtkId]) {
      return; // Already cached or no MTK selected
    }

    setLoadingMtkComplexes(true);
    try {
      const response = await usersAPI.getComplexesByMtk([mtkId]);
      const complexes = normalizeList(response).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setMtkComplexesMap((prev) => ({
        ...prev,
        [mtkId]: complexes,
      }));
    } catch (error) {
      console.error(`Failed to fetch complexes for MTK ${mtkId}:`, error);
      // Fallback to all complexes if fetch fails
    } finally {
      setLoadingMtkComplexes(false);
    }
  }, [mtkComplexesMap]);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setFormData(emptyForm);
    setSelectedRoleDetails(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setSelected(item);
    setFormData(mapUserToForm(item));
    setSelectedRoleDetails(null);
    setFormOpen(true);
  };

  const handleFormChange = (key, value) => {
    const numericKeys = ["type", "is_user", "role_id"];
    const nextValue = numericKeys.includes(key) && value !== "" && value !== null ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [key]: nextValue }));
  };

  const prepareMtkComplexPayload = (data) => {
    // Extract unique mtk_ids and complex_ids from pairs, filtering out null values
    const mtkIds = new Set();
    const complexIds = new Set();

    (data.mtkComplexPairs || []).forEach((pair) => {
      if (pair.mtk_id !== null && pair.mtk_id !== undefined) {
        mtkIds.add(pair.mtk_id);
      }
      if (pair.complex_id !== null && pair.complex_id !== undefined) {
        complexIds.add(pair.complex_id);
      }
    });

    return {
      ...data,
      mtk: Array.from(mtkIds),
      complex: Array.from(complexIds),
      mtkComplexPairs: undefined, // Remove pairs from payload
    };
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Ad mutleqdir";
    if (!formData.username.trim()) return "Istifadechi adi mutleqdir";
    if (!formData.email.trim()) return "Email mutleqdir";
    if (!formData.phone.trim()) return "Telefon mutleqdir";
    if (!formData.role_id) return "Rol secmek mutleqdir";

    // Check for incomplete MTK-Complex pairs
    const incompletePairs = formData.mtkComplexPairs.some(
      (pair) => (pair.mtk_id && !pair.complex_id) || (!pair.mtk_id && pair.complex_id)
    );
    if (incompletePairs) {
      return "Bütün MTK-Complex ciftleri tam olmalidir";
    }

    if (mode === "create" && !formData.password.trim()) return "Sifre mutleqdir";
    if ((mode === "create" || formData.password) && formData.password !== formData.password_confirmation) {
      return "Sifreler ust-uste dusmur";
    }

    return "";
  };

  const submitForm = async (data) => {
    const formPayload = data || formData;
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      throw new Error(validationError);
    }

    const payload = prepareMtkComplexPayload(formPayload);

    setFormSaving(true);
    try {
      await usersAPI.addUser(payload);
      setFeedback({ type: "success", message: "Istifadechi ugurla elave edildi" });
      setFormData(emptyForm);
      setSelectedRoleDetails(null);
      setFormOpen(false);
      await fetchUsers();
    } catch (error) {
      const message = error?.message || "Emeliyyat ugursuz oldu";
      setFeedback({ type: "error", message });
      throw error;
    } finally {
      setFormSaving(false);
    }
  };

  const handleEditRequest = (data) => {
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    setPendingFormData(data || formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!selected?.id || !pendingFormData) return;

    setEditConfirmLoading(true);
    try {
      const payload = prepareMtkComplexPayload(pendingFormData);
      await usersAPI.update(selected.id, payload);
      setFeedback({ type: "success", message: "Istifadechi ugurla yenilendi" });
      setEditConfirmOpen(false);
      setPendingFormData(null);
      setFormOpen(false);
      setFormData(emptyForm);
      setSelectedRoleDetails(null);
      setSelected(null);
      await fetchUsers();
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Emeliyyat ugursuz oldu" });
    } finally {
      setEditConfirmLoading(false);
    }
  };

  const handleView = async (item) => {
    const userId = item?.id;
    if (!userId) {
      setFeedback({ type: "error", message: "Istifadechi ID tapilmadi" });
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await usersAPI.getById(userId);
      setItemToView(response?.data || response);
    } catch (error) {
      setViewModalOpen(false);
      setItemToView(null);
      setFeedback({ type: "error", message: error?.message || "Istifadechi melumatlari yuklenmedi" });
    } finally {
      setViewLoading(false);
    }
  };

  const openDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    setDeleteLoading(true);
    try {
      await usersAPI.delete(itemToDelete.id);
      setFeedback({ type: "success", message: "Istifadechi ugurla silindi" });
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await fetchUsers();
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Silme emeliyyati ugursuz oldu" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    if (normalized === "active") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const getStatusLabel = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    if (normalized === "active") return "Aktiv";
    if (normalized === "inactive") return "Qeyri-aktiv";
    return status || "-";
  };

  const selectedRoleForForm = useMemo(() => {
    if (selectedRoleDetails) {
      return selectedRoleDetails;
    }
    
    const selectedId = toNumberSafe(formData.role_id);
    if (selectedId === null) return null;
    return lookups.roles.find((role) => getRoleId(role) === selectedId) || null;
  }, [formData.role_id, lookups.roles, selectedRoleDetails]);

  const roleScopedOptions = useMemo(() => {
    if (!selectedRoleForForm) {
      return {
        modules: [],
        permissions: [],
      };
    }

    const { allowedModuleIds, allowedPermissionIds } = getRoleAccessMeta(selectedRoleForForm);

    const modules = lookups.modules.filter((moduleItem) => {
      const moduleId = toNumberSafe(moduleItem?.id);
      if (moduleId === null) return false;
      if (allowedModuleIds.size === 0) return false;
      return allowedModuleIds.has(moduleId);
    });

    const permissions = lookups.permissions.filter((permissionItem) => {
      const permissionId = toNumberSafe(permissionItem?.id);
      if (permissionId === null) return false;
      if (allowedPermissionIds.size > 0) {
        return allowedPermissionIds.has(permissionId);
      }

      // If API does not return permission list under role, fallback to module-based restriction.
      const moduleId = toNumberSafe(permissionItem?.module_id);
      if (moduleId === null) return false;
      return allowedModuleIds.has(moduleId);
    });

    return {
      modules,
      permissions,
    };
  }, [lookups.modules, lookups.permissions, selectedRoleForForm]);

  useEffect(() => {
    if (!formOpen) return;

    if (!selectedRoleForForm) {
      setFormData((prev) => {
        if ((prev.modules || []).length === 0 && (prev.permissions || []).length === 0 && !prev.assigned_access_preview) {
          return prev;
        }
        return {
          ...prev,
          modules: [],
          permissions: [],
          assigned_access_preview: "",
        };
      });
      return;
    }

    const { allowedModuleIds, allowedPermissionIds } = getRoleAccessMeta(selectedRoleForForm);
    const assignedModuleIds = Array.from(allowedModuleIds);
    const assignedPermissionIds = Array.from(allowedPermissionIds);
    const assignedPreview = buildRoleAccessPreview(selectedRoleForForm);

    setFormData((prev) => {
      const currentModules = Array.isArray(prev.modules) ? prev.modules.map((x) => toNumberSafe(x)).filter((x) => x !== null) : [];
      const currentPermissions = Array.isArray(prev.permissions) ? prev.permissions.map((x) => toNumberSafe(x)).filter((x) => x !== null) : [];
      const sameModules =
        currentModules.length === assignedModuleIds.length &&
        assignedModuleIds.every((id) => currentModules.includes(id));
      const samePermissions =
        currentPermissions.length === assignedPermissionIds.length &&
        assignedPermissionIds.every((id) => currentPermissions.includes(id));
      const samePreview = (prev.assigned_access_preview || "") === assignedPreview;

      if (sameModules && samePermissions && samePreview) {
        return prev;
      }

      return {
        ...prev,
        modules: assignedModuleIds,
        permissions: assignedPermissionIds,
        assigned_access_preview: assignedPreview,
      };
    });
  }, [formOpen, selectedRoleForForm]);

  useEffect(() => {
    const roleId = toNumberSafe(formData.role_id);
    
    if (!formOpen || !roleId) {
      setSelectedRoleDetails(null);
      return;
    }

    const fetchRoleDetails = async () => {
      setLoadingRoleDetails(true);
      try {
        const response = await usersAPI.getRoleById(roleId);
        const roleData = response?.data || response;
        setSelectedRoleDetails(roleData);
      } catch (error) {
        console.error("Role details fetch error:", error);
        setFeedback({ 
          type: "error", 
          message: "Role məlumatları yüklənərkən xəta baş verdi" 
        });
      } finally {
        setLoadingRoleDetails(false);
      }
    };

    fetchRoleDetails();
  }, [formOpen, formData.role_id]);

  useEffect(() => {
    if (!formOpen || !formData.mtkComplexPairs.length) {
      return;
    }

    // Fetch complexes for all MTKs in the pairs
    const mtkIdsToFetch = formData.mtkComplexPairs
      .map((pair) => pair.mtk_id)
      .filter((mtkId) => mtkId && !mtkComplexesMap[mtkId]);

    mtkIdsToFetch.forEach((mtkId) => {
      fetchComplexesForMtk(mtkId);
    });
  }, [formOpen, formData.mtkComplexPairs, mtkComplexesMap, fetchComplexesForMtk]);

  const tableColumns = useMemo(
    () => [
      {
        key: "id",
        label: "ID",
        align: "text-left",
        render: (row) => (
          <Typography variant="small" className="font-mono text-xs font-semibold text-gray-700">
            #{row.id || "-"}
          </Typography>
        ),
      },
      {
        key: "name",
        label: "Ad",
        align: "text-left",
        render: (row) => <Typography className="text-sm font-semibold text-gray-900">{row.name || "-"}</Typography>,
      },
      {
        key: "username",
        label: "Istifadechi adi",
        align: "text-left",
      },
      {
        key: "email",
        label: "Email",
        align: "text-left",
      },
      {
        key: "phone",
        label: "Telefon",
        align: "text-left",
      },
      {
        key: "role",
        label: "Rol",
        align: "text-left",
        render: (row) => <Typography className="text-sm text-gray-700">{row?.role?.name || "-"}</Typography>,
      },
      {
        key: "status",
        label: "Status",
        align: "text-left",
        render: (row) => <Chip value={getStatusLabel(row?.status)} className={`${getStatusColor(row?.status)} text-xs font-medium w-fit`} size="sm" />,
      },
      {
        key: "actions",
        label: "Emeliyyatlar",
        align: "text-left",
        cellClassName: "whitespace-nowrap",
        render: (row) => (
          <Menu placement="left-start">
            <MenuHandler>
              <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </IconButton>
            </MenuHandler>
            <MenuList className="dark:bg-gray-800 dark:border-gray-800">
              <MenuItem onClick={() => handleView(row)} className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4" /> Bax
              </MenuItem>
              <MenuItem onClick={() => openEdit(row)} className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4" /> Redakte et
              </MenuItem>
              <MenuItem onClick={() => openDelete(row)} className="flex items-center gap-2 text-red-600">
                <TrashIcon className="h-4 w-4" /> Sil
              </MenuItem>
            </MenuList>
          </Menu>
        ),
      },
    ],
    []
  );

  const formFields = useMemo(
    () => [
      { key: "name", label: "Ad", type: "text", required: true },
      { key: "username", label: "Istifadechi adi", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Telefon", type: "phone", required: true },
      { key: "birthday", label: "Dogum tarixi", type: "date" },
      { key: "personal_code", label: "Sexsiyyet nomresi", type: "text" },
      {
        key: "role_id",
        label: "Rol",
        type: "select",
        options: createRoleOptions,
        required: true,
      },
      {
        key: "type",
        label: "Tip",
        type: "select",
        options: [
          { value: 1, label: "Istifadeci" },
          { value: 2, label: "Teshkilat" },
        ],
      },
      { key: "password", label: mode === "edit" ? "Sifre (isteye bagli)" : "Sifre", type: "password" },
      { key: "password_confirmation", label: mode === "edit" ? "Sifre tesdiqi (isteye bagli)" : "Sifre tesdiqi", type: "password" },
      { key: "assigned_access_preview", label: "Role aid modul ve icazeler", type: "textarea", rows: 8, colSpan: 2, disabled: true },
      {
        key: "mtkComplexPairs",
        label: "MTK və Complex",
        type: "custom",
        colSpan: 2,
        customRender: () => (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="small" className="font-semibold text-gray-900 dark:text-white">
                MTK-kompleks
              </Typography>
            </div>

            {formData.mtkComplexPairs.length > 0 && (
              <div className="space-y-2">
                {formData.mtkComplexPairs.map((pair, index) => (
                  <div
                    key={`pair-${index}`}
                    className="flex items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex-1">
                      {/* <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        MTK
                      </label> */}
                      <CustomSelect
                        label="MTK Seç"
                        value={pair.mtk_id ? String(pair.mtk_id) : ""}
                        onChange={(newVal) => updateMtkComplexPair(index, "mtk_id", newVal ? toNumberSafe(newVal) : null)}
                        options={lookups.mtks.map((m) => ({ value: m.id, label: m.name }))}
                      />
                    </div>

                    <div className="flex-1">
                      {/* <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Complex
                      </label> */}
                      <CustomSelect
                        label="K    ompleks Seç"
                        value={pair.complex_id ? String(pair.complex_id) : ""}
                        onChange={(newVal) => updateMtkComplexPair(index, "complex_id", newVal ? toNumberSafe(newVal) : null)}
                        options={getComplexesByMtk(pair.mtk_id).map((c) => ({ value: c.id, label: c.name }))}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMtkComplexPair(index)}
                      className="mb-1 rounded bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                      title="Sil"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addNewMtkComplexPair}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 py-2 text-sm font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <span>+</span>
              <span>MTK-Complex Əlavə Et</span>
            </button>

            {formData.mtkComplexPairs.length === 0 && (
              <Typography variant="small" className="italic text-gray-400">
                Əlavə etmək üçün "+" düyməsinə basın
              </Typography>
            )}
          </div>
        ),
      },
      { key: "profile_photo", label: "Profil sekli", type: "file", accept: "image/*", colSpan: 2 },
    ],
    [
      createRoleOptions,
      mode,
      formData.mtkComplexPairs,
      lookups.mtks,
      lookups.complexes,
      mtkComplexesMap,
      loadingMtkComplexes,
    ]
  );

  return (
    <div className="space-y-6" style={{ position: "relative", zIndex: 0 }}>
      <Header icon={UserIcon} title="Istifadeci Idareetmesi" subtitle="Istifadecileri yarat / redakte et / sil / bax" />

      {feedback.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <Actions
        entityLevel={ENTITY_LEVELS.USER}
        search={search}
        onCreateClick={openCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={(value) => {
          setSearch((prev) => ({
            ...prev,
            name: value && value.trim() ? value.trim() : undefined,
          }));
        }}
        onRemoveFilter={(key) => {
          setSearch((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }}
        showStatus={false}
        renderExtraControls={(isMobile) => (
          <div className={isMobile ? "w-full" : "w-full md:w-[200px] flex-shrink-0"}>
            <CustomSelect
              label="Rol"
              value={selectedRoleId}
              onChange={(value) => {
                setSelectedRoleId(value || "");
                setSearch((prev) => ({ ...prev, role_id: value || undefined }));
                setPage(1);
              }}
              options={roleOptions}
            />
          </div>
        )}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setPage(1);
        }}
      />

      {loadingUsers ? (
        <Skeleton tableRows={6} cardRows={4} />
      ) : (
        <Table rows={pageItems} columns={tableColumns} loading={false} emptyText="Istifadeci tapilmadi" minWidth="min-w-[980px]" />
      )}

      {!loadingUsers && filteredUsers.length > 0 ? (
        <Pagination
          page={page}
          totalPages={lastPage}
          onPageChange={setPage}
          summary={
            <>
              Cem: <b>{filteredUsers.length}</b> netice
            </>
          }
          prevLabel="Evvelki"
          nextLabel="Novbeti"
          alwaysVisible
          hidePageNumbers
        />
      ) : null}

      <FormModal
        open={formOpen}
        mode={mode}
        title={mode === "edit" ? "Istifadechini redakte et" : "Istifadechi elave et"}
        description="Istifadeci melumatlarini daxil edin ve yadda saxlayin."
        fields={formFields}
        formData={formData}
        saving={formSaving}
        onFieldChange={handleFormChange}
        onClose={() => {
          setFormOpen(false);
          setFormData(emptyForm);
          setSelected(null);
        }}
        onSubmit={submitForm}
        onEditRequest={handleEditRequest}
      />

      <SearchModal
        open={searchModalOpen}
        title="Axtaris"
        description="Axtaris kriteriyalarini daxil edib neticeni daraldin"
        fields={[
          { key: "name", label: "Ad", type: "text" },
          { key: "username", label: "Istifadechi adi", type: "text" },
          { key: "email", label: "Email", type: "text" },
          { key: "phone", label: "Telefon", type: "phone" },
        ]}
        currentSearch={search}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(params) => {
          setSearch((prev) => ({
            ...prev,
            ...params,
            role_id: prev.role_id,
          }));
          setPage(1);
        }}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Istifadechi melumatlari"
        item={itemToView}
        loading={viewLoading}
        fields={[
          { key: "user_data.name", label: "Ad", icon: UserIcon, getValue: (item) => item?.user_data?.name },
          {
            key: "user_data.username",
            label: "Istifadechi adi",
            icon: IdentificationIcon,
            getValue: (item) => item?.user_data?.username,
          },
          { key: "user_data.email", label: "Email", icon: EnvelopeIcon, getValue: (item) => item?.user_data?.email },
          { key: "user_data.phone", label: "Telefon", icon: PhoneIcon, getValue: (item) => item?.user_data?.phone },
          {
            key: "user_data.birthday",
            label: "Dogum tarixi",
            icon: CalendarIcon,
            getValue: (item) => item?.user_data?.birthday,
            format: (value) => (value ? new Date(value).toLocaleDateString("az-AZ") : "-"),
          },
          {
            key: "role.name",
            label: "Rol",
            icon: IdentificationIcon,
            getValue: (item) => item?.role?.name,
          },
          {
            key: "role_access_modules",
            label: "Role aid modul ve icazeler",
            icon: CubeIcon,
            fullWidth: true,
            customRender: (item, field) => {
              const modules = Array.isArray(item?.role_access_modules) ? item.role_access_modules : [];

              if (modules.length === 0) {
                return (
                  <>
                    <div className="mb-2 flex items-center gap-2">
                      <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Typography variant="small" className="font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 text-xs">
                        {field.label}
                      </Typography>
                    </div>
                    <Typography variant="paragraph" className="text-sm italic text-gray-400 dark:text-gray-500">
                      Bu role aid modul ve icaze tapilmadi
                    </Typography>
                  </>
                );
              }

              return (
                <>
                  <div className="mb-3 flex items-center gap-2">
                    <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <Typography variant="small" className="font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 text-xs">
                      {field.label}
                    </Typography>
                  </div>

                  <div className="space-y-3">
                    {modules.map((moduleItem, idx) => {
                      const moduleName = moduleItem?.module_name || `Modul #${moduleItem?.module_id || "-"}`;
                      const permissions = Array.isArray(moduleItem?.permissions) ? moduleItem.permissions : [];

                      return (
                        <div key={`${moduleName}-${idx}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700/40">
                          <div className="mb-2 flex items-center gap-2">
                            <CubeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <Typography variant="small" className="font-semibold text-gray-900 dark:text-white">
                              {moduleName}
                            </Typography>
                          </div>

                          {permissions.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {permissions.map((permission, permIdx) => (
                                <div
                                  key={`${moduleName}-perm-${permIdx}`}
                                  className="flex items-center gap-2 rounded border border-gray-200 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-800"
                                >
                                  <KeyIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                  <Typography variant="small" className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {permission?.permission || permission?.name || permission?.id}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Typography variant="small" className="text-xs italic text-gray-400 dark:text-gray-500">
                              Icaze yoxdur
                            </Typography>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            },
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
        title="Istifadechini sil"
        itemName={itemToDelete ? `\"${itemToDelete.name}\"` : ""}
        entityName="istifadechi"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Istifadechini redakte et"
        itemName={selected ? `\"${selected.name}\"` : ""}
        entityName="istifadechi"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />

      {/* MTK-Complex Selection Modal */}
    </div>
  );
}
