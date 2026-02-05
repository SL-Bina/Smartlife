export const createInitialState = () => ({
  cache: {},
});

export const STATUS = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
};

export const makeEntry = (partial) => ({
  data: null,
  status: STATUS.idle,
  error: null,
  fetchedAt: 0,
  ...partial,
});

export const isFresh = (entry, ttlMs) => {
  if (!entry?.fetchedAt) return false;
  return Date.now() - entry.fetchedAt < ttlMs;
};

export const actions = {
  start: (key) => ({ type: "START", key }),
  success: (key, data) => ({ type: "SUCCESS", key, data }),
  error: (key, error) => ({ type: "ERROR", key, error }),
  invalidate: (keys) => ({ type: "INVALIDATE", keys }),
  mutate: (key, updater) => ({ type: "MUTATE", key, updater }),
  reset: () => ({ type: "RESET" }),
};

export function reducer(state, action) {
  switch (action.type) {
    case "START": {
      const prev = state.cache[action.key] || makeEntry({});
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.key]: makeEntry({ ...prev, status: STATUS.loading, error: null }),
        },
      };
    }
    case "SUCCESS": {
      const prev = state.cache[action.key] || makeEntry({});
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.key]: makeEntry({
            ...prev,
            status: STATUS.success,
            error: null,
            data: action.data,
            fetchedAt: Date.now(),
          }),
        },
      };
    }
    case "ERROR": {
      const prev = state.cache[action.key] || makeEntry({});
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.key]: makeEntry({
            ...prev,
            status: STATUS.error,
            error: action.error,
          }),
        },
      };
    }
    case "INVALIDATE": {
      const keys = action.keys || [];
      const next = { ...state.cache };
      keys.forEach((k) => {
        delete next[k];
      });
      return { ...state, cache: next };
    }
    case "MUTATE": {
      const prev = state.cache[action.key] || makeEntry({});
      const nextData = action.updater?.(prev.data);
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.key]: makeEntry({
            ...prev,
            data: nextData,
            fetchedAt: Date.now(),
            status: STATUS.success,
          }),
        },
      };
    }
    case "RESET":
      return createInitialState();
    default:
      return state;
  }
}
