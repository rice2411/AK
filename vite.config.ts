import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.TAIGA_BASE_URL': JSON.stringify(env.TAIGA_BASE_URL),
        'process.env.TAIGA_EMAIL': JSON.stringify(env.TAIGA_EMAIL),
        'process.env.TAIGA_PASSWORD': JSON.stringify(env.TAIGA_PASSWORD)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
