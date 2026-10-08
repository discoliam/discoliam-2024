---
layout: 'layouts/portfolio.liquid'
title: FutureKings | Discoliam
pageTitle: FutureKings
description: 'Case study: building the FutureKings website with Astro and headless WordPress, as Development Lead at the Bristol and Amsterdam branding agency.'
year: # 2026
website: https://futurekings.co.uk/
hero: './src/assets/images/bg-futurekings.jpg'
eleventyNavigation:
  key: FutureKings
  parent: Portfolio
  order: 1
  client: FutureKings
  services: 'Development Lead, Front-End Development'
  tags: ['Astro', 'Headless WordPress', 'Lenis', 'Netlify']
  excerpt: <p>FutureKings is a branding and creative agency in Bristol and Amsterdam, working with start-ups and founder-led businesses. As Development Lead, I built the agency's own website on WordPress, turning the brand into a fast, accessible site that shows off the studio's work.</p>
  website: https://futurekings.co.uk/
---

As Development Lead at FutureKings, the agency's own website is the project I'm closest to. It's the first thing potential clients see, so it has to show the same craft and attention to detail we bring to client work. That means it needs to be fast, accessible and easy for the team to keep up to date.

I built it as a static [Astro](https://astro.build/) front end, pulling content from a headless WordPress install. The team still gets an editing experience they already know, while visitors get pre-rendered pages served from [Netlify](https://www.netlify.com/)'s edge, with only the JavaScript each page actually needs. Smooth scrolling from [Lenis](https://lenis.darkroom.engineering/) adds a bit of polish without getting in the way of keyboard or screen reader users.

Splitting the CMS from the front end also gives us room to grow. New case studies, landing pages and campaign microsites can all be built from the same set of components and content models, without being locked into a WordPress theme.
