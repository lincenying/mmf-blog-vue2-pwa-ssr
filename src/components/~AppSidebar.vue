<template>
    <sidebar v-model="sidebarStatus">
        <!-- sidebar 内容部分 -->
        <div
            class="app-sidebar-content">
            <!-- 头部 -->
            <div v-if="title" class="app-sidebar-title" @click.stop="closeAndGo('/')">
                <span class="app-sidebar-title-left-icon">
                    <img v-if="title.imageLeft" :src="title.imageLeft" :alt="title.altLeft"></img>
                    <icon v-else-if="title.svgLeft" :name="title.svgLeft"></icon>
                    <v-icon light v-else-if="title.iconLeft">{{ title.iconLeft }}</v-icon>
                </span>
                <span>{{ title.text }}</span>
                <slot name="logo" class="app-sidebar-title-right-logo">
                    <span class="app-sidebar-title-right-logo">
                        <img v-if="title.imageRight" :src="title.imageRight" :alt="title.altRight"></img>
                        <icon v-else-if="title.svgRight" :name="title.svgRight"></icon>
                        <v-icon v-else-if="title.iconRight">{{ title.iconRight }}</v-icon>
                    </span>
                </slot>
            </div>

            <!-- 用户信息 -->
            <div v-if="user" class="app-sidebar-user">
                 <div class="user-avatar">
                    <v-icon light class="user-avatar-icon">face</v-icon>
                 </div>
                 <div class="user-info">
                     <div class="user-name"><v-icon>person</v-icon>{{user.name}}</div>
                     <div class="user-location"><v-icon>room</v-icon>{{user.location}}</div>
                     <div class="user-email"><v-icon>email</v-icon>{{user.email}}</div>
                 </div>
            </div>

            <!-- 导航列表分区块 -->
            <div v-if="blocks" class="app-sidebar-blocks">
                <ul>
                    <!-- 单个区块 -->
                    <li v-for="(block, index) in blocks" :key="index" class="app-sidebar-block">
                        <div v-if="block.sublistTitle" class="sub-list-title">{{ block.sublistTitle }}</div>
                        <ul v-if="block.list">
                            <li v-for="item in block.list" :key="item.text" @click.stop="closeAndGo(item.route)">
                                <span v-if="item.icon || item.image || item.svg " class="app-sidebar-block-left-icon">
                                    <img v-if="item.image" :src="item.image" :alt="item.alt"></img>
                                    <icon v-else-if="item.svg" :name="item.svg"></icon>
                                    <v-icon v-else-if="item.icon">{{ item.icon }}</v-icon>
                                </span>
                                <span v-if="item.text" class="app-sidebar-block-text">{{ item.text }}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </sidebar>
</template>

<script>
import {mapState} from 'vuex';
import Sidebar from './Sidebar';

export default {
    components: {
        Sidebar
    },
    computed: {
        ...mapState('appShell/appSidebar', [
            'show',
            'title',
            'user',
            'blocks'
        ]),
        sidebarStatus: {
            get() {
                return this.show;
            },
            set(val) {
                if (val) {
                    this.$emit('show-sidebar');
                }
                else {
                    this.$emit('hide-sidebar');
                }
            }
        }
    },
    methods: {
        close() {
            this.sidebarStatus = false;
        },
        closeAndGo(route) {
            this.$router.push(route);
            this.close();
        }
    }
};
</script>

<style lang="stylus" scoped>
// 左侧触发滑动宽度
$swipe-width = 20px

ul,li
    padding 0
    margin 0
    list-style none
a
    text-decoration none
    color #333

.app-sidebar-content
    &.app-sidebar-content-right
        box-shadow -3px 0 8px 1px rgba(0, 0, 0, 0.4)

        &.app-sidebar-title,
        &.app-sidebar-blocks
            text-align right

    .app-sidebar-title-left-icon,
    .app-sidebar-block-left-icon
        display inline-block
        width ($app-sidebar-left-icon-size + 10)px
        height 100%

        img
            vertical-align middle
            width ($app-sidebar-left-icon-size)px
            height ($app-sidebar-left-icon-size)px
        svg
            position relative
            left 0
            top 0
            transform none
            vertical-align middle
            height ($app-sidebar-left-icon-size)px
            width ($app-sidebar-left-icon-size)px

        .material-icons
            font-size ($app-sidebar-left-icon-size)px

    .app-sidebar-block-text
        display inline-block
        height 100%
        vertical-align middle

    .app-sidebar-title-right-logo,
    .app-sidebar-block-right-logo
        float right

        img
            width 20px
            height 20px
            margin-right 10px


    .app-sidebar-title
        color #fff
        padding 0 10px
        font-size 16px
        font-weight bold
        height $app-sidebar-title-height
        line-height $app-sidebar-title-height
        background: $theme.primary
        text-align left

    .app-sidebar-user
        padding 0 10px
        font-size 16px
        .user-avatar
            margin 30px auto 0 auto
            height 100px
            width 100px
            i
                font-size 100px
                color #666
        .user-info
            padding 20px 0
            text-align center
            border-bottom 1px solid #e0e0e0
            >div
                margin 5px 0
                i
                    font-size 18px
                    margin-right 5px

    .app-sidebar-blocks
        text-align left

        .app-sidebar-block
            padding 10px 0
            border-bottom 1px solid #e0e0e0
            color #333

            .sub-list-title
                height $app-sidebar-nav-height
                line-height $app-sidebar-nav-height
                text-indent ($app-sidebar-left-icon-size)px
                font-weight bold
                color #888

            li
                padding-left 15px
                height $app-sidebar-nav-height
                line-height $app-sidebar-nav-height


                &:last-child
                    border none

            &:last-child
                border-bottom none
</style>
