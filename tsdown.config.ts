import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    external: [
      'preact',
      'preact-compat',
    ],
    platform: 'browser',
    target: 'esnext',
    dts: true,
    sourcemap: true,
    tsconfig: './tsconfig.lib.json'
  }
]);
