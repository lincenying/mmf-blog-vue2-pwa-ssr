/**
 * @file 基础 webpack 配置文件，开发环境和生产环境公用的
 * @author lincenying(lincenying@qq.com)
 */

/* eslint-disable no-console */

// const webpack = require('webpack')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

require('babel-polyfill')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: 'development',
    entry: {
        app: './src/entry-client.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
            '~src': resolve('src'),
            '~components': resolve('src/components'),
            '~api': resolve('src/api/index-client'),
            '~pages': resolve('src/pages'),
            '~mixins': resolve('src/mixins'),
            '~store': resolve('src/store'),
            '~utils': resolve('src/utils'),
            assets: resolve('src/assets'),
            'api-config': resolve('src/api/config-client'),
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false,
                            },
                        },
                    },
                ],
                include: [resolve('src')],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
                },
            },
        ],
    },
    plugins: process.env.NODE_ENV === 'production' ? [] : [new FriendlyErrorsPlugin()],
}
