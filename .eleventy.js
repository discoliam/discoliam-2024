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
    widths: [300, 600],
    formats: ['webp', 'jpeg', 'png'],
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
        class="${className}"
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
  })
  eleventyConfig.addLiquidShortcode('image', imageShortcode)
  eleventyConfig.addJavaScriptFunction('image', imageShortcode)
  eleventyConfig.addLiquidShortcode('year', () => `${new Date().getFullYear()}`)
  eleventyConfig.addLiquidFilter('removeBrackets', (value) => {
    let string = value.replace(/ *\([^)]*\) */g, '')
    return string
  })
  eleventyConfig.addPassthroughCopy({
    'src/assets/favicon': '/assets/favicon',
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
