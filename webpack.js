const path = require('path')
const PostCSSPresetEnv = require('postcss-preset-env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  stats: {
    colors: true,
    preset: 'minimal',
  },
  entry: [
    path.resolve(__dirname, 'src/assets/js/index.js'),
    path.resolve(__dirname, 'src/assets/styles/index.css'),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets/'),
    publicPath: '/assets/',
  },
  resolve: {
    extensions: ['*', '.js', '.json'],
    alias: {
      // Helpful alias for importing assets
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: [PostCSSPresetEnv] } },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif|jxl)$/i,
        type: 'asset/resource',
        generator: {
          filename: `images/[name][ext]`,
        },
      },
      {
        // Fixed path so base.liquid can preload the critical fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: `fonts/[name][ext]`,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './style.css',
      chunkFilename: '[id].css',
    }),
  ],
}
