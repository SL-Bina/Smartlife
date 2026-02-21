import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/services/api';

const TOKEN_COOKIE_NAME = 'smartlife_token';
const IS_RESIDENT_COOKIE_NAME = 'smartlife_is_resident';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const normalizeUserData = (data, isResident = false) => {
  const userDataObj = data.user_data || {};
  return {
    id: userDataObj.id,
    name: userDataObj.name,
    username: userDataObj.username,
    email: userDataObj.email,
    phone: userDataObj.phone,
    gender: userDataObj.gender,
    status: userDataObj.status,
    profile_photo: userDataObj.profile_photo,
    birthday: userDataObj.birthday,
    personal_code: userDataObj.personal_code,
    address: userDataObj.address,
    is_user: userDataObj.is_user,
    is_resident: isResident,
    role: data.role ? {
      id: data.role.id,
      name: data.role.name,
    } : null,
    modules: data.modules || [],
    role_access_modules: data.role_access_modules || [],
    devices: data.devices,
    other_devices: data.other_devices,
    active_device: data.active_device,
    fullName: userDataObj.name,
    firstName: userDataObj.name?.split(' ')[0] || userDataObj.name,
    lastName: userDataObj.name?.split(' ').slice(1).join(' ') || '',
  };
};

const normalizeResidentData = (data) => {
  const fullName = data.surname ? `${data.name} ${data.surname}` : data.name;
  return {
    id: data.id,
    name: fullName,
    username: data.email || data.phone || null,
    email: data.email,
    phone: data.phone,
    gender: data.meta?.gender || null,
    status: "active",
    profile_photo: null,
    birthday: data.meta?.birth_date || null,
    personal_code: data.meta?.personal_code || null,
    address: null,
    is_user: null,
    is_resident: true,
    role: {
      id: null,
      name: "resident",
    },
    modules: [],
    role_access_modules: [],
    devices: null,
    other_devices: null,
    active_device: null,
    fullName: fullName,
    firstName: data.name || '',
    lastName: data.surname || '',
    properties: data.properties || [],
  };
};

export const initializeUser = createAsyncThunk(
  'auth/initializeUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie(TOKEN_COOKIE_NAME);
      if (!token) {
        return { user: null, error: null };
      }

      const isResidentCookie = getCookie(IS_RESIDENT_COOKIE_NAME);
      const callResidentOnly = isResidentCookie === 'true';
      const callMeOnly = isResidentCookie === 'false';

      if (callResidentOnly) {
        try {
          const residentMeResponse = await authAPI.residentMe();
          if (residentMeResponse.success && residentMeResponse.data) {
            return { user: normalizeResidentData(residentMeResponse.data), error: null };
          }
        } catch (residentError) {
          if (residentError?.response?.status === 401) {
            removeCookie(TOKEN_COOKIE_NAME);
            removeCookie(IS_RESIDENT_COOKIE_NAME);
          }
          return { user: null, error: residentError?.response?.data?.message || residentError?.message || 'Unauthorized' };
        }
        removeCookie(TOKEN_COOKIE_NAME);
        removeCookie(IS_RESIDENT_COOKIE_NAME);
        return { user: null, error: null };
      }

      if (callMeOnly || !callResidentOnly) {
        try {
          const meResponse = await authAPI.me();
          if (meResponse.success && meResponse.data) {
            const isResident = meResponse.data.is_resident === true || meResponse.data.user_data?.is_resident === true;
            return { user: normalizeUserData(meResponse.data, isResident), error: null };
          }
        } catch (meError) {
          if (meError?.response?.status === 401 && !callMeOnly) {
            removeCookie(TOKEN_COOKIE_NAME);
            removeCookie(IS_RESIDENT_COOKIE_NAME);
          }
          const errorMessage = meError?.response?.data?.message || meError?.message || 'Failed to load user';
          if (callMeOnly) {
            removeCookie(TOKEN_COOKIE_NAME);
            return { user: null, error: errorMessage };
          }
        }
      }

      const errorMessage = 'Failed to initialize user';
      removeCookie(TOKEN_COOKIE_NAME);
      removeCookie(IS_RESIDENT_COOKIE_NAME);
      return { user: null, error: errorMessage };
    } catch (error) {
      console.error('Failed to initialize user:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initialize user';
      removeCookie(TOKEN_COOKIE_NAME);
      removeCookie(IS_RESIDENT_COOKIE_NAME);
      return { user: null, error: errorMessage };
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const loginResponse = await authAPI.login(email, password);
      
      if (loginResponse.token && loginResponse.user) {
        const { token } = loginResponse;
        setCookie(TOKEN_COOKIE_NAME, token, 7);
        const isResidentFromLogin = loginResponse.is_resident === true;
        setCookie(IS_RESIDENT_COOKIE_NAME, isResidentFromLogin ? 'true' : 'false', 7);

        if (isResidentFromLogin) {
          const loginUser = loginResponse.user || {};
          
          try {
            const residentMeResponse = await authAPI.residentMe();
            if (residentMeResponse && residentMeResponse.success && residentMeResponse.data) {
              return { user: normalizeResidentData(residentMeResponse.data) };
            }
          } catch (residentMeError) {
            console.error('Failed to fetch resident details from /module/resident/config/me:', residentMeError);
            const residentData = {
              id: loginUser.id,
              name: loginUser.name || '',
              surname: null,
              email: loginUser.email || '',
              phone: loginUser.phone || '',
              meta: {
                gender: null,
                birth_date: null,
                personal_code: null,
              },
              properties: loginUser.properties || [],
            };
            return { user: normalizeResidentData(residentData) };
          }
          
          const residentData = {
            id: loginUser.id,
            name: loginUser.name || '',
            surname: null,
            email: loginUser.email || '',
            phone: loginUser.phone || '',
            meta: {
              gender: null,
              birth_date: null,
              personal_code: null,
            },
            properties: loginUser.properties || [],
          };
          return { user: normalizeResidentData(residentData) };
        }

        let role = null;
        let modules = [];
        let devices = null;
        let other_devices = null;
        let active_device = null;
        let userDataObj = null;
        let isResident = isResidentFromLogin;
        let role_access_modules = [];
        try {
          const meResponse = await authAPI.me();
          if (meResponse && meResponse.success && meResponse.data) {
            const data = meResponse.data;
            userDataObj = data.user_data || null;
            role = data.role;
            modules = data.modules || [];
            role_access_modules = data.role_access_modules || [];
            devices = data.devices;
            other_devices = data.other_devices;
            active_device = data.active_device;
            if (data.is_resident !== undefined) {
              isResident = data.is_resident === true;
            } else if (data.user_data?.is_resident !== undefined) {
              isResident = data.user_data.is_resident === true;
            }
          }
        } catch (meError) {
          console.error('Failed to fetch user details from /user/me:', meError);
        }
        
        const finalUser = userDataObj && userDataObj.id ? userDataObj : loginResponse.user;
        if (!role && loginResponse.user?.role) {
          role = loginResponse.user.role;
        }
        if (!modules.length && loginResponse.user?.modules) {
          modules = loginResponse.user.modules;
        }
        
        const userData = normalizeUserData({
          user_data: finalUser,
          role: role || null,
          modules: modules || [],
          role_access_modules: role_access_modules || [],
          devices: devices || null,
          other_devices: other_devices || null,
          active_device: active_device || null,
        }, isResident);

        return { user: userData };
      } else {
        return rejectWithValue(loginResponse.message || 'Login failed');
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getCookie(TOKEN_COOKIE_NAME);
      if (!token) {
        return { user: null };
      }

      const state = getState();
      const currentUser = state?.auth?.user;
      const isResident = currentUser?.is_resident === true;
      if (isResident) {
        try {
          const residentMeResponse = await authAPI.residentMe();
          if (residentMeResponse.success && residentMeResponse.data) {
            return { 
              user: normalizeResidentData(residentMeResponse.data)
            };
          } else {
            removeCookie(TOKEN_COOKIE_NAME);
            return { user: null };
          }
        } catch (residentError) {
          console.error('Failed to refresh resident user data:', residentError);
          if (residentError.response?.status === 401) {
            removeCookie(TOKEN_COOKIE_NAME);
          }
          return rejectWithValue(residentError.message);
        }
      }

      try {
        const meResponse = await authAPI.me();
        if (meResponse.success && meResponse.data) {
          const data = meResponse.data;
          const isResidentFromResponse = data.is_resident === true || data.user_data?.is_resident === true;
          return { 
            user: normalizeUserData({
              user_data: data.user_data,
              role: data.role,
              modules: data.modules || [],
              role_access_modules: data.role_access_modules || [],
              devices: data.devices,
              other_devices: data.other_devices,
              active_device: data.active_device,
            }, isResidentFromResponse)
          };
        } else {
          removeCookie(TOKEN_COOKIE_NAME);
          return { user: null };
        }
      } catch (meError) {
        console.error('Failed to refresh user data:', meError);
        if (meError.response?.status === 401) {
          removeCookie(TOKEN_COOKIE_NAME);
        }
        return rejectWithValue(meError.message);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      if (error.response?.status === 401) {
        removeCookie(TOKEN_COOKIE_NAME);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeCookie(TOKEN_COOKIE_NAME);
      removeCookie(IS_RESIDENT_COOKIE_NAME);
      if (window.location.pathname !== '/auth/sign-in') {
        window.location.href = '/auth/sign-in';
      }
    }
    return { user: null };
  }
);

const initialState = {
  user: null,
  loading: false,
  isInitialized: false,
  isInitializing: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      removeCookie(TOKEN_COOKIE_NAME);
      removeCookie(IS_RESIDENT_COOKIE_NAME);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUser.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isInitialized = true;
        state.isInitializing = false;
      })
      .addCase(initializeUser.rejected, (state) => {
        state.user = null;
        state.isInitialized = true;
        state.isInitializing = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(refreshUser.rejected, (state) => {
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isInitialized = false;
      });
  },
});

export const { clearUser, clearError } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectIsInitializing = (state) => state.auth.isInitializing;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;


