import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/services/api';

const TOKEN_COOKIE_NAME = 'smartlife_token';

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

const normalizeUserData = (data) => {
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

export const initializeUser = createAsyncThunk(
  'auth/initializeUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie(TOKEN_COOKIE_NAME);
      if (!token) {
        return { user: null, error: null };
      }

      const meResponse = await authAPI.me();
      if (meResponse.success && meResponse.data) {
        return { user: normalizeUserData(meResponse.data), error: null };
      } else {
        const errorMsg = meResponse.message || 'Failed to load user data';
        removeCookie(TOKEN_COOKIE_NAME);
        return { user: null, error: errorMsg };
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
      // Return error message instead of rejecting
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initialize user';
      removeCookie(TOKEN_COOKIE_NAME);
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

        let role = null;
        let modules = [];
        let devices = null;
        let other_devices = null;
        let active_device = null;
        let userDataObj = null;
        
        let role_access_modules = [];
        
        // Try to get full user data from /user/me endpoint
        // If it fails, use the basic user data from login response
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
          }
        } catch (meError) {
          console.error('Failed to fetch user details from /user/me:', meError);
          // If me() fails, we'll use loginResponse.user as fallback
          // This ensures login still works even if /user/me fails
        }
        
        // Use me() data if available, otherwise fallback to login response
        const finalUser = userDataObj && userDataObj.id ? userDataObj : loginResponse.user;
        
        // If we don't have role/modules from me(), try to construct from loginResponse if available
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
        });

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
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie(TOKEN_COOKIE_NAME);
      if (!token) {
        return { user: null };
      }

      const meResponse = await authAPI.me();
      if (meResponse.success && meResponse.data) {
        const data = meResponse.data;
        return { 
          user: normalizeUserData({
            user_data: data.user_data,
            role: data.role,
            modules: data.modules || [],
            role_access_modules: data.role_access_modules || [],
            devices: data.devices,
            other_devices: data.other_devices,
            active_device: data.active_device,
          })
        };
      } else {
        removeCookie(TOKEN_COOKIE_NAME);
        return { user: null };
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      if (error.response?.status === 401) {
        removeCookie(TOKEN_COOKIE_NAME);
      }
      // Don't reject on refresh errors - just return current user
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
        // Don't clear user on refresh error - keep current user
        // This prevents logout on network errors
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isInitialized = false;
      });
  },
});

export const { clearUser, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectIsInitializing = (state) => state.auth.isInitializing;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;


