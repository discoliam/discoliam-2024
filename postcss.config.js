// postcss.config.js

const path = require('path')

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-custom-media')({
      importFrom: 'src/assets/styles/global/queries.css',
    }),
    require('postcss-preset-env')({
      stage: 1,
    }),
  ],
}
