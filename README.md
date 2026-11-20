# Axis Zero · Loja (mockup)

Mockup básico da loja de colecionáveis exclusivos da **Axis Zero · Estúdio Industrial**, feito com [Astro](https://astro.build) seguindo o Manual de Identidade Visual v1.0.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera ./dist
```

## Estrutura

| Caminho | O que é |
| --- | --- |
| `src/styles/global.css` | Tokens da marca (cores, Anton + Inter), moldura chanfrada, botão, padrão "camadas" |
| `src/pages/index.astro` | Home: hero, categorias, coleção, edição limitada, processo, CTA, rodapé |
| `src/pages/colecao.astro` | Coleção completa com filtro (`?categoria=` / `?filtro=limitadas`) e ordenação |
| `src/pages/produto/[slug].astro` | Página de produto (uma por item de `products.ts`), com controle de "camadas" |
| `src/layouts/Shell.astro` | Layout com cabeçalho e rodapé, usado pelas páginas internas |
| `src/components/` | Header, Hero, Categories, ProductCard, FeaturedProducts, Drop, Process, Cta, Footer |
| `src/components/SymbolO.astro` | Símbolo "O" em SVG (12 faixas, 2 últimas laranja) |
| `src/components/ProductArt.astro` | Arte provisória "fatiada em camadas" — trocar por fotos reais |
| `src/data/products.ts` | Produtos de exemplo (nomes e preços fictícios) |
| `public/brand/` | Logos exportadas (horizontal, vertical, mono, símbolo, selo) |

## Marca

- Cores: Preto Profundo `#0E0E0F`, Marfim Quente `#F2EBDD`, Laranja Segurança `#E8641A`, Cinza Aço `#8A8A8C`
- Tipografia: Anton (títulos, caixa-alta, tracking +2%) · Inter (texto e interface)
- Laranja apenas na palavra-chave do título e nas chamadas de ação
