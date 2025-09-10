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
      // Test-only stub for DOMPurify to avoid installing the package during unit tests
      'dompurify': resolve(__dirname, './test-stubs/dompurify.ts'),
    },
  },
})
