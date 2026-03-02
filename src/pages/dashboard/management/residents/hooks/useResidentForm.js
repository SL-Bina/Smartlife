import { useState, useCallback, useRef } from "react";

const initialFormData = {
  name: "",
  surname: "",
  type: "owner",
  email: "",
  phone: "",
  meta: {
    father_name: "",
    gender: "",
    personal_code: "",
    birth_date: "",
  },
  property: {
    mtk_id: null,
    complex_id: null,
    property_id: null,
  },
  // bind_existing: false,
  status: "active",
};

export function useResidentForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const originalDataRef = useRef(null);

  const updateField = useCallback((field, value) => {
    if (field.startsWith("meta.")) {
      const metaField = field.replace("meta.", "");
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: value,
        },
      }));
    } else if (field.startsWith("property.")) {
      const propertyField = field.replace("property.", "");
      setFormData((prev) => ({
        ...prev,
        property: {
          ...prev.property,
          [propertyField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setFormFromResident = useCallback((resident) => {
    if (!resident) {
      resetForm();
      return;
    }

    // Property binding comes from property_residents array (list API)
    // or from property object (direct assignment)
    const boundProp = resident.property_residents?.[0];

    setFormData({
      name: resident.name || "",
      surname: resident.surname || "",
      type: resident.type || "owner",
      email: resident.email || "",
      phone: resident.phone || "",
      meta: {
        father_name: resident.meta?.father_name || resident.father_name || "",
        gender: resident.meta?.gender || resident.gender || "",
        personal_code: resident.meta?.personal_code || resident.personal_code || "",
        birth_date: resident.meta?.birth_date || resident.birth_date || "",
      },
      property: {
        mtk_id: boundProp?.mtk_id || resident.property?.mtk_id || null,
        complex_id: boundProp?.complex_id || resident.property?.complex_id || null,
        property_id: boundProp?.property_id || resident.property?.property_id || null,
      },
      // bind_existing: resident.bind_existing || false,
      status: resident.status || "active",
    });
    originalDataRef.current = {
      name: resident.name || "",
      surname: resident.surname || "",
      type: resident.type || "owner",
      email: resident.email || "",
      phone: resident.phone || "",
      meta: {
        father_name: resident.meta?.father_name || resident.father_name || "",
        gender: resident.meta?.gender || resident.gender || "",
        personal_code: resident.meta?.personal_code || resident.personal_code || "",
        birth_date: resident.meta?.birth_date || resident.birth_date || "",
      },
      status: resident.status || "active",
    };
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    originalDataRef.current = null;
    setErrors({});
  }, []);

  const hasChanges = (() => {
    if (!originalDataRef.current) return true; // create mode — always allow
    const orig = originalDataRef.current;
    return (
      formData.name !== orig.name ||
      formData.surname !== orig.surname ||
      formData.type !== orig.type ||
      formData.email !== orig.email ||
      formData.phone !== orig.phone ||
      formData.status !== orig.status ||
      formData.meta?.father_name !== orig.meta?.father_name ||
      formData.meta?.gender !== orig.meta?.gender ||
      formData.meta?.personal_code !== orig.meta?.personal_code ||
      formData.meta?.birth_date !== orig.meta?.birth_date
    );
  })();

  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  return {
    formData,
    errors,
    hasChanges,
    updateField,
    setFormFromResident,
    resetForm,
    setFormErrors,
  };
}

