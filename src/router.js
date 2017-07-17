/**
 * @file router
 * @author lincenying(lincenying@qq.com)
 */

import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import cookies from 'js-cookie'
import {inBrowser} from './utils'
import * as types from './store/mutation-types'

// 定义切割点，异步加载路由组件
const index = () => import('./pages/frontend-index.vue')
const article = () => import('./pages/frontend-article.vue')
const about = () => import('./pages/frontend-about.vue')
const account = () => import('./pages/frontend-user-account.vue')
const password = () => import('./pages/frontend-user-password.vue')

const login = () => import('./pages/backend-login.vue')
const articleList = () => import('./pages/backend-article-list.vue')
const articleInsert = () => import('./pages/backend-article-insert.vue')
const articleModify = () => import('./pages/backend-article-modify.vue')
const articleComment = () => import('./pages/backend-article-comment.vue')

const categoryList = () => import('./pages/backend-category-list.vue')
const categoryInsert = () => import('./pages/backend-category-insert.vue')
const categoryModify = () => import('./pages/backend-category-modify.vue')

const adminList = () => import('./pages/backend-admin-list.vue')
const adminModify = () => import('./pages/backend-admin-modify.vue')

const userList = () => import('./pages/backend-user-list.vue')
const userModify = () => import('./pages/backend-user-modify.vue')

Vue.use(Router)
Vue.use(Meta)

/**
 * to 如果在这个列表中，始终采用从左到右的滑动效果，首页比较适合用这种方式
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_BACK_PAGE = ['index', 'trending', 'category', 'search']

/**
 * to 如果在这个列表中，始终采用从右到左的滑动效果
 *
 * @type {Array.<string>}
 * @const
 */
const ALWAYS_FORWARD_PAGE = ['article']

/**
 * 历史记录，记录访问过的页面的 fullPath
 *
 * @type {Array.<string>}
 * @const
 */
const HISTORY_STACK = []

/**
 * 判断当前是否是前进，true 表示是前进，否则是回退
 *
 * @param {Object} to 目标 route
 * @param {Object} from 源 route
 * @return {boolean} 是否表示返回
 */
function isForward(to, from) {

    // to 如果在这个列表中，始终认为是后退
    if (to.name && ALWAYS_BACK_PAGE.indexOf(to.name) !== -1) {

        // 清空历史
        HISTORY_STACK.length = 0
        return false
    }

    if (from.name && ALWAYS_BACK_PAGE.indexOf(from.name) !== -1) {

        // 如果是从 ALWAYS_BACK_PAGE 过来的，那么永远都是前进
        HISTORY_STACK.push(to.fullPath)
        return true
    }

    if (to.name && ALWAYS_FORWARD_PAGE.indexOf(to.name) !== -1) {

        // to 如果在这个列表中，始终认为是前进
        HISTORY_STACK.push(to.fullPath)
        return true
    }

    // 根据 fullPath 判断当前页面是否访问过，如果访问过，则属于返回
    const index = HISTORY_STACK.indexOf(to.fullPath)
    if (index !== -1) {
        HISTORY_STACK.length = index + 1
        return false
    }

    // 将 to.fullPath 加到栈顶
    HISTORY_STACK.push(to.fullPath)
    return true
}

const guardRoute = (to, from, next) => {
    var token = cookies.get('user') || !inBrowser
    if (!token) {
        next('/')
    } else {
        next()
    }
}

const guardRouteBackend = (to, from, next) => {
    const token = cookies.get('b_user') || !inBrowser
    if (!token) {
        next('/backend')
    } else {
        next()
    }
}

export function createRouter() {
    const router = new Router({

        // history 模式，需要服务器后端配合做路由代理，将所有的前端路由同步代理到 /
        mode: 'history',
        routes: [
            { name:'index', path: '/', component: index },
            { name:'trending', path: '/trending/:by', component: index },
            { name:'category', path: '/category/:id', component: index },
            { name:'search', path: '/search/:key', component: index },
            { name:'article', path: '/article/:id', component: article, meta: { notKeepAlive: true } },
            { name:'about', path: '/about', component: about },
            { name:'account', path: '/user/account', component: account, beforeEnter: guardRoute },
            { name:'password', path: '/user/password', component: password, beforeEnter: guardRoute },

            { name:'login', path: '/backend', component: login },

            { name:'admin_list', path: '/backend/admin/list', component: adminList, beforeEnter: guardRouteBackend },
            { name:'admin_modify', path: '/backend/admin/modify/:id', component: adminModify, meta: { notKeepAlive: true }, beforeEnter: guardRouteBackend },

            { name:'article_list', path: '/backend/article/list', component: articleList, beforeEnter: guardRouteBackend },
            { name:'article_insert', path: '/backend/article/insert', component: articleInsert, beforeEnter: guardRouteBackend },
            { name:'article_modify', path: '/backend/article/modify/:id', component: articleModify, meta: { notKeepAlive: true }, beforeEnter: guardRouteBackend },
            { name:'article_comment', path: '/backend/article/comment/:id', component: articleComment, meta: { notKeepAlive: true }, beforeEnter: guardRouteBackend },

            { name:'category_list', path: '/backend/category/list', component: categoryList, beforeEnter: guardRouteBackend },
            { name:'category_insert', path: '/backend/category/insert', component: categoryInsert, beforeEnter: guardRouteBackend },
            { name:'category_modify', path: '/backend/category/modify/:id', component: categoryModify, meta: { notKeepAlive: true }, beforeEnter: guardRouteBackend },

            { name:'user_list', path: '/backend/user/list', component: userList, beforeEnter: guardRouteBackend },
            { name:'user_modify', path: '/backend/user/modify/:id', component: userModify, meta: { notKeepAlive: true }, beforeEnter: guardRouteBackend },
        ]
    })

    /**
     * 切换动画名称
     *
     * @type {string}
     * @const
     */
    const SLIDE_LEFT = 'slide-left'

    /**
     * 切换动画名称
     *
     * @type {string}
     * @const
     */
    const SLIDE_RIGHT = 'slide-right'

    router.beforeEach((to, from, next) => {
        if (router.app.$store) {

            // 如果不需要切换动画，直接返回
            if (router.app.$store.state.appShell.needPageTransition) {

                // 判断当前是前进还是后退，添加不同的动画效果
                const pageTransitionName = isForward(to, from) ? SLIDE_LEFT : SLIDE_RIGHT
                router.app.$store.commit(`appShell/${types.SET_PAGE_TRANSITION_NAME}`, {pageTransitionName})
            }
        }
        next()
    })

    return router
}
