import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const API_TARGET = 'http://localhost:1337';

// The React source lives in browser/, with index.html as the entry. Vite
// emits the hashed JS/CSS bundle and index.html into public/, which Express
// serves statically. publicDir is disabled because the loose assets in
// browser/ (juke.svg, default-album.jpg) are requested at runtime and served
// directly by Express from browser/, so they should not be copied.
export default defineConfig({
  root: 'browser',
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: '../public',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': API_TARGET,
      '/bootstrap': API_TARGET,
      '/bootstrap-icons': API_TARGET,
      '/favicon.ico': API_TARGET,
    },
  },
});
