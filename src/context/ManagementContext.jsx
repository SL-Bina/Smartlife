import React, { createContext, useContext, useState, useMemo } from "react";
import { mtkAPI } from "@/pages/dashboard/management/mtk/api";
import { complexAPI } from "@/pages/dashboard/management/complex/api";
import { buildingsAPI } from "@/pages/dashboard/management/buildings/api";

const ManagementContext = createContext(null);

const generateMockData = () => {
  const mtkData = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `MTK ${index + 1}`,
  }));

  const complexData = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Kompleks ${index + 1}`,
    address: `Ünvan ${index + 1}`,
    mtkId: (index % 10) + 1,
    buildings: Math.floor(Math.random() * 10) + 1,
    residents: Math.floor(Math.random() * 200) + 20,
  }));

  const buildingsData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Bina ${index + 1}`,
    complexId: (index % 20) + 1,
    complex: complexData[(index % 20)].name,
    blocks: Math.floor(Math.random() * 5) + 1,
    apartments: Math.floor(Math.random() * 80) + 20,
  }));

  const blocksData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Blok ${String.fromCharCode(65 + (index % 5))}-${Math.floor(index / 5) + 1}`,
    buildingId: (index % 50) + 1,
    building: buildingsData[(index % 50)].name,
    floors: (index % 16) + 5,
    apartments: Math.floor(Math.random() * 40) + 10,
  }));

  const TOTAL_APARTMENTS = 200;
  const APARTMENTS_PER_FLOOR = 5;
  const propertiesData = Array.from({ length: TOTAL_APARTMENTS }, (_, index) => {
    const floor = Math.floor(index / APARTMENTS_PER_FLOOR) + 1;
    const apartmentInFloor = (index % APARTMENTS_PER_FLOOR) + 1;
    const blockIndex = Math.floor(index / (APARTMENTS_PER_FLOOR * 10)) % 5;

    return {
      id: index + 1,
      number: `Mənzil ${floor}${String(apartmentInFloor).padStart(2, "0")}`,
      block: `Blok ${String.fromCharCode(65 + blockIndex)}`,
      blockId: (blockIndex % 50) + 1,
      floor: floor,
      area: 60 + (index % 10) * 5,
      resident: `Sakin ${index + 1}`,
      serviceFee: 20 + (index % 6) * 2,
      buildingId: Math.floor(index / 40) + 1,
      complexId: Math.floor(index / 200) + 1,
    };
  });

  const residentsData = Array.from({ length: 150 }, (_, index) => {
    const isLegalEntity = index % 3 === 0;
    const type = isLegalEntity ? "legal" : "physical";

    return {
      id: index + 1,
      fullName: isLegalEntity ? `Şirkət ${index + 1} MMC` : `Sakin ${index + 1} Ad Soyad`,
      phone: `050-000-${String(index + 1).padStart(2, "0")}`,
      email: `sakin${index + 1}@mail.com`,
      apartment: propertiesData[index % TOTAL_APARTMENTS].number,
      apartmentId: (index % TOTAL_APARTMENTS) + 1,
      block: propertiesData[index % TOTAL_APARTMENTS].block,
      floor: propertiesData[index % TOTAL_APARTMENTS].floor,
      status: index % 2 === 0 ? "Aktiv" : "Passiv",
      type: type,
      fin: isLegalEntity ? null : `123456789${String(index).padStart(2, "0")}`,
      birthDate: isLegalEntity ? null : `199${index % 10}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
      gender: isLegalEntity ? null : (index % 2 === 0 ? "Kişi" : "Qadın"),
      voen: isLegalEntity ? `123456789${String(index).padStart(2, "0")}` : null,
      registrationDate: isLegalEntity ? `202${index % 4}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}` : null,
      address: `Bakı şəhəri, ${index + 1} küçəsi, ${index + 10} ev`,
      registrationAddress: `Bakı şəhəri, ${index + 5} küçəsi, ${index + 15} ev`,
      joinDate: `202${index % 4}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
      notes: index % 5 === 0 ? "Xüsusi qeydlər burada yer alır" : "",
      emergencyContact: `Fövqəladə hal üçün: ${String(index + 100).padStart(3, "0")}-${String(index + 1).padStart(2, "0")}-${String(index + 10).padStart(2, "0")}`,
      paymentMethod: index % 3 === 0 ? "Kart" : index % 3 === 1 ? "Nağd" : "Bank köçürməsi",
      balance: (index * 100) - (index * 50),
    };
  });

  const apartmentGroupsData = [
    {
      id: 1,
      name: "A Blok - 1-ci giriş",
      buildingId: 1,
      building: "Bina 1",
      complexId: 1,
      complex: "Kompleks 1",
      total: 40,
      occupied: 32,
      serviceFee: 25,
    },
    {
      id: 2,
      name: "A Blok - 2-ci giriş",
      buildingId: 1,
      building: "Bina 1",
      complexId: 1,
      complex: "Kompleks 1",
      total: 28,
      occupied: 20,
      serviceFee: 30,
    },
    {
      id: 3,
      name: "B Blok - 1-ci giriş",
      buildingId: 2,
      building: "Bina 2",
      complexId: 1,
      complex: "Kompleks 1",
      total: 36,
      occupied: 18,
      serviceFee: 22,
    },
  ];

  const buildingServiceFeeData = [
    {
      id: 1,
      buildingId: 1,
      building: "Bina 1",
      complexId: 1,
      complex: "Kompleks 1",
      baseFee: 25,
      perM2: 0.4,
      lastUpdatedBy: "Admin",
    },
    {
      id: 2,
      buildingId: 2,
      building: "Bina 2",
      complexId: 1,
      complex: "Kompleks 1",
      baseFee: 30,
      perM2: 0.5,
      lastUpdatedBy: "Manager",
    },
  ];

  return {
    mtk: mtkData,
    complexes: complexData,
    buildings: buildingsData,
    blocks: blocksData,
    properties: propertiesData,
    residents: residentsData,
    apartmentGroups: apartmentGroupsData,
    buildingServiceFees: buildingServiceFeeData,
  };
};

export function ManagementProvider({ children }) {
  const [data, setData] = useState(() => generateMockData());
  const [refreshKey, setRefreshKey] = useState(0);

  const updateMtk = async (id, updates) => {
    try {
      const response = await mtkAPI.update(id, updates);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to update MTK");
    } catch (error) {
      console.error("Error updating MTK:", error);
      throw error;
    }
  };

  const addMtk = async (newMtk) => {
    try {
      const response = await mtkAPI.create(newMtk);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to create MTK");
    } catch (error) {
      console.error("Error creating MTK:", error);
      throw error;
    }
  };

  const deleteMtk = async (id) => {
    try {
      const response = await mtkAPI.delete(id);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to delete MTK");
    } catch (error) {
      console.error("Error deleting MTK:", error);
      throw error;
    }
  };

  const updateComplex = async (id, updates) => {
    try {
      const response = await complexAPI.update(id, updates);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to update Complex");
    } catch (error) {
      console.error("Error updating Complex:", error);
      throw error;
    }
  };

  const addComplex = async (newComplex) => {
    try {
      const response = await complexAPI.create(newComplex);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to create Complex");
    } catch (error) {
      console.error("Error creating Complex:", error);
      throw error;
    }
  };

  const deleteComplex = async (id) => {
    try {
      const response = await complexAPI.delete(id);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to delete Complex");
    } catch (error) {
      console.error("Error deleting Complex:", error);
      throw error;
    }
  };

  const updateBuilding = async (id, updates) => {
    try {
      const response = await buildingsAPI.update(id, updates);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to update Building");
    } catch (error) {
      console.error("Error updating Building:", error);
      throw error;
    }
  };

  const addBuilding = async (newBuilding) => {
    try {
      const response = await buildingsAPI.create(newBuilding);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to create Building");
    } catch (error) {
      console.error("Error creating Building:", error);
      throw error;
    }
  };

  const deleteBuilding = async (id) => {
    try {
      const response = await buildingsAPI.delete(id);
      if (response.success) {
        setRefreshKey((prev) => prev + 1);
        return response;
      }
      throw new Error(response.message || "Failed to delete Building");
    } catch (error) {
      console.error("Error deleting Building:", error);
      throw error;
    }
  };

  const updateBlock = (id, updates) => {
    setData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const addBlock = (newBlock) => {
    setData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { ...newBlock, id: prev.blocks.length + 1 }],
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const deleteBlock = (id) => {
    setData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((item) => item.id !== id),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const updateProperty = (id, updates) => {
    setData((prev) => ({
      ...prev,
      properties: prev.properties.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const addProperty = (newProperty) => {
    setData((prev) => ({
      ...prev,
      properties: [...prev.properties, { ...newProperty, id: prev.properties.length + 1 }],
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const deleteProperty = (id) => {
    setData((prev) => ({
      ...prev,
      properties: prev.properties.filter((item) => item.id !== id),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const updateResident = (id, updates) => {
    setData((prev) => ({
      ...prev,
      residents: prev.residents.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const addResident = (newResident) => {
    setData((prev) => ({
      ...prev,
      residents: [...prev.residents, { ...newResident, id: prev.residents.length + 1 }],
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const deleteResident = (id) => {
    setData((prev) => ({
      ...prev,
      residents: prev.residents.filter((item) => item.id !== id),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const updateApartmentGroup = (id, updates) => {
    setData((prev) => ({
      ...prev,
      apartmentGroups: prev.apartmentGroups.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const addApartmentGroup = (newGroup) => {
    setData((prev) => ({
      ...prev,
      apartmentGroups: [...prev.apartmentGroups, { ...newGroup, id: prev.apartmentGroups.length + 1 }],
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const deleteApartmentGroup = (id) => {
    setData((prev) => ({
      ...prev,
      apartmentGroups: prev.apartmentGroups.filter((item) => item.id !== id),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const updateBuildingServiceFee = (id, updates) => {
    setData((prev) => ({
      ...prev,
      buildingServiceFees: prev.buildingServiceFees.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const addBuildingServiceFee = (newFee) => {
    setData((prev) => ({
      ...prev,
      buildingServiceFees: [...prev.buildingServiceFees, { ...newFee, id: prev.buildingServiceFees.length + 1 }],
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const deleteBuildingServiceFee = (id) => {
    setData((prev) => ({
      ...prev,
      buildingServiceFees: prev.buildingServiceFees.filter((item) => item.id !== id),
    }));
    setRefreshKey((prev) => prev + 1);
  };

  const value = useMemo(
    () => ({
      data,
      refreshKey,
      // MTK
      updateMtk,
      addMtk,
      deleteMtk,
      // Complex
      updateComplex,
      addComplex,
      deleteComplex,
      // Building
      updateBuilding,
      addBuilding,
      deleteBuilding,
      // Block
      updateBlock,
      addBlock,
      deleteBlock,
      // Property
      updateProperty,
      addProperty,
      deleteProperty,
      // Resident
      updateResident,
      addResident,
      deleteResident,
      // Apartment Group
      updateApartmentGroup,
      addApartmentGroup,
      deleteApartmentGroup,
      // Building Service Fee
      updateBuildingServiceFee,
      addBuildingServiceFee,
      deleteBuildingServiceFee,
    }),
    [data, refreshKey]
  );

  return <ManagementContext.Provider value={value}>{children}</ManagementContext.Provider>;
}

export function useManagement() {
  const context = useContext(ManagementContext);
  if (!context) {
    throw new Error("useManagement must be used within ManagementProvider");
  }
  return context;
}

