import preactPlugin from '@preact/preset-vite';
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [preactPlugin()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './test-setup.ts',
  },
})
