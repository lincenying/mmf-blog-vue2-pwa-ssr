/**
 * @file vue-loader 配置文件
 * @author lincenying(lincenying@qq.com)
 */

'use strict'

const utils = require('./utils')
const config = require('../config')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: isProd
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: isProd,
        usePostCSS: false
    })
}
