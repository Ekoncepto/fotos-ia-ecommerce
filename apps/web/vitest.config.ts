<<<<<<< HEAD
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    envFile: './.env.test',
    exclude: ['**/tests/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})
=======
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ['**/tests/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})
>>>>>>> 9e466f3d7476069901dfe29828d632025ecc14b2
