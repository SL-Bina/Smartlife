import { useState } from "react";

const initialFormState = {
  priority: "",
  startTime: "",
  endTime: "",
  department: "",
  category: "",
  employees: [],
  text: "",
  file: null,
  status: "Gözləmədə",
};

export function useApplicationsListForm() {
  const [formData, setFormData] = useState(initialFormState);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const setFormFromApplication = (application) => {
    if (application) {
      setFormData({
        priority: application.priority || "",
        startTime: application.startTime || "",
        endTime: application.endTime || "",
        department: application.department || "",
        category: application.category || "",
        employees: application.employees || [],
        text: application.text || "",
        file: application.file || null,
        status: application.status || "Gözləmədə",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromApplication,
  };
}

