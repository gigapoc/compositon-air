import { defineConfig } from 'vite';

/** GitHub Pages project sites need `/repo-name/` ; Vercel/Netlify use `/`. */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
});
