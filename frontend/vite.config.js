import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001", // The target server for API requests
        changeOrigin: true, // Needed for virtual hosted sites
      },
    },
  },
  plugins: [react()],
});
