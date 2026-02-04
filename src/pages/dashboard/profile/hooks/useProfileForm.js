import { useEffect, useState } from "react";

export function useProfileForm(user) {
  const [isInitialized, setIsInitialized] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    birthDate: user?.birthday
      ? (user.birthday.includes("T") ? user.birthday.split("T")[0] : user.birthday)
      : "",
    address: user?.address || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
  });

  useEffect(() => {
    if (user && !isInitialized) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        birthDate: user.birthday
          ? (user.birthday.includes("T") ? user.birthday.split("T")[0] : user.birthday)
          : "",
        address: user.address || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, setFormData, onChange };
}
