const Image = require('@11ty/eleventy-img')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const svgSprite = require('eleventy-plugin-svg-sprite')
const markdownIt = require('markdown-it')
const markdownItEleventyImg = require('markdown-it-eleventy-img')

async function imageShortcode(
  src,
  alt,
  className,
  sizes = '100vw',
  loading = 'lazy'
) {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`)
  }

  let metadata = await Image(src, {
    // 1200 keeps full-width heroes sharp; WebP and JPEG cover every browser
    widths: [300, 600, 1200],
    formats: ['webp', 'jpeg'],
    outputDir: 'dist/assets/images',
    urlPath: '/assets/images',
  })

  let lowsrc = metadata.jpeg[0]
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1]

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `  <source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .map((entry) => entry.srcset)
          .join(', ')}" sizes="${sizes}">`
      })
      .join('\n')}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        ${className ? `class="${className}"` : ''}
        loading="${loading}"
        ${loading === 'eager' ? 'fetchpriority="high"' : ''}
        decoding="async">
    </picture>`
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addPlugin(svgSprite, {
    path: './src/assets/svgs',
    // The plugin's own shortcode outputs broken aria-labelledby references and
    // duplicate ids, so it's parked here and replaced by `svg` below
    svgShortcode: 'svgPluginDefault',
  })
  // Icons are decorative: every usage has visible or sr-only text alongside it
  eleventyConfig.addShortcode('svg', (name, classes = '') => {
    if (!name) throw new Error('svg shortcode: name of SVG must be specified')
    const classAttr = classes ? ` class="${classes}"` : ''
    return `<svg${classAttr} aria-hidden="true" focusable="false"><use href="#svg-${name}"></use></svg>`
  })
  eleventyConfig.addLiquidShortcode('image', imageShortcode)
  eleventyConfig.addJavaScriptFunction('image', imageShortcode)
  eleventyConfig.addLiquidShortcode('year', () => `${new Date().getFullYear()}`)
  eleventyConfig.addLiquidFilter('removeBrackets', (value) => {
    let string = value.replace(/ *\([^)]*\) */g, '')
    return string
  })
  // Ranks portfolio nav entries by the tags they share with the current project.
  // Rarer tags count for more (sharing "Shopify" beats sharing "CSS"), and the
  // list is topped up with the rest (in nav order) so there are always `limit`
  eleventyConfig.addLiquidFilter(
    'relatedProjects',
    (entries = [], currentKey, limit = 3) => {
      // "Tailwind CSS" → "tailwind", "Vue 3" → "vue", "Barba.JS" → "barba"
      const normalise = (tags = []) =>
        tags.map((tag) =>
          tag
            .toLowerCase()
            .replace(/\s+\d+$/, '')
            .replace(/(.+?)[\s.]?(js|css)$/, '$1')
        )
      const projects = entries.filter((entry) => entry.url)
      const current = projects.find((entry) => entry.key === currentKey)
      const currentTags = normalise(current?.tags)

      const tagCounts = {}
      projects.forEach((entry) =>
        new Set(normalise(entry.tags)).forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      )

      return projects
        .filter((entry) => entry.key !== currentKey)
        .map((entry, index) => ({
          entry,
          index,
          score: [...new Set(normalise(entry.tags))]
            .filter((tag) => currentTags.includes(tag))
            .reduce((total, tag) => total + 1 / tagCounts[tag], 0),
        }))
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .slice(0, limit)
        .map(({ entry }) => entry)
    }
  )
  eleventyConfig.addPassthroughCopy({
    'src/assets/favicon': '/assets/favicon',
    // Browsers request /favicon.ico from the root by default
    'src/assets/favicon/favicon.ico': '/favicon.ico',
    'src/964e35597f5dcb0b8f04bb7f95aa9125.txt':
      '/964e35597f5dcb0b8f04bb7f95aa9125.txt',
  })
  eleventyConfig.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    }).use(markdownItEleventyImg)
  )

  return {
    dir: {
      input: 'src',
      data: 'data',
      output: 'dist',
    },
  }
}
