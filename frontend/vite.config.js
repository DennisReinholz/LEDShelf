import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { version } from './package.json';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VERSION': JSON.stringify(version),
  },
});
