import { useState } from "react";

const emptyForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  birthday: "",
  personal_code: "",
  type: 1, // 1: user, 2: organization
  is_user: 1,
  role_id: "",
  modules: [],
  mtk: [],
  complex: [],
  apartments: [],
  permissions: [],
  profile_photo: null,
};

export function useUserAddForm() {
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const updateField = (key, value) => setFormData((p) => ({ ...p, [key]: value }));

  return {
    formData,
    resetForm,
    updateField,
    setFormData,
  };
}

