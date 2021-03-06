const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// vue-cli-service build --watch is only inlines js for the firstime so using custom args to change the webpack configuration
const watch = process.argv.includes("--watch-inline") ? process.argv.includes("--watch-inline") : false

module.exports = {
  css: {
    extract: true, // don't extract the internal css chunks to external file
  },
  configureWebpack: {
    watch, // watch the file changes and build the final UI that can used by Figma plugin directly
    optimization: {
      splitChunks: false // makes sure there only be 1 js file - leftover from earlier attempts but doesn't hurt
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html', // this is important - a template file to use for insertion
        inlineSource: '.(js|css)$' // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin), // this is important - inline the generated js to the index.html
    ]
  }
};
