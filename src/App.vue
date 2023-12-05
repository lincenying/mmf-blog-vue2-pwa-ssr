<template>
    <div id="app" :class="backend ? 'backend' : 'frontend'">
        <Navigation :backend="backend"></Navigation>
        <template v-if="!backend">
            <transition :name="appShell.pageTransitionName" mode="out-in" @before-enter="handleBeforeEnter" @after-enter="handleAfterEnter">
                <keep-alive :include="cacheFronentComponents"> <router-view :key="key" class="app-view" /> </keep-alive>
            </transition>
            <SignUp :show="global.showRegisterModal"></SignUp>
            <SignIn :show="global.showLoginModal"></SignIn>
            <BackTop></BackTop>
        </template>
        <div v-else class="main wrap">
            <div class="main-left">
                <div class="home-feeds cards-wrap">
                    <transition :name="appShell.pageTransitionName" mode="out-in" @before-enter="handleBeforeEnter" @after-enter="handleAfterEnter">
                        <keep-alive :include="cacheBackendComponents"> <router-view class="app-view" /> </keep-alive>
                    </transition>
                </div>
            </div>
            <BackendMenu v-if="!isLogin"></BackendMenu>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Navigation from './components/navigation.vue'
import signUp from './components/signup.vue'
import signIn from './components/signin.vue'
import backTop from './components/backtop.vue'
import backendMenu from './components/backend-menu.vue'

export default {
    name: 'App',
    components: {
        Navigation,
        SignUp: signUp,
        SignIn: signIn,
        BackTop: backTop,
        BackendMenu: backendMenu,
    },
    data() {
        return {
            // 需要缓存的路由组件 name
            cacheFronentComponents: 'frontend-index,frontend-about',
            cacheBackendComponents: 'backend-admin-list,backend-article-list,backend-user-list',
        }
    },
    computed: {
        ...mapGetters({
            global: 'global/get',
            appShell: 'appShell/get',
        }),
        key() {
            return this.$route.path.replace(/\//g, '_')
        },
        backend() {
            return this.$route.path.includes('backend')
        },
        isLogin() {
            return ['/backend', '/backend/'].includes(this.$route.path)
        },
    },
    methods: {
        handleBeforeEnter() {
            this.$store.dispatch('appShell/setPageSwitching', true)
        },
        handleAfterEnter() {
            this.$store.dispatch('appShell/setPageSwitching', false)
        },
        handleClickHeaderBack() {
            this.$router.go(-1)
        },
    },
}
</script>
