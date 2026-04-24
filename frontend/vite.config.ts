import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const nextAdmin = "http://127.0.0.1:3000";
const expressApi = "http://127.0.0.1:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Next.js Admin (same origin as Vite:5173). Keep Next running on :3000.
      "/admin": {
        target: nextAdmin,
        changeOrigin: false,
        ws: true
      },
      "/_next": {
        target: nextAdmin,
        changeOrigin: false,
        ws: true
      },
      // Next.js devtools / stack frames (Turbopack)
      "/__nextjs": {
        target: nextAdmin,
        changeOrigin: false,
        ws: true
      },
      // Admin Portal APIs on Next (order: most specific before /api → Express)
      "/api/public/services": {
        target: nextAdmin,
        changeOrigin: false
      },
      "/api/public/reviews": {
        target: nextAdmin,
        changeOrigin: false
      },
      "/api/public/website-assets": {
        target: nextAdmin,
        changeOrigin: false
      },
      "/api/public/site-content": {
        target: nextAdmin,
        changeOrigin: false
      },
      "/api/admin": {
        target: nextAdmin,
        changeOrigin: false
      },
      "/api": {
        target: expressApi,
        changeOrigin: true
      },
      "/health": {
        target: expressApi,
        changeOrigin: true
      }
    }
  }
});

