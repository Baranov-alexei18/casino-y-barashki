import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": resolve(__dirname, "./src/app"),
      "@assets": resolve(__dirname, "./src/assets"),
      "@features": resolve(__dirname, "./src/features"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@processes": resolve(__dirname, "./src/processes"),
      "@shared": resolve(__dirname, "./src/shared"),
    },
  },
});
