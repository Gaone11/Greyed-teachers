import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
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
  plugins: [react(), skipProblematicFiles()],
  root: process.cwd(),
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-motion': ['framer-motion'],
          'vendor-tiptap': [
            '@tiptap/react',
            '@tiptap/extension-bold',
            '@tiptap/extension-bullet-list',
            '@tiptap/extension-document',
            '@tiptap/extension-heading',
            '@tiptap/extension-highlight',
            '@tiptap/extension-image',
            '@tiptap/extension-italic',
            '@tiptap/extension-link',
            '@tiptap/extension-list-item',
            '@tiptap/extension-ordered-list',
            '@tiptap/extension-paragraph',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-text',
            '@tiptap/extension-underline',
          ],
          'vendor-charts': ['recharts'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/modifiers', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
    copyPublicDir: true,
  },
});
