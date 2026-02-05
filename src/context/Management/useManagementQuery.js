import { useEffect, useMemo, useState, useCallback } from "react";
import { useManagement } from "./ManagementProvider";

export function useManagementQuery(key, options = {}) {
  const { cache, fetchOnce } = useManagement();
  const entry = cache[key];

  const [localError, setLocalError] = useState(null);

  const loading = entry?.status === "loading";
  const data = entry?.data ?? null;
  const error = entry?.error || localError;

  const run = useCallback(
    async (opts = {}) => {
      setLocalError(null);
      try {
        return await fetchOnce(key, { ...options, ...opts });
      } catch (e) {
        setLocalError(e);
        throw e;
      }
    },
    [key, fetchOnce, options]
  );

  useEffect(() => {
    run().catch(() => {});
  }, [key]);

  const refetch = useCallback(() => run({ force: true }), [run]);

  return useMemo(() => ({ data, loading, error, refetch }), [data, loading, error, refetch]);
}
