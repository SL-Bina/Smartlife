import axios from "axios";

const TOKEN_COOKIE_NAME = "smartlife_token";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", 
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getCookie(TOKEN_COOKIE_NAME);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  }
);
