# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PetDesk is an Electron desktop application built with TypeScript and Vite.

## Commands

```bash
npm start          # Start app in development mode (hot reload via Vite dev server)
npm run package    # Package the app (outputs to out/)
npm run make       # Build distributable installers for all platforms
npm run lint       # Run ESLint on TypeScript files
```

## Architecture

**Electron Multi-Process Model:**

- **Main Process** (`src/main.ts`): Creates BrowserWindow, manages app lifecycle, loads preload script
- **Preload Script** (`src/preload.ts`): Bridge for secure IPC between main and renderer processes
- **Renderer Process** (`src/renderer.ts`): UI logic, runs in browser context without Node.js access

**Build Configuration:**

- `forge.config.ts`: Electron Forge config with Vite plugin and multi-platform makers (Squirrel/Windows, ZIP/macOS, RPM+Deb/Linux)
- `vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer.config.ts`: Vite configs for each process (currently using defaults)

**Security Fuses Enabled:**
- No Node.js in renderer (secure isolation)
- ASAR integrity validation
- Cookie encryption
- CLI inspect arguments disabled

## Development Notes

- DevTools opens automatically in development mode
- Main process entry point compiles to `.vite/build/main.js`
- No test framework currently configured
