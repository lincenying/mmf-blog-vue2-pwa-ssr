/**
 * @file theme loader
 *
 * @desc 向每个.vue文件中注入样式相关的变量，不需要手动import
 * @author lincenying(lincenying@qq.com)
 */

/* eslint-disable fecs-no-require, fecs-prefer-destructure */

'use strict'

const theme = require('../../config/theme')
const loaderUtils = require('loader-utils')

const STYLE_TAG_REG = /(\<style.*?lang="styl(?:us)?".*?\>)([\S\s]*?)(\<\/style\>)/g

// 定义在vuetify中默认的两组stylus hash：主题色和material相关
const defaultVuetifyVariables = {
    themeColor: {
        primary: '$blue.darken-2',
        accent: '$blue.accent-2',
        secondary: '$grey.darken-3',
        info: '$blue.base',
        warning: '$amber.base',
        error: '$red.accent-2',
        success: '$green.base'
    },
    materialDesign: {
        'bg-color': '#fff',
        'fg-color': '#000',
        'text-color': '#000',
        'primary-text-percent': 0.87,
        'secondary-text-percent': 0.54,
        'disabledORhints-text-percent': 0.38,
        'divider-percent': 0.12,
        'active-icon-percent': 0.54,
        'inactive-icon-percent': 0.38
    }
}

// 使用用户定义在config/theme.js中的变量覆盖默认值
const themeColor = Object.assign(
    {},
    defaultVuetifyVariables.themeColor,
    theme.theme.themeColor
)

// 最终输出的stylus hash(themeColor部分)
const themeColorTemplate = `
    $theme := {
        primary: ${themeColor.primary}
        accent: ${themeColor.accent}
        secondary: ${themeColor.secondary}
        info: ${themeColor.info}
        warning: ${themeColor.warning}
        error: ${themeColor.error}
        success: ${themeColor.success}
    }
`

const materialDesign = Object.assign(
    {},
    defaultVuetifyVariables.materialDesign,
    theme.theme.materialDesign
)

const materialDesignTemplate = `
    $material-custom := {
        bg-color: ${materialDesign['bg-color']}
        fg-color: ${materialDesign['fg-color']}
        text-color: ${materialDesign['text-color']}
        primary-text-percent: ${materialDesign['primary-text-percent']}
        secondary-text-percent: ${materialDesign['secondary-text-percent']}
        disabledORhints-text-percent: ${materialDesign['disabledORhints-text-percent']}
        divider-percent: ${materialDesign['divider-percent']}
        active-icon-percent: ${materialDesign['active-icon-percent']}
        inactive-icon-percent: ${materialDesign['inactive-icon-percent']}
    }
    $material-theme := $material-custom
`

// 引入项目变量和vuetify中使用的颜色变量
const importVariablesTemplate = `
    @import '~@/assets/styles/variables';
    @import '~vuetify/src/stylus/settings/_colors';
`

const injectedTemplate = importVariablesTemplate
    + themeColorTemplate + materialDesignTemplate

module.exports = function (source) {
    this.cacheable()
    const options = loaderUtils.getOptions(this)
    if (options && options.injectInVueFile) {

        // 向每一个.vue文件的<style>块中注入
        return source.replace(STYLE_TAG_REG, `$1${injectedTemplate}$2$3`)
    }
    return injectedTemplate + source
}
