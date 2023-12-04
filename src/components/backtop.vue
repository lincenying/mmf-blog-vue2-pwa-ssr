<template>
    <div v-show="scrollTopGt" class="back-top"><a href="javascript:;" @click="handleBackTop"></a></div>
</template>

<script>
export default {
    name: 'BackTop',
    data() {
        return {
            scrollTop: 0
        }
    },
    computed: {
        scrollTopGt() {
            return this.scrollTop > 500
        }
    },
    mounted() {
        window.addEventListener('scroll', this.scrolling)
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.scrolling)
    },
    methods: {
        scrolling() {
            if (window.scrollTime)
                window.clearTimeout(window.scrollTime)
            window.scrollTime = window.setTimeout(() => {
                this.scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
            }, 100)
        },
        handleBackTop() {
            let top = this.scrollTop
            const timer = setInterval(() => {
                top -= Math.abs(top * 0.1)
                if (top <= 1) {
                    top = 0
                    clearInterval(timer)
                }
                window.scrollTo(0, top)
                // document.body.scrollTop = top
            }, 20)
        }
    }
}
</script>
