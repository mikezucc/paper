import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    ssr: true,
    outDir: 'dist-ssr',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/entry-server.tsx'),
      output: {
        format: 'cjs',
      },
    },
  },
  ssr: {
    external: ['react', 'react-dom', 'react-router-dom'],
    noExternal: [/@paper\/shared/],
  },
})