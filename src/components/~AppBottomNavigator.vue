<template>
    <transition
        name="slide-up">
        <footer class="app-bottom-navigator-wrapper" v-show="show && navs.length">
            <slot name="navs">
                <v-bottom-nav
                    :value="show"
                    absolute
                    class="transparent">
                    <v-btn
                        v-for="nav in navs"
                        :key="nav.name"
                        :value="nav.active"
                        @click.native="handleNavClick(nav.route, nav.name)"
                        flat primary>
                        <span>{{ nav.text }}</span>
                        <icon v-if="nav.svg" :name="nav.svg" class="app-header-icon"></icon>
                        <v-icon v-else-if="nav.icon" class="app-header-icon">{{ nav.icon }}</v-icon>
                    </v-btn>
                </v-bottom-nav>
            </slot>
        </footer>
    </transition>
</template>

<script>
import {mapState} from 'vuex'
import EventBus from '@/event-bus'

export default {
    name: 'app-bottom-navigator',
    computed: {
        ...mapState('appShell/appBottomNavigator', [
            'show',
            'navs'
        ])
    },
    methods: {

        /**
         * 处理底部导航栏的点击行为，跳转到新页面
         *
         * @param {Object} route route
         * @param {string} name 触发的底部导航栏的 name
         */
        handleNavClick(route, name) {
            const eventData = {name}

            // 发送给父组件，内部处理
            this.$emit('click-nav', eventData)

            // 发送全局事件，便于非父子关系的路由组件监听
            EventBus.$emit('app-bottom-navigator:click-nav', eventData)
            if (route) {
                this.$router.replace(route)
            }
        }

    }
}
</script>

<style lang="stylus" scoped>

.app-bottom-navigator-wrapper
    height $app-footer-height
    transition transform 0.3s ease-out

    &.slide-up-enter,
    &.slide-up-leave-to
        transform translate(0, 100%)

</style>
