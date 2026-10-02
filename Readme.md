# Discoliam 2024

[![Netlify Status](https://api.netlify.com/api/v1/badges/8b355049-257c-4cde-a867-73a71faeeb44/deploy-status)](https://app.netlify.com/projects/discoliam2024/deploys)

The website for [Discoliam.com](https://discoliam.com/).

## 💁 tl:dr

- Clone Repo
- `cd` into repo
- `npm install`
- `npm run dev`

## 📝 Colophon

- [11ty](https://www.11ty.dev/) as a Static Site Generator
- [Liquid](https://liquidjs.com/) for templating.
- [Webpack](https://webpack.js.org/)
- [PostCSS](https://postcss.org/)
- [postcss-preset-env](https://preset-env.cssdb.org/)

## 🚧 Development

The command `npm run dev` Does two things:

- Runs Webpack to compile and build all the static assets
- Runs a simple webserver with browser sync, as described in the [11ty Docs](https://www.11ty.dev/docs/usage/#re-run-eleventy-when-you-save)

Everything is serverd and hotreladed at [http://localhost:8080].

## 🏗 Build

`npm run build` will build the site and static assets into the `dist` folder.

## 🚀 Deployment

This site is hosted on [Netlify](https://netlify.com). It re-builds on every push of the `main` branch.
