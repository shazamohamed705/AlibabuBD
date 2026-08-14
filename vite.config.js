import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/uploads': {
        target: 'https://aurevia-brand.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
  },
});