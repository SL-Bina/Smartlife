import api from "@/services/api";

const residentComplexDashboardAPI = {
	getMyProperties: async () => {
		try {
			const response = await api.get("/module/resident/config/my/properties");
			const list = response?.data?.data || [];
			return Array.isArray(list) ? list : [];
		} catch (error) {
			return [];
		}
	},
};

export default residentComplexDashboardAPI;
