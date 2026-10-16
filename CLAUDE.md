# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal website for discoliam.com — an Eleventy (11ty v2) static site with Liquid templates, plus a separate Webpack build for JS/CSS. Hosted on Netlify, which rebuilds on every push to `main`.

## Commands

- `npm run dev` — cleans `dist/`, then runs Webpack in watch mode and `eleventy --serve` in parallel (served at http://localhost:8080).
- `npm run build` — production build of both into `dist/`.
- Individual halves: `npm run dev:webpack`, `npm run dev:eleventy`, `npm run build:webpack`, `npm run build:eleventy`.

There are no tests. ESLint, Stylelint and Prettier config files exist, but there's no lint script and ESLint/Stylelint aren't in `devDependencies`.

## Architecture

**Two independent build pipelines both write to `dist/`:**
- **Webpack** (`webpack.js`) bundles `src/assets/js/index.js` → `dist/assets/main.js` and `src/assets/styles/index.css` → `dist/assets/style.css` (PostCSS via `postcss-preset-env`; `postcss.config.js` adds `postcss-import` and custom media queries from `global/queries.css`). New CSS files have to be `@import`ed in `src/assets/styles/index.css`, and new JS modules imported and called from `index.js`. CSS uses BEM-ish PascalCase class names (`PortfolioNav__Item`).
- **Eleventy** (`.eleventy.js`) uses `src/` as input, `src/data/` as the global data directory and `dist/` as output. `base.liquid` hard-codes links to `/assets/style.css` and `/assets/main.js`.

**Eleventy config notes:**
- `{% image src, alt, className, sizes %}` shortcode uses `@11ty/eleventy-img` (300/600 widths, webp/jpeg/png) and writes to `dist/assets/images`. It throws if `alt` is missing. Pass `src` as a project-root path like `./src/assets/images/...`.
- `eleventy-plugin-svg-sprite` builds a sprite from `src/assets/svgs/`, injected once by `{% svgsprite %}` in `base.liquid`. The client/project logo lists in `src/data/portfolio.json` are rendered via `{% svg name | slugify %}`, so each entry needs a matching slugified SVG file.
- Markdown has HTML enabled and uses `markdown-it-eleventy-img`.
- Layouts live in `src/_includes/layouts/`. `full-width.html`, `centered.html` and `portfolio.liquid` all extend `base.liquid` via Liquid `{% layout %}` / `{% block content %}`.

**Navigation:**
- Main header nav = pages tagged `header` and given `eleventyNavigation.key`/`order`.
- Portfolio case studies (`src/portfolio/*.md`) use `layouts/portfolio.liquid` and are children of the `Portfolio` nav key, ordered by `eleventyNavigation.order` (lowest first, treated as newest). Card fields (`client`, `services`, `tags`, `excerpt`, `website`) must sit **inside** the `eleventyNavigation` front matter block. The card image is looked up by convention at `src/assets/images/bg-<slugified key>.jpg`, and the build fails if it's missing.
- Cards render via `src/_includes/portfolio-card.liquid`, shared by the portfolio listing, the homepage "Recent projects", case study "Related projects" (the `relatedProjects` filter in `.eleventy.js`, which weights rarer shared tags higher) and service pages.
- Service pages (`src/services/*.md`) use `layouts/service.liquid`, list related projects by matching `serviceTags` against each project's tags and `services` text, and appear in the footer via `eleventyNavigation` with `parent: Services`.
- `{% svg "name" %}` is a custom shortcode (overriding the sprite plugin's) that outputs a decorative, `aria-hidden` icon, so always pair it with visible or `sr-only` text.
- Set `noindex: true` in front matter to add a robots noindex meta tag; also add the page to the sitemap `exclude` list in `netlify.toml`.
