import api from "@/services/api";

// no mock data; always hit the backend

export const residentHomeAPI = {
  getInfo: async () => {
    const response = await api.get("/module/resident/config/me");
    return response.data;
  },
};

export default residentHomeAPI;

