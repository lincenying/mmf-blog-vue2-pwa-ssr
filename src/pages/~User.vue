<template>
    <div class="app-user-page">
        <div class="app-user-title text-xs-center">
            <div class="user-avatar">
                <p>
                    <v-icon light class="user-avatar-icon">face</v-icon>
                </p>
                <p>Lavas</p>
            </div>
            <v-list two-line>
                <v-list-item v-for="item in items" :key="item.title">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <span class="user-item-count" v-if="item.count">{{ item.count }}</span>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-item>
            </v-list>
        </div>
    </div>
</template>

<script>
let state = {
    appHeaderState: {
        show: true,
        title: 'Lavas',
        showMenu: true,
        showBack: false,
        showLogo: true,
        actions: [
            {
                icon: 'search',
                route: '/search'
            }
        ]
    },
    activateBottomNav: 'user'
};

function setState(store) {
    store.dispatch('appShell/appHeader/setAppHeader', state.appHeaderState);
    store.dispatch('appShell/appBottomNavigator/activateBottomNav', state.activateBottomNav);
    store.dispatch('appShell/appBottomNavigator/showBottomNav');
}


export default {
    name: 'user',
    async asyncData({store, route}) {
        setState(store);
    },
    data() {
        return {
            items: [
                {
                    title: 'Photos',
                    icon: 'photo_library',
                    subtitle: 'Jan 9, 2014'
                },
                {
                    title: 'Favorites',
                    icon: 'favorite',
                    subtitle: 'Feb 9, 2016'
                },
                {
                    title: 'Work',
                    icon: 'work',
                    subtitle: 'Nov 9, 2017'
                }
            ]
        };
    },
    activated() {
        setState(this.$store);
    }
};
</script>

<style lang="stylus" scoped>

.user-avatar
    color #333
    margin 50px auto 20px
    display flex
    justify-content center
    flex-direction column

    &-icon
        width 80px
        height 80px
        border-radius 50%
        background #666
        font-size 70px

.user-item-count
    height 24px
    width 24px
    border-radius 24px
    background #ccc
    font-size 14px
    line-height 24px
    color #fff
    font-weight bold
    vertical-align middle

</style>
