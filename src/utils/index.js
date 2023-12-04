import Vue from 'vue'
import ls from 'store2'
import toastr from 'toastr'
import get from 'lodash.get'

toastr.options.positionClass = 'toast-top-center'

export const inBrowser = typeof window !== 'undefined'

export function ua () {
    const userAgentInfo = inBrowser ? navigator.userAgent : ''
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod']
    let flag = 'PC'
    for (let vv = 0; vv < Agents.length; vv++) {
        if (userAgentInfo.indexOf(Agents[vv]) > 0) {
            flag = Agents[vv]
            break
        }
    }
    return flag
}

export function ssp (path) {
    if (!inBrowser)
        return
    const clientHeight = document.documentElement.clientHeight
    const scrollTop = ls.get(path)
    if (scrollTop) {
        Vue.nextTick().then(() => {
            if (document.body.clientHeight >= scrollTop + clientHeight) {
                window.scrollTo(0, scrollTop)
            }
            ls.remove(path)
        })
    }
}

export function strlen (str) {
    let charCode = -1
    const len = str.length
    let realLength = 0
    for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128)
            realLength += 1
        else realLength += 2
    }
    return realLength
}

export function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function showMsg (message) {
    let content, type
    if (typeof message === 'string') {
        content = message
        type = 'error'
    } else {
        content = message.content
        type = message.type
    }
    toastr[type](content)
}

export function oc (props, property, def) {
    return get(props, property, def)
}
