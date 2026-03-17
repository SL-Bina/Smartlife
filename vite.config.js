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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — always first to load
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/") || id.includes("node_modules/scheduler/")) {
            return "react-core";
          }
          // Redux
          if (id.includes("node_modules/@reduxjs/") || id.includes("node_modules/react-redux/") || id.includes("node_modules/redux/") || id.includes("node_modules/immer/")) {
            return "redux";
          }
          // Charts — çox ağır (~800kb), yalnız chart olan səhifələrdə lazımdır
          if (id.includes("node_modules/apexcharts") || id.includes("node_modules/react-apexcharts")) {
            return "charts";
          }
          // Animations
          if (id.includes("node_modules/framer-motion")) {
            return "animations";
          }
          // Maps — ən ağır kitabxanalardan biri
          if (id.includes("node_modules/maplibre-gl") || id.includes("node_modules/react-map-gl")) {
            return "maps";
          }
          // Leaflet
          if (id.includes("node_modules/leaflet") || id.includes("node_modules/react-leaflet")) {
            return "leaflet";
          }
          // Lottie animations
          if (id.includes("node_modules/lottie-react") || id.includes("node_modules/@lottiefiles")) {
            return "lottie";
          }
          // UI components
          if (id.includes("node_modules/@material-tailwind") || id.includes("node_modules/@radix-ui")) {
            return "ui-lib";
          }
          // i18n
          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) {
            return "i18n";
          }
          // Remaining node_modules → vendor chunk
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
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
