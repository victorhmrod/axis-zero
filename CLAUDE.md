# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Loja de colecionáveis da **Axis Zero · Estúdio Industrial** (mockup), em Astro 7 estático. Conteúdo em pt-BR. Publicada no GitHub Pages: https://victorhmrod.github.io/axis-zero/ (repo `victorhmrod/axis-zero`). Não há backend, lint nem testes.

## Comandos

```bash
npm run dev        # http://localhost:4321 (AGENTS.md recomenda `astro dev --background` em sessões do Claude Code)
npm run build      # gera ./dist (apague depois; está no .gitignore)
GITHUB_ACTIONS=true npm run build   # simula o build do Pages (base /axis-zero); use para checar links
```

O deploy é automático: push na `main` dispara `.github/workflows/deploy.yml` (withastro/action + deploy-pages, Pages com source "workflow").

## Convenções do repositório

- **Commits sem `Co-Authored-By`.** Pedido explícito do dono; o histórico já foi reescrito para remover. Mensagens em português.
- O dono publica pelo GitHub Pages: depois de `git push` o site atualiza em ~1 min.
- Identidade visual (manual da marca): preto `#0E0E0F`, marfim `#F2EBDD`, laranja `#E8641A` (só na palavra-chave do título e em chamadas de ação), cinza `#8A8A8C`; Anton em caixa-alta (tracking +2%) para títulos, Inter para texto; cantos com chanfro no topo-esquerdo e base-direita (classe `.chamfer`); padrão de "camadas" (faixas horizontais) em rodapés/fechamentos. Os tokens estão em `src/styles/global.css`.

## Arquitetura (o que exige ler vários arquivos)

**Dados dirigem as páginas.** `src/data/products.ts` é a fonte única: define categorias, produtos e helpers (`brl`, `photoOf`, `isSupply`). Dele saem os cards, `/colecao`, as páginas `/produto/[slug]` (via `getStaticPaths`), o catálogo JSON embutido em `/carrinho` e a seção "Monte a sua bancada" da home.
- `layers: 0` / categorias de insumo (`impressoras`, `filamentos`, `resinas`) desligam o deslizador de "camadas" e trocam "Acabamento/Produção" por `optionLabel`/`leadLabel` e ficha própria (`specs`).
- `soon: true` troca "Adicionar à sacola" por formulário "Avise-me" (usado nas resinas Axis, ainda em formulação).
- Fotos reais ficam em `public/products/<slug>.webp` e são ligadas por `image`. `photoOf()` checa o arquivo em **tempo de build** (`process.cwd()`); sem arquivo, cai na arte provisória `ProductArt.astro` (silhuetas SVG fatiadas por máscara). Preços/fichas/nomes de impressoras, filamentos e resinas são **exemplos** a substituir.

**Base path do GitHub Pages.** `astro.config.mjs` usa `base: '/axis-zero'` apenas quando `GITHUB_ACTIONS === 'true'`; localmente é `/`. Por isso **todo link/asset absoluto passa por `url()`** (`src/utils/url.ts`). Não escreva `href="/colecao"` nem `src="/brand/..."` direto. Links `#`, `mailto:` e `http` passam intactos.

**Layouts.** `Base.astro` (head, loader, canvas de fundo, cursor, `motion.ts`) → `Shell.astro` (Base + Header + Footer, usado pelas páginas internas). A home (`index.astro`) monta Base com slots manualmente.

**Sistema de movimento** (`src/scripts/motion.ts`, importado em `Base.astro`). É aprimoramento progressivo guiado por atributos/classes:
- Um script inline no `<head>` põe `html.js` e decide `is-loading` (loader de 12 faixas, 1x por sessão via `sessionStorage['az-loader']`) ou `is-ready` (retorno, ou `prefers-reduced-motion`). Animações de entrada esperam `html.is-ready` (evento `az:ready`).
- Atributos: `data-reveal[=clip|left|scale]` + `--d` (atraso), `data-tilt`, `data-marquee`, `data-reactive` (símbolo do hero), `data-cursor="Texto"` (rótulo do cursor), `data-count`.
- Sem JS ou com movimento reduzido a página aparece completa; mantenha estados iniciais "escondidos" sempre atrelados a `.js`.

**Estado de mentira no navegador** (nenhum dado vai a servidor): `localStorage` — `az-cart-v2` (itens `{slug, finish, qty}`, API em `src/scripts/cart.ts`), `az-user`, `az-coupon`, `az-ship`, `az-notify`. Eventos: `az:cart-change`, `az:user-change`. Header lê esses eventos para o selo da sacola e o ponto de "logado". Frete (R$ 24,90) e cupom (`AXIS10`) são de demonstração.

**Símbolo da marca.** `SymbolO.astro` desenha o "O" (12 faixas, 2 laranja) com um único `clipPath` evenodd; foi trocado de `mask` porque a máscara falhava durante a animação das faixas. Logos exportadas ficam em `public/brand/`.

## Armadilhas já encontradas

- **Estilos escopados do Astro não alcançam DOM criado por JS.** `carrinho.astro` cria a lista via script, então seu `<style is:global>` prefixa tudo com `.cart-page`.
- `.field` é a classe global do canvas de fundo (`position: fixed`); não reutilize o nome em formulários (o carrinho usa `.fld`).
- O Astro comprime HTML e remove o espaço entre tag inline e texto em quebras de linha: use `{' '}` ou deixe na mesma linha (`<strong>16K</strong>` colava no texto).
- `[hidden]` perde para regras com `display:` explícito; adicione `[hidden]{display:none !important}` quando misturar.
- Grids com filhos largos estouram no celular: use `minmax(0, 1fr)`.
- Heredocs com apóstrofos na ferramenta Bash falharam algumas vezes; prefira criar arquivos com a ferramenta de escrita.
- O preview do navegador do app throttla transições: para inspecionar o visual final, injete `*{transition:none!important}` e a classe `reveal-all`, e role com `scrollBehavior='auto'`.
