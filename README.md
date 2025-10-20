# @bosh-code/preact-slot

[![Coverage Status](https://coveralls.io/repos/github/bosh-code/preact-slot/badge.svg)](https://coveralls.io/github/bosh-code/preact-slot)
[![Release](https://github.com/bosh-code/preact-slot/actions/workflows/release.yml/badge.svg)](https://github.com/bosh-code/preact-slot/actions/workflows/release.yml)
[![Unit Test](https://github.com/bosh-code/preact-slot/actions/workflows/unit-test.yml/badge.svg?branch=main)](https://github.com/bosh-code/preact-slot/actions/workflows/unit-test.yml)
[![NPM Version](https://img.shields.io/npm/v/%40bosh-code%2Fpreact-slot)](https://www.npmjs.com/package/@bosh-code/preact-slot)


A Preact implementation of the [@radix-ui/react-slot](https://www.radix-ui.com/primitives) component meant for use
with [shadcn/ui](https://ui.shadcn.com) component library. This component exposes the same API as the Radix UI Slot,
and should be a drop-in replacement when building Preact component libraries using shadcn/ui components.

## Installation

Install the package

```bash
pnpm add --save-peer @bosh-code/preact-slot
```

## Usage

I recommend setting up a path alias for `@radix-ui/react-slot` to point to this package, so that no changes are made to
any shadcn/ui components that you may be using in your library.

```json5
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "paths": {
      "@radix-ui/react-slot": [
        "./node_modules/@bosh-code/preact-slot"
      ]
    }
  }
}
```

## Development

- Install dependencies:

```bash
pnpm install
```

- Run the playground:

```bash
pnpm playground
```

- Build the library:

```bash
pnpm build
```

- Build in watch mode:

```bash
pnpm dev
```

- Run the unit tests:

```bash
pnpm test
```
