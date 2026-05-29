import { fileURLToPath } from 'node:url';

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src")
    }
  },
  optimizeDeps: {
    include: ['@microsoft/fetch-event-source']
  },
  build: {
    chunkSizeWarningLimit: 800,
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
});