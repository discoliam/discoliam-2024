# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal website for discoliam.com — an Eleventy (11ty v2) static site with Liquid templates, plus a separate Webpack build for JS/CSS. Hosted on Netlify, which rebuilds on every push to `main`.

## Commands

- `npm run dev` — cleans `dist/`, then runs Webpack in watch mode and `eleventy --serve` in parallel (served at http://localhost:8080).
- `npm run build` — production build of both into `dist/`.
- Individual halves: `npm run dev:webpack`, `npm run dev:eleventy`, `npm run build:webpack`, `npm run build:elventy` (the typo in that script name is real).

There are no tests. ESLint, Stylelint and Prettier config files exist, but there's no lint script and ESLint/Stylelint aren't in `devDependencies`.

## Architecture

**Two independent build pipelines both write to `dist/`:**
- **Webpack** (`webpack.js`) bundles `src/assets/js/index.js` → `dist/assets/main.js` and `src/assets/styles/index.css` → `dist/assets/style.css` (PostCSS via `postcss-preset-env`; `postcss.config.js` adds `postcss-import` and custom media queries from `global/queries.css`). New CSS files have to be `@import`ed in `src/assets/styles/index.css`, and new JS modules imported and called from `index.js`. CSS uses BEM-ish PascalCase class names (`PortfolioNav__Item`).
- **Eleventy** (`.eleventy.js`) uses `src/` as input, `src/data/` as the global data directory and `dist/` as output. `base.liquid` hard-codes links to `/assets/style.css` and `/assets/main.js`.

**Eleventy config notes:**
- `{% image src, alt, className, sizes %}` shortcode uses `@11ty/eleventy-img` (300/600 widths, webp/jpeg/png) and writes to `dist/assets/images`. It throws if `alt` is missing. Pass `src` as a project-root path like `./src/assets/images/...`.
- `{% svg "name" %}` comes from `eleventy-plugin-svg-sprite`, which builds a sprite from `src/assets/svgs/`. The sprite is injected once by `{% svgsprite %}` in `base.liquid`. The client/project logo lists in `src/data/portfolio.json` are rendered via `{% svg name | slugify %}`, so each entry needs a matching slugified SVG file.
- Markdown has HTML enabled and uses `markdown-it-eleventy-img`.
- Layouts live in `src/_includes/layouts/`. `full-width.html`, `centered.html` and `portfolio.liquid` all extend `base.liquid` via Liquid `{% layout %}` / `{% block content %}`.

**Navigation:**
- Main header nav = pages tagged `header` and given `eleventyNavigation.key`/`order`.
- Portfolio case studies (`src/portfolio/*.md`) set `permalink: false`, so they don't get their own pages. They exist only as children of the `Portfolio` nav key. `src/portfolio/index.liquid` renders them from `eleventyNavigation`. Card fields (`client`, `services`, `tags`, `excerpt`, `website`) must sit **inside** the `eleventyNavigation` front matter block. The card image is looked up by convention at `src/assets/images/bg-<slugified title>.jpg`.

**Music page (Discogs data):**
- `src/data/music.js` and `src/data/folders.js` fetch the `discoliam` Discogs collection at build time. They need `DISCOG_TOKEN` in `.env` (gitignored) or in the Netlify env.
- Responses are cached for 8h in `.cache/` via `@11ty/eleventy-fetch` `AssetCache`. Delete `.cache/` to force a refetch.
- `src/music.liquid` paginates over `music`.
