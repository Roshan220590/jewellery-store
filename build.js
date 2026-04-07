#!/usr/bin/env node

// Simple build script that doesn't rely on vite executable
import { build } from 'vite';

const config = {
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
};

build(config).catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
