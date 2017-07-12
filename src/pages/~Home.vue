<template>
    <div>
        <h2 class="gray--text">LAVAS</h2>
        <h4 class="gray--text">[ˈlɑ:vəz]</h4>
    </div>
</template>

<script>
const state = {
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
    activateBottomNav: 'home'
}

function setState(store) {
    store.dispatch('appShell/appHeader/setAppHeader', state.appHeaderState)
    store.dispatch('appShell/appBottomNavigator/activateBottomNav', state.activateBottomNav)
    store.dispatch('appShell/appBottomNavigator/showBottomNav')
}

export default {
    name: 'home',
    async asyncData({store, route}) {
        setState(store)
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 500)
        })
    },
    activated() {
        setState(this.$store)
    }
}
</script>

<style lang="stylus" scoped>
h2
    margin-top 50%
    font-size 46px
    font-weight 500

</style>
