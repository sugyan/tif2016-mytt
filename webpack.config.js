/* eslint-env node */

module.exports = {
    entry: './app/assets/src/js/main.js',
    output: {
        path: './public/javascripts',
        publicPath: '/javascripts/',
        filename: 'application.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        inline: true
    }
};
