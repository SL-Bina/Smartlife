import React, { createContext, useContext, useMemo, useReducer, useCallback, useRef } from "react";
import { createInitialState, reducer, actions, isFresh } from "./managementStore";
import { registry } from "./managementApiRegistry";

const ManagementContext = createContext(null);

const DEFAULT_TTL = 5 * 60 * 1000;

export function ManagementProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const inFlight = useRef(new Map());

  const fetchOnce = useCallback(
    async (key, options = {}) => {
      const {
        ttl = DEFAULT_TTL,
        force = false,
        params = undefined, // query param
      } = options;

      const fetcher = registry[key];
      if (!fetcher) {
        throw new Error(`Management registry-də fetcher tapılmadı: ${key}`);
      }

      const entry = state.cache[key];
      if (!force && entry?.status === "success" && isFresh(entry, ttl)) {
        return entry.data;
      }

      if (inFlight.current.has(key)) return inFlight.current.get(key);

      dispatch(actions.start(key));

      const p = (async () => {
        try {
          const data = await fetcher({ params });
          dispatch(actions.success(key, data));
          return data;
        } catch (e) {
          dispatch(actions.error(key, e));
          throw e;
        } finally {
          inFlight.current.delete(key);
        }
      })();

      inFlight.current.set(key, p);
      return p;
    },
    [state.cache]
  );

  const invalidate = useCallback((keys) => dispatch(actions.invalidate(keys)), []);
  const mutate = useCallback((key, updater) => dispatch(actions.mutate(key, updater)), []);

  const value = useMemo(
    () => ({
      cache: state.cache,
      fetchOnce,
      invalidate,
      mutate,
    }),
    [state.cache, fetchOnce, invalidate, mutate]
  );

  return <ManagementContext.Provider value={value}>{children}</ManagementContext.Provider>;
}

export function useManagement() {
  const ctx = useContext(ManagementContext);
  if (!ctx) throw new Error("useManagement must be used within ManagementProvider");
  return ctx;
}
