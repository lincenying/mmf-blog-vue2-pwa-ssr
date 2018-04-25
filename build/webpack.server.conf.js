/**
 * @file 生产环境 webpack server配置文件
 * @author lincenying(lincenying@qq.com)
 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
const base = require('./webpack.base.conf')
const config = require('../config')

// function resolve(dir) {
//     return path.join(__dirname, '..', dir)
// }

const env = process.env.NODE_ENV === 'production'
    ? config.build.env
    : config.dev.env

module.exports = merge(base, {
    mode: 'production',
    target: 'node',
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        alias: {
            '~api': path.resolve(__dirname, '../src/api/index-server'),
            'api-config': path.resolve(__dirname, '../src/api/config-server')
        }
    },
    // https://webpack.js.org/configuration/externals/#externals
    // https://github.com/liady/webpack-node-externals
    externals: nodeExternals({
        // do not externalize CSS files in case we need to import it from a dep
        whitelist: [/\.css$/, /\?vue&type=style/]
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': '"server"',
            'process.env': env
        }),
        new VueSSRServerPlugin()
    ]
})
