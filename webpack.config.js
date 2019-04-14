const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function createModules(devMode) {
    let ruleCSS = {test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
              reloadAll: true,
            },
          },
          'css-loader',
    ]};
    let ruleImage = {test: /\.(png|svg|jpg|gif)$/, use: [{loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'images/' }}]};
    let ruleFonts = {test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, use: [{loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' }}]};
    return {rules: [
        ruleCSS, 
        ruleImage, 
        ruleFonts]};
}

function createPlugins(devMode) {
    let cleanWebpackPlugin = new CleanWebpackPlugin();
    let miniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    });
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
    let bundleAnalyzerPlugin = new BundleAnalyzerPlugin();
    return [
        bundleAnalyzerPlugin,
        cleanWebpackPlugin,
        miniCssExtractPlugin, 
        webpackEnvironmentPlugin, 
        webpackDefinePlugin,
        htmlWebpackPlugin];
}

function createServer() {
    return {
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
}

function createOptimization(devMode) {
    return {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '.',
            name: true,
            cacheGroups: {
                vendors: {
                    filename: devMode ? '[name].bundle.js' : '[name].[hash].bundle.js',
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    };
}

function createWebpackConfig(devMode) {
    let webpackConfig = {};

    webpackConfig.entry = {
        app: './src/index.js',
        print: './src/print.js',
        another: './src/another-module.js'
    };
    webpackConfig.output = {
        filename: devMode ? '[name].bundle.js' : '[name].[hash].bundle.js',
        chunkFilename: devMode ? '[name].bundle.js' : '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    };

    webpackConfig.optimization = createOptimization(devMode);

    if (devMode) {
        webpackConfig.devtool = 'source-map';
    }

    webpackConfig.module = createModules(devMode);
    webpackConfig.plugins = createPlugins(devMode); 
    
    webpackConfig.devServer = createServer();

    return webpackConfig;
}

module.exports = (env, argv) => {
    let mode = argv.production ? 'production' : 'development';

    if (mode === 'production' || argv.production) {
        console.log('Executando build para produção.');
    } else {
        console.log('Executando build para desenvolvimento.');
    }
    
    let config = createWebpackConfig(mode === 'development');
    config.mode = mode;

    return config;
};