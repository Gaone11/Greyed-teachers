import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const skipProblematicFiles = (): Plugin => ({
  name: 'skip-problematic-files',
  configResolved(config) {
    const originalCopyDir = (config as any).publicDir;
    if (originalCopyDir) {
      const problematicFiles = ['Logo PNG copy.png', 'Logo PNG.png'];
      problematicFiles.forEach(file => {
        const filePath = path.join(process.cwd(), 'public', file);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
        }
      });
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Greyed-teachers/' : '/',
  plugins: [react(), skipProblematicFiles()],
  // Explicitly define the root directory
  root: process.cwd(),
  publicDir: 'public',
  server: {
    host: 'localhost',
    port: 5200,
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors *;",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
    copyPublicDir: true,
  },
});