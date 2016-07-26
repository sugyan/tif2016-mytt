module.exports = {
    entry: './app/assets/src/js/main.js',
    output: {
        path: './public/javascripts',
        publicPath: '/javascripts/',
        filename: 'application.js'
    },
    devServer: {
        inline: true
    }
};
