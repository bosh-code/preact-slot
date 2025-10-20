import preactPlugin from '@preact/preset-vite';
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [preactPlugin()],
  test: {
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './coverage',
      thresholds: {
        perFile: true,
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      },
      reporter: ['lcov', 'json', 'text-summary', 'html'],
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
