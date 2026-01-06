// Mock data - real API hazır olduqda comment-ə alınacaq
const mockExpenseTypesData = [
  {
    id: 3,
    name: "Ofis xərcləri",
    description: "Ofis xərcləri haqqında...",
    createdAt: "2025-07-10",
  },
  {
    id: 15,
    name: "Bina xərcləri",
    description: "Bina xərcləri",
    createdAt: "2025-07-10",
  },
  {
    id: 45,
    name: "test",
    description: "",
    createdAt: "2025-11-19",
  },
];

export const fetchExpenseTypes = async (page = 1, perPage = 10) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const data = mockExpenseTypesData.slice(start, end);
        const total = mockExpenseTypesData.length;
        const totalPages = Math.ceil(total / perPage);

        resolve({
          success: true,
          data: data,
          pagination: {
            page,
            perPage,
            total,
            totalPages,
          },
        });
      }, 300);
    });
  } catch (error) {
    console.error("Error fetching expense types:", error);
    throw error;
  }
};

export const createExpenseType = async (expenseTypeData) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExpenseType = {
          id: mockExpenseTypesData.length + 1,
          name: expenseTypeData.name,
          description: expenseTypeData.description || "",
          createdAt: new Date().toISOString().split("T")[0],
        };
        mockExpenseTypesData.unshift(newExpenseType);
        resolve({
          success: true,
          data: newExpenseType,
          message: "Xərc növü uğurla əlavə edildi",
        });
      }, 300);
    });
  } catch (error) {
    console.error("Error creating expense type:", error);
    throw error;
  }
};

export const updateExpenseType = async (id, expenseTypeData) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockExpenseTypesData.findIndex((item) => item.id === id);
        if (index !== -1) {
          mockExpenseTypesData[index] = {
            ...mockExpenseTypesData[index],
            name: expenseTypeData.name,
            description: expenseTypeData.description || "",
          };
          resolve({
            success: true,
            data: mockExpenseTypesData[index],
            message: "Xərc növü uğurla yeniləndi",
          });
        } else {
          throw new Error("Xərc növü tapılmadı");
        }
      }, 300);
    });
  } catch (error) {
    console.error("Error updating expense type:", error);
    throw error;
  }
};

export const deleteExpenseType = async (id) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockExpenseTypesData.findIndex((item) => item.id === id);
        if (index !== -1) {
          mockExpenseTypesData.splice(index, 1);
          resolve({
            success: true,
            message: "Xərc növü uğurla silindi",
          });
        } else {
          throw new Error("Xərc növü tapılmadı");
        }
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting expense type:", error);
    throw error;
  }
};

