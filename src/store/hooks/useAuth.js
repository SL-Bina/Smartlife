import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectIsInitialized,
  selectIsInitializing,
  selectAuthError,
} from '../slices/authSlice';
import {
  initializeUser,
  loginUser,
  logoutUser,
  refreshUser,
  clearError,
} from '../slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isInitializing = useAppSelector(selectIsInitializing);
  const error = useAppSelector(selectAuthError);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      return { success: true, user: result.payload.user };
    } else {
      return { success: false, message: result.payload || 'Login failed' };
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const refresh = async () => {
    await dispatch(refreshUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const hasModuleAccess = (moduleName) => {
    if (!user) return false;
    
    const userRole = user.role?.name?.toLowerCase();
    // Root role has access to all modules
    if (userRole === 'root') {
      return true;
    }
    
    // Check role_access_modules first (more accurate)
    if (user.role_access_modules && Array.isArray(user.role_access_modules) && user.role_access_modules.length > 0) {
      const accessModule = user.role_access_modules.find((m) => m.module_name === moduleName);
      if (accessModule && accessModule.permissions && Array.isArray(accessModule.permissions) && accessModule.permissions.length > 0) {
        return true;
      }
    }
    
    // Fallback to modules (for backward compatibility)
    if (!user.modules || !Array.isArray(user.modules) || user.modules.length === 0) {
      return false;
    }
    
    const module = user.modules.find((m) => m.name === moduleName);
    
    if (!module) {
      return false;
    }
    
    if (!module.can || !Array.isArray(module.can) || module.can.length === 0) {
      return false;
    }
    
    return true;
  };

  const hasPermission = (moduleName, permission) => {
    if (!user) return false;
    
    const userRole = user.role?.name?.toLowerCase();
    // Root role has all permissions
    if (userRole === 'root') {
      return true;
    }
    
    // Check role_access_modules first (more accurate)
    if (user.role_access_modules && Array.isArray(user.role_access_modules)) {
      const accessModule = user.role_access_modules.find((m) => m.module_name === moduleName);
      if (accessModule && accessModule.permissions && Array.isArray(accessModule.permissions)) {
        return accessModule.permissions.some((p) => p.permission === permission);
      }
    }
    
    // Fallback to modules (for backward compatibility)
    if (!user.modules || !Array.isArray(user.modules)) return false;
    
    const module = user.modules.find((m) => m.name === moduleName);
    return module && module.can && Array.isArray(module.can) && module.can.includes(permission);
  };

  return {
    user,
    login,
    logout,
    loading,
    error,
    hasModuleAccess,
    hasPermission,
    isAuthenticated,
    isInitialized,
    isInitializing,
    refreshUser: refresh,
    clearError: clearAuthError,
  };
}


