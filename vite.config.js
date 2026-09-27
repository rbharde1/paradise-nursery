import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages under /<repo-name>/
  // without hard-coding the repository name.
  base: './',
});
