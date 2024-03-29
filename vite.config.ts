import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src/') },
  },
  build: {
    outDir: 'rtsp',
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1/',
      '/ws': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
