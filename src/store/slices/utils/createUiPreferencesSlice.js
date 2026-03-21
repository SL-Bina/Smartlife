import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";

export const getInitialPreferenceValue = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;

  const cookieValue = getCookie(key);
  if (cookieValue !== null) return cookieValue;

  const saved = localStorage.getItem(key);
  if (saved !== null) {
    setCookie(key, saved);
    localStorage.removeItem(key);
    return saved;
  }

  return defaultValue;
};

export const getInitialPreferenceBool = (key, defaultValue = false) => {
  const value = getInitialPreferenceValue(key, String(defaultValue));
  return value === "true";
};

export function createUiPreferencesSlice({ name, initialState, reducersConfig }) {
  const reducers = {};

  Object.entries(reducersConfig).forEach(([actionName, config]) => {
    reducers[actionName] = (state, action) => {
      const value = action.payload;
      state[config.stateKey] = value;

      if (config.persistKey) {
        setCookie(config.persistKey, String(value));
      }

      if (typeof config.onSet === "function") {
        config.onSet({ value, state });
      }
    };
  });

  return createSlice({
    name,
    initialState,
    reducers,
  });
}
