// @ts-check
import { defineConfig } from 'astro/config';

// No GitHub Pages o site fica em https://victorhmrod.github.io/axis-zero/.
// Localmente (npm run dev) continua na raiz.
const onPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://victorhmrod.github.io',
  base: onPages ? '/axis-zero' : '/',
});
