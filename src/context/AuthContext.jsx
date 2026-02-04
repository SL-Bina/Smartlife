import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const TOKEN_COOKIE_NAME = "smartlife_token";

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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (isInitialized || isInitializing) return;
    
    const initializeUser = async () => {
      setIsInitializing(true);
      const token = getCookie(TOKEN_COOKIE_NAME);
      if (token) {
        try {
          const meResponse = await authAPI.me();
          if (meResponse.success && meResponse.data) {
            const data = meResponse.data;
            const userDataObj = data.user_data || {}; 
            const userData = {
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
              devices: data.devices,
              other_devices: data.other_devices,
              active_device: data.active_device,
              fullName: userDataObj.name,
              firstName: userDataObj.name?.split(" ")[0] || userDataObj.name,
              lastName: userDataObj.name?.split(" ").slice(1).join(" ") || "",
            };
            setUser(userData);
            setIsInitialized(true);
          } else {
            removeCookie(TOKEN_COOKIE_NAME);
            setIsInitialized(true);
          }
        } catch (error) {
          console.error("Failed to initialize user:", error);
          removeCookie(TOKEN_COOKIE_NAME);
          setIsInitialized(true);
        } finally {
          setIsInitializing(false);
        }
      } else {
        setIsInitialized(true);
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, []); 

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loginResponse = await authAPI.login(email, password);
      
      if (loginResponse.token && loginResponse.user) {
        const { token, token_type, user } = loginResponse;
        
        setCookie(TOKEN_COOKIE_NAME, token, 7); // 7 gün
        
        let role = null;
        let modules = [];
        let devices = null;
        let other_devices = null;
        let active_device = null;
        let userDataObj = null;
        
        try {
          const meResponse = await authAPI.me();
          
          if (meResponse.success && meResponse.data) {
            const data = meResponse.data;
            userDataObj = data.user_data || null;
            role = data.role;
            modules = data.modules || [];
            devices = data.devices;
            other_devices = data.other_devices;
            active_device = data.active_device;
          }
        } catch (meError) {
          console.error("Failed to fetch user details from /user/me:", meError);
        }
        
        const finalUser = userDataObj && userDataObj.id ? userDataObj : user;
        const userData = {
          id: finalUser.id,
          name: finalUser.name,
          username: finalUser.username,
          email: finalUser.email,
          phone: finalUser.phone,
          gender: finalUser.gender,
          status: finalUser.status,
          profile_photo: finalUser.profile_photo,
          birthday: finalUser.birthday,
          personal_code: finalUser.personal_code,
          address: finalUser.address,
          is_user: finalUser.is_user,
          role: role ? {
            id: role.id,
            name: role.name,
          } : null,
          modules: modules, 
          devices: devices,
          other_devices: other_devices,
          active_device: active_device,
          fullName: finalUser.name,
          firstName: finalUser.name?.split(" ")[0] || finalUser.name,
          lastName: finalUser.name?.split(" ").slice(1).join(" ") || "",
        };
        
        setUser(userData);
        setIsInitialized(true);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: loginResponse.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.errors) {
        const firstError = Object.values(error.errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      removeCookie(TOKEN_COOKIE_NAME);
      setIsInitialized(false);
      if (window.location.pathname !== "/auth/sign-in") {
        window.location.href = "/auth/sign-in";
      }
    }
  };

  const refreshUser = async () => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (!token) return;
    
    try {
      const meResponse = await authAPI.me();
      
      if (meResponse.success && meResponse.data) {
        const data = meResponse.data;
        const userDataObj = data.user_data || {}; 
        const userData = {
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
          devices: data.devices,
          other_devices: data.other_devices,
          active_device: data.active_device,
          fullName: userDataObj.name,
          firstName: userDataObj.name?.split(" ")[0] || userDataObj.name,
          lastName: userDataObj.name?.split(" ").slice(1).join(" ") || "",
        };
        
        setUser(userData);
      } else {
        setUser(null);
        removeCookie(TOKEN_COOKIE_NAME);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      if (error.response?.status === 401) {
        setUser(null);
        removeCookie(TOKEN_COOKIE_NAME);
      }
    }
  };

  const hasModuleAccess = (moduleName) => {
    if (!user) return false;
    
    const userRole = user.role?.name?.toLowerCase();
    if (userRole === "root") {
      return true;
    }
    
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
    if (!user || !user.modules || !Array.isArray(user.modules)) return false;
    
    const module = user.modules.find((m) => m.name === moduleName);
    return module && module.can && Array.isArray(module.can) && module.can.includes(permission);
  };

  const value = { 
    user, 
    login, 
    logout, 
    loading,
    hasModuleAccess,
    hasPermission,
    isAuthenticated: !!user,
    isInitialized, 
    refreshUser, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
