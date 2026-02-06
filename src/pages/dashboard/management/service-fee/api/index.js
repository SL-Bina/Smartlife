import api from "@/services/api";

/**
 * Property məlumatlarını API-dən gətirir
 * @param {number} propertyId - Property ID
 * @returns {Promise<Object>} Property məlumatları
 */
export const fetchPropertyById = async (propertyId) => {
  try {
    const response = await api.get(`/module/properties/${propertyId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Property-nin service fee-lərinin siyahısını API-dən gətirir
 * @param {number} propertyId - Property ID
 * @param {Object} params - Pagination və filter parametrləri
 * @returns {Promise<Object>} Service fee-lərin siyahısı (pagination ilə)
 */
export const fetchServiceFeeList = async (propertyId, params = {}) => {
  try {
    const response = await api.get(`/module/service-configure/property/list/${propertyId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching service fee list:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Bir service fee-nin detallarını API-dən gətirir
 * @param {number} propertyId - Property ID
 * @param {number} serviceFeeId - Service Fee ID
 * @returns {Promise<Object>} Service fee detalları
 */
export const fetchServiceFeeById = async (propertyId, serviceFeeId) => {
  try {
    const response = await api.get(`/module/service-configure/property/${propertyId}/${serviceFeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service fee:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Yeni service fee əlavə edir
 * @param {number} propertyId - Property ID
 * @param {Object} data - Service fee məlumatları
 * @returns {Promise<Object>} Yeni service fee
 */
export const createServiceFee = async (propertyId, data) => {
  try {
    // Clean data - include property_id as required by backend
    const cleanedData = {
      property_id: Number(propertyId),
      service_id: Number(data.service_id) || null,
      price: data.price ? String(data.price) : null,
      start_date: data.start_date || null,
      last_date: data.last_date || null,
      next_date: data.next_date || null,
      type: data.type || "monthly",
      status: data.status || "active",
    };

    // Remove null/empty optional fields
    if (!cleanedData.last_date) {
      delete cleanedData.last_date;
    }
    if (!cleanedData.next_date) {
      delete cleanedData.next_date;
    }

    const response = await api.put(`/module/service-configure/property/${propertyId}/add`, cleanedData);
    return response.data;
  } catch (error) {
    console.error("Service Fee Create Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Log full error response for debugging
    if (error.response?.data) {
      console.error("Full Error Response Data:", error.response.data);
      if (error.response.data.errors) {
        console.error("Validation Errors:", error.response.data.errors);
      }
      if (error.response.data.message) {
        console.error("Error Message:", error.response.data.message);
      }
    }

    if (error.response?.status === 400 || error.response?.status === 422) {
      const errorData = error.response.data;
      if (errorData?.errors) {
        const firstError = Object.values(errorData.errors)[0];
        throw {
          message: Array.isArray(firstError) ? firstError[0] : firstError,
          errors: errorData.errors,
          ...errorData,
        };
      }
      throw errorData;
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Service fee-ni yeniləyir
 * @param {number} propertyId - Property ID
 * @param {number} serviceFeeId - Service Fee ID
 * @param {Object} data - Yenilənəcək service fee məlumatları
 * @returns {Promise<Object>} Yenilənmiş service fee
 */
export const updateServiceFee = async (propertyId, serviceFeeId, data) => {
  try {
    const cleanedData = {
      property_id: Number(propertyId),
      service_id: Number(data.service_id) || null,
      price: data.price ? String(data.price) : null,
      start_date: data.start_date || null,
      last_date: data.last_date || null,
      next_date: data.next_date || null,
      type: data.type || "monthly",
      status: data.status || "active",
    };

    // Remove null/empty optional fields
    if (!cleanedData.last_date) {
      delete cleanedData.last_date;
    }
    if (!cleanedData.next_date) {
      delete cleanedData.next_date;
    }

    const response = await api.patch(`/module/service-configure/property/${propertyId}/${serviceFeeId}`, cleanedData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 422) {
      const errorData = error.response.data;
      if (errorData?.errors) {
        const firstError = Object.values(errorData.errors)[0];
        throw {
          message: Array.isArray(firstError) ? firstError[0] : firstError,
          errors: errorData.errors,
          ...errorData,
        };
      }
      throw errorData;
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Service fee-ni silir
 * @param {number} propertyId - Property ID
 * @param {number} serviceFeeId - Service Fee ID
 * @returns {Promise<Object>} Silinmə nəticəsi
 */
export const deleteServiceFee = async (propertyId, serviceFeeId) => {
  try {
    const response = await api.delete(`/module/service-configure/property/${propertyId}/${serviceFeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

