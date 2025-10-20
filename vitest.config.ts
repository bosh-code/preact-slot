import preactPlugin from '@preact/preset-vite';
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [preactPlugin()],
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      thresholds: {
        perFile: true,
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      },
      reporter: [
        'text',
        'json-summary',
        'html-spa',
        'lcov'
      ],
      all: true,
      include: [
        'src/**/*.tsx'
      ],
      exclude: [
        'src/**/index.ts'
      ]
    },
    environment: 'happy-dom',
    globals: true,
    setupFiles: './test-setup.ts',
  },
})
