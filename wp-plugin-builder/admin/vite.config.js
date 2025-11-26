import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite config tuned for embedding monaco-editor (no external plugin).
// Forces single manual chunk so Monaco doesn't get split across many files.

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "monaco-editor": path.resolve(__dirname, "node_modules/monaco-editor"),
    },
    extensions: [".js", ".jsx", ".json"],
  },

  root: path.resolve(__dirname),
  base: "./",

  build: {
    outDir: path.resolve(__dirname, "build"),
    emptyOutDir: true,
    sourcemap: false,

    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "admin.js",
        assetFileNames: (asset) => {
          if (asset.name && asset.name.endsWith(".css")) {
            return "admin.css";
          }
          return "[name].[ext]";
        },
        // Force single chunk to avoid monaco splitting
        manualChunks: () => "bundle.js",
      },
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    open: false,
    hmr: {
      host: "localhost",
    },
  },
});
