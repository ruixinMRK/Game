
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        "webpack-dev-server/client?http://0.0.0.0:4004",
        "webpack/hot/dev-server",
        "./src/main.js",
    ],
    output: {
        filename: './build/bundle.js'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
              test: /\.js[x]?$/,
              exclude: /node_modules/,
              loader: 'babel', // 'babel-loader' is also a legal name to reference

            },

            {
                test: /\.(eot|ttf|wav|mp3)$/,
                loader: 'file-loader',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000',
            },
            {
                test: /\.css$/,
                loaders: [
                    'style?sourceMap',
                    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',

                ]
            }
         ]

    },
    externals: {

    },
    plugins: [

        //new webpack.ProvidePlugin({
        //    'createjs': 'imports?this=>global!exports?createjs!createjs',
        //})
    ],
    resolve: {
      root: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'vendors'),
      ],
      extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    },
    devtool: 'source-map'

};
