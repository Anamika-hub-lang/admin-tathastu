import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const webRoot = __dirname;
  const repoRoot = path.resolve(webRoot, '..');
  const isExpoMonorepo = fs.existsSync(path.join(repoRoot, 'app.json'));
  const envRoot = isExpoMonorepo ? repoRoot : webRoot;
  loadEnv(mode, envRoot, '');
  loadEnv(mode, webRoot, '');

  return {
    plugins: [react()],
    envDir: envRoot,
    envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
    server: {
      port: 5173,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
