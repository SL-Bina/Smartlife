import React, { createContext, useContext, useMemo, useReducer } from "react";

const ManagementContext = createContext(null);

const initialState = {
  mtkId: null,
  mtk: null,

  complexId: null,
  complex: null,

  buildingId: null,
  building: null,

  blockId: null,
  block: null,

  propertyId: null,
  property: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "RESET_ALL":
      return { ...initialState };

    case "SET_MTK": {
      const { id, data } = action.payload || {};
      return {
        ...state,
        mtkId: id ?? null,
        mtk: data ?? null,
        complexId: null,
        complex: null,
        buildingId: null,
        building: null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_COMPLEX": {
      const { id, data } = action.payload || {};
      return {
        ...state,
        complexId: id ?? null,
        complex: data ?? null,
        buildingId: null,
        building: null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_BUILDING": {
      const { id, data } = action.payload || {};
      return {
        ...state,
        buildingId: id ?? null,
        building: data ?? null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_BLOCK": {
      const { id, data } = action.payload || {};
      return {
        ...state,
        blockId: id ?? null,
        block: data ?? null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_PROPERTY": {
      const { id, data } = action.payload || {};
      return {
        ...state,
        propertyId: id ?? null,
        property: data ?? null,
      };
    }

    default:
      return state;
  }
}

export function ManagementProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      resetAll: () => dispatch({ type: "RESET_ALL" }),

      setMtk: (id, data = null) => dispatch({ type: "SET_MTK", payload: { id, data } }),
      setComplex: (id, data = null) => dispatch({ type: "SET_COMPLEX", payload: { id, data } }),
      setBuilding: (id, data = null) => dispatch({ type: "SET_BUILDING", payload: { id, data } }),
      setBlock: (id, data = null) => dispatch({ type: "SET_BLOCK", payload: { id, data } }),
      setProperty: (id, data = null) => dispatch({ type: "SET_PROPERTY", payload: { id, data } }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <ManagementContext.Provider value={value}>{children}</ManagementContext.Provider>;
}

export function useManagement() {
  const ctx = useContext(ManagementContext);
  if (!ctx) throw new Error("useManagement must be used within <ManagementProvider />");
  return ctx;
}
