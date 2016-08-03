/* eslint-env node */

const webpack = require('webpack');

const config = {
    entry: './app/assets/src/js/main.jsx',
    output: {
        path: './app/assets/javascripts',
        publicPath: '/javascripts/',
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    devServer: {
        inline: true
    }
};

if (process.env.NODE_ENV === 'production') {
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.UglifyJsPlugin({
            compless: {
                warnings: false
            }
        })
    ];
}

module.exports = config;
