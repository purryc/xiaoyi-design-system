import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react({ jsxImportSource: "@xiaoyi/i18n" })],
  resolve: {
    alias: {
      "@xiaoyi/i18n": fileURLToPath(new URL("./src/i18n", import.meta.url)),
    },
  },
  server: { strictPort: true },
  build: { outDir: "dist" },
});
