
var webpack = require('webpack');
var path  = require('path');

module.exports = {
    entry: {
      bundle: "./src/main.js",
    },
    output: {
        filename: './build/[name].js'
    },
    module: {
      loaders: [
        {
          //tell webpack to use jsx-loader for all *.jsx files
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          // 'babel-loader' is also a legal name to reference
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

    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
        // new webpack.ProvidePlugin({
        //    'createjs': 'imports?this=>global!exports?createjs!createjs',
        // }),
      //new webpack.optimize.CommonsChunkPlugin({
      //  //name: ['react'],
      //  //minChuncks: Infinity
      //}),
      //  new webpack.optimize.CommonsChunkPlugin('react', 'react.js'),
      //new webpack.optimize.CommonsChunkPlugin("commons.js", ["bundle", "./build/admin-commons.js"]),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ],
    resolve: {
      alias: {
        'createjs' : path.join(__dirname, '/vendors/createjs.js')
      },
      root: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'vendors'),
      ],
      extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"],
    },
    devtool: 'source-map'

};
