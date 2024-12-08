import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        // target: "https://movie-app-final-zeta.vercel.app/",
        target: "http://localhost:3001/",
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "/index.html",
    },
  },
});
