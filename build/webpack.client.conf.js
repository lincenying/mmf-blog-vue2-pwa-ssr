/**
 * @file 生产环境 webpack client配置文件
 * @author lincenying(lincenying@qq.com)
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const SwRegisterWebpackPlugin = require('sw-register-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const baseConfig = require('./webpack.base.conf')
const config = require('../config')
const utils = require('./utils')

const isProduction = process.env.NODE_ENV === 'production'

const env = isProduction ? config.build.env : config.dev.env

let sourceMap = '#eval-source-map'
if (isProduction) {
    if (config.build.productionSourceMap) sourceMap = '#source-map'
    else sourceMap = false
}

const webpackConfig = merge(baseConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: isProduction,
            usePostCSS: isProduction
        })
    },
    externals: {
        jquery: 'jQuery'
    },
    devtool: sourceMap,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath(isProduction ? 'js/[name].[chunkhash:7].js' : 'js/[name].js'),
        chunkFilename: utils.assetsPath(isProduction ? 'js/[name].[chunkhash:7].js' : 'js/[name].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': '"client"',
            'process.env': env
        }),
        new VueSSRClientPlugin()
    ]
})

if (isProduction) {
    webpackConfig.mode = 'production'
    webpackConfig.optimization = {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: -20,
                    chunks: "all"
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
            })
        ]
    }
    webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:7].css')
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // service worker caching
        new SWPrecacheWebpackPlugin(config.swPrecache.build),
        new SwRegisterWebpackPlugin({
            prefix: '/',
            filePath: path.resolve(__dirname, '../src/sw-register.js')
        })
    ]
}

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('' + '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
