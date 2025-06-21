
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";

export default defineConfig({
  plugins: [react(), themePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    open: false,
    hmr: {
      port: 5173,
      host: "0.0.0.0"
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  optimizeDeps: {
    force: true,
  },
  clearScreen: false,
});
