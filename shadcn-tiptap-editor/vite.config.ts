import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from "@tailwindcss/vite"
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({
    rollupTypes: true,
    tsconfigPath: "./tsconfig.lib.json",
  })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
    },
  }
})
