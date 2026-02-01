import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly define the root directory
  root: process.cwd(),
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});