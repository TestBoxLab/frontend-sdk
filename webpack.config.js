const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    mode: "development",
    entry: [path.join(__dirname, 'src', 'cdn.ts')],
    output: {
        path: path.join(__dirname, 'static'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'static/index.html',
        filename: 'index.html',
      })
    ],
    devServer: {
        open: true,
        hot: true,
        port: 8080,
        static: {
            directory: path.join(__dirname, "/")
        } 
    },
    module: {
        rules: [
        {
            test: /\.(m?js|ts)$/,
            exclude: /(node_modules)/,
            use:  [`swc-loader`]
            }
        ]
    },
    resolve: {
        extensions: [`.js`, `.ts`],
    }
}