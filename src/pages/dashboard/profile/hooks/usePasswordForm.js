import { useState } from "react";

export function usePasswordForm() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return { passwordData, onChange, reset };
}
