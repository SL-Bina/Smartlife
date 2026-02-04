import api from "@/services/api";

export const blocksAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/blocks/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/blocks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const totalFloor = data?.meta?.total_floor ?? data?.meta?.totalFloor ?? data?.total_floor;
      const totalApartment = data?.meta?.total_apartment ?? data?.meta?.totalApartment ?? data?.total_apartment;

      const cleanedData = {
        complex_id: data.complex_id ?? data.complex?.id ?? null,
        building_id: data.building_id ?? data.building?.id ?? null,
        name: data.name || "",
        meta: {
          total_floor: totalFloor !== undefined && totalFloor !== null && totalFloor !== "" ? Number(totalFloor) : null,
          total_apartment:
            totalApartment !== undefined && totalApartment !== null && totalApartment !== "" ? Number(totalApartment) : null,
        },
      };

      console.log("Blocks Create Request:", cleanedData);
      const response = await api.put("/module/blocks/add", cleanedData);
      return response.data;
    } catch (error) {
      // MTK/Buildings-dəki kimi 400/422 validasiya xətalarını yığ
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        console.error("Blocks Create Error Response:", errorData);

        let allErrors = [];
        if (errorData?.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => allErrors.push(`${key}: ${err}`));
            } else {
              allErrors.push(`${key}: ${fieldErrors}`);
            }
          });
        }

        throw {
          message: errorData.message || "Validation Error",
          errors: errorData.errors,
          allErrors,
          ...errorData,
        };
      }

      console.error("Blocks Create Error:", error);
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const totalFloor = data?.meta?.total_floor ?? data?.meta?.totalFloor ?? data?.total_floor;
      const totalApartment = data?.meta?.total_apartment ?? data?.meta?.totalApartment ?? data?.total_apartment;

      const cleanedData = {
        complex_id: data.complex_id ?? data.complex?.id ?? null,
        building_id: data.building_id ?? data.building?.id ?? null,
        name: data.name || "",
        meta: {
          total_floor: totalFloor !== undefined && totalFloor !== null && totalFloor !== "" ? Number(totalFloor) : null,
          total_apartment:
            totalApartment !== undefined && totalApartment !== null && totalApartment !== "" ? Number(totalApartment) : null,
        },
      };

      console.log("Blocks Update Request:", cleanedData);
      const response = await api.patch(`/module/blocks/${id}`, cleanedData);
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
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/module/blocks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default blocksAPI;
