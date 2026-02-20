import { useEffect, useState } from "react";

export function useResidentProfileForm(user) {
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birth_date: user?.meta?.birth_date
      ? (user.meta.birth_date.includes("T") ? user.meta.birth_date.split("T")[0] : user.meta.birth_date)
      : "",
    gender: user?.meta?.gender || "",
    personal_code: user?.meta?.personal_code || "",
  });

  useEffect(() => {
    if (user && !isInitialized) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        phone: user.phone || "",
        birth_date: user.meta?.birth_date
          ? (user.meta.birth_date.includes("T") ? user.meta.birth_date.split("T")[0] : user.meta.birth_date)
          : "",
        gender: user.meta?.gender || "",
        personal_code: user.meta?.personal_code || "",
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, setFormData, onChange };
}

