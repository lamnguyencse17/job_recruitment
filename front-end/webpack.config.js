const HtmlWebPackPlugin = require("html-webpack-plugin");
const CSPWebpackPlugin = require("csp-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    // new CSPWebpackPlugin({
    //   'object-src': '\'none\'',
    //   'base-uri': '\'self\'',
    //   'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'','http://ajax.googleapis.com'],
    //   'default-src': '*',
    //   'img-src': '\'self\'',
    //   'style-src': '*',
    //   'worker-src': ['\'self\'','blob:']
    //   })
  ]
};
