const path = require('path');

function createWebpackConfig() {
    let webpackConfig = {};

    webpackConfig.mode = 'development';
    webpackConfig.entry = './src/index.js';
    webpackConfig.output = {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    };
    let ruleCSS = {test: /\.css$/, use: ['style-loader', 'css-loader']};
    let ruleImage = {test: /\.(png|svg|jpg|gif)$/, use: ['file-loader']};
    webpackConfig.module = {
        rules: [ruleCSS, ruleImage]
    };

    return webpackConfig;
}

module.exports = (env, argv) => {
    let config = createWebpackConfig();

    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    if (argv.mode === 'production') {
        console.log('Executando build para produção.');
    } else {
        console.log('Executando build para desenvolvimento.');
    }

    return config;
};