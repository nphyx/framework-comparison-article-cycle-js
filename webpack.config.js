let path = require("path");

module.exports = {
  entry: {
    "scripts/app": path.resolve(__dirname, "src/scripts/app.js")
  },
  mode: "production",
  // devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].js"
  },
  watchOptions: {
    poll: true
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-snabbdom-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}
