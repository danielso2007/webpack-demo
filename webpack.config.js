const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// HtmlWebpackPluginpor padrão, ela gerará seu próprio index.html, mesmo que já tenhamos um na dist/.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

function createModules() {
    let ruleCSS = {test: /\.css$/, use: ['style-loader', 'css-loader']};
    let ruleImage = {test: /\.(png|svg|jpg|gif)$/, use: [{loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'images/' }}]};
    let ruleFonts = {test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, use: [{loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' }}]};
    return {rules: [
        ruleCSS, 
        ruleImage, 
        ruleFonts]};
}

function createPlugins() {
    let cleanWebpackPlugin = new CleanWebpackPlugin();
    let miniCssExtractPlugin = new MiniCssExtractPlugin({filename: "[name].css", chunkFilename: "[id].css"});
    let webpackEnvironmentPlugin = new webpack.EnvironmentPlugin({
        NODE_ENV: 'development', 
        DEBUG: false});
    let webpackDefinePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    });
    let htmlWebpackPlugin = new HtmlWebpackPlugin({
        'title': 'Output Management',
        'meta' : {
            viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
            'application-name': 'Estudo Webpack',
            'theme-color': '#4285f4',
            'robots': 'index,follow',
            'googlebot': 'index,follow'
        }
    });
    return [
        cleanWebpackPlugin,
        miniCssExtractPlugin, 
        webpackEnvironmentPlugin, 
        webpackDefinePlugin,
        htmlWebpackPlugin];
}

function createWebpackConfig(mode) {
    let webpackConfig = {};

    webpackConfig.mode = mode;
    webpackConfig.entry = {
        app: './src/index.js',
        print: './src/print.js'
    };
    webpackConfig.output = {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    };

    webpackConfig.module = createModules();
    webpackConfig.plugins = createPlugins();

    if (mode === 'development') {
        webpackConfig.devtool = 'source-map';
    }
    
    webpackConfig.devServer = {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        open: false,
        watchContentBase: true,
        clientLogLevel: 'info',
        port: 8080,
        after: function(app, server) {
        },
        before: function(app, server) {
        }
    }

    return webpackConfig;
}

module.exports = (env, argv) => {
    let mode = argv.production ? 'production' : 'development';

    if (mode === 'production' || argv.production) {
        console.log('Executando build para produção.');
    } else {
        console.log('Executando build para desenvolvimento.');
    }
    
    let config = createWebpackConfig(mode);

    return config;
};