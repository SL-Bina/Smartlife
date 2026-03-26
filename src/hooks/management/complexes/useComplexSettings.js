import { useState, useCallback } from "react";
import complexesAPI from "@/services/management/complexesApi";
const initialConfig = {
  pre_paid: false,
  integrations: {
    device: {
      device_connection: "",
      device_panel_login: "",
      device_panel_password: "",
      device_complex_id: "",
      device_elevator_min_floor: "",
      device_elevator_max_floor: "",
    },
  },
  mail: {
    driver: "smtp",
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_address: "",
    from_name: "",
  },
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

  // Update nested fields like "mail.host", "integrations.device.device_connection"
  const updateNestedField = useCallback((path, value) => {
    const parts = path.split(".");
    setConfig((prev) => {
      const next = { ...prev };
      if (parts.length === 2) {
        next[parts[0]] = { ...prev[parts[0]], [parts[1]]: value };
      } else if (parts.length === 3) {
        next[parts[0]] = {
          ...prev[parts[0]],
          [parts[1]]: { ...prev[parts[0]]?.[parts[1]], [parts[2]]: value },
        };
      }
      return next;
    });
  }, []);

  const setConfigFromData = useCallback((data) => {
    if (!data) return;
    setConfig({
      pre_paid: data.pre_paid === true || data.pre_paid === "true",
      integrations: {
        device: {
          device_connection: data.integrations?.device?.device_connection || "",
          device_panel_login: data.integrations?.device?.device_panel_login || "",
          device_panel_password: data.integrations?.device?.device_panel_password || "",
          device_complex_id: data.integrations?.device?.device_complex_id ?? "",
          device_elevator_min_floor: data.integrations?.device?.device_elevator_min_floor ?? "",
          device_elevator_max_floor: data.integrations?.device?.device_elevator_max_floor ?? "",
        },
      },
      mail: {
        driver: data.mail?.driver || "smtp",
        host: data.mail?.host || "",
        port: data.mail?.port || 587,
        username: data.mail?.username || "",
        password: data.mail?.password || "",
        encryption: data.mail?.encryption || "tls",
        from_address: data.mail?.from_address || "",
        from_name: data.mail?.from_name || "",
      },
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
    updateNestedField,
    setConfigFromData,
    reset,
    save,
  };
}