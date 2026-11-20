/**
 * Prefixa caminhos absolutos do site com o `base` do Astro
 * (necessário no GitHub Pages, onde o site fica em /axis-zero/).
 * Caminhos que não começam com "/" (mailto:, #, http…) passam direto.
 */
export const url = (path: string): string => {
  if (!path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
};
