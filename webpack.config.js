const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function createWebpackConfig() {
    let webpackConfig = {};

    webpackConfig.mode = 'development';
    webpackConfig.entry = './src/index.js';
    webpackConfig.output = {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    };
    let ruleCSS = {test: /\.css$/, use: ['style-loader', 'css-loader']};
    let ruleImage = {test: /\.(png|svg|jpg|gif)$/, use: [{loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'images/' }}]};
    let ruleFonts = {test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, use: [{loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' }}]};
    webpackConfig.module = {rules: [ruleCSS, ruleImage, ruleFonts]};

    let miniCssExtractPlugin = new MiniCssExtractPlugin({filename: "[name].css", chunkFilename: "[id].css"});
    let webpackEnvironmentPlugin = new webpack.EnvironmentPlugin({NODE_ENV: 'development', DEBUG: false});
    let webpackDefinePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    });
    webpackConfig.plugins = [miniCssExtractPlugin, webpackEnvironmentPlugin, webpackDefinePlugin];

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