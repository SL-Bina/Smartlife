import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "react-map-gl/maplibre": path.resolve(__dirname, "node_modules/react-map-gl/dist/esm/exports-maplibre.js"),
    },
  },
  optimizeDeps: {
    include: ["axios"],
  },
  build: {
    commonjsOptions: {
      include: [/axios/, /node_modules/],
    },
    // Chunk size warning threshold (kb)
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3157,
    open: true,
    host: true,
    proxy: {
      // forward API requests to backend to avoid CORS during development
      "/api": {
        target: "https://api.smartlife.az",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
});
