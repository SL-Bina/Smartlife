import { useState, useCallback } from "react";
import complexesAPI from "../api";
const initialConfig = {
  pre_paid: false,
  sms_api_details: {},
  payment_gateway_details: {},
  complex_service_module: {},
};

export function useComplexSettings() {
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setConfigFromData = useCallback((data) => {
    if (!data) return;
    setConfig({
      pre_paid: data.pre_paid === true || data.pre_paid === "true",
      sms_api_details: data.sms_api_details || {},
      payment_gateway_details: data.payment_gateway_details || {},
      complex_service_module: data.complex_service_module || {},
    });
  }, []);

  const reset = useCallback(() => {
    setConfig(initialConfig);
    setErrors({});
  }, []);

  const save = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    try {
      await complexesAPI.updateConfig(id, {
        ...config,
        pre_paid: config.pre_paid ? "true" : "false",
      });
      return { success: true };
    } catch (e) {
      return { success: false, message: e?.message || "Xəta baş verdi" };
    } finally {
      setLoading(false);
    }
  }, [config]);

  return {
    config,
    loading,
    errors,
    updateField,
    setConfigFromData,
    reset,
    save,
  };
}