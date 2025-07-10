import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import tailwindcss from "@tailwindcss/vite"
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), libInjectCss(), dts({
    rollupTypes: true,
    tsconfigPath: "./tsconfig.lib.json",
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'], 
      input: Object.fromEntries(
        glob.sync('src/**/*.{ts,tsx}', {
              ignore: ["src/**/*.d.ts"],
        }).map(file => [
        // The name of the entry point
            // lib/nested/foo.ts becomes nested/foo
                relative(
                'src',
                      file.slice(0, file.length - extname(file).length)
                ),
        // The absolute path to the entry file
        // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    },
  }
})
