import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command, mode }) => {
  // During build / production, set base to '/picmorable/' matching the GitHub repository name.
  // This guarantees that all assets are loaded from https://clueanalytics7.github.io/picmorable/assets/...
  // rather than failing at the root https://clueanalytics7.github.io/assets/...
  const isProd = mode === 'production' || command === 'build' || process.env.NODE_ENV === 'production';
  const base = isProd ? '/picmorable/' : '/';

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
