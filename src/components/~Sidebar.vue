<template>
    <div class="sidebar-wrapper"
        ref="sidebarWrapper"
        :class="wrapperClass"
    >
        <div class="sidebar-scroller"
            ref="sidebarScroller"
            :style="{
                'padding-left': widthProp
            }"
        >
            <div class="sidebar-main"
                :style="{
                    width: widthProp
                }"
                @scroll.stop
            >
                <slot></slot>
            </div>
            <div class="touch-toggle"
                :style="{
                    'opacity': opacity,
                    'padding-left': widthProp
                }"
                ref="sidebarToggle"
                @touchstart="toggleTouchStart"
                @touchmove="toggleTouchMove"
                @click.stop.prevent="toggleClick"
            ></div>
        </div>
    </div>
</template>

<script>
import IScroll from 'iscroll/build/iscroll-lite';

let rAF = function (cb) {
    setTimeout(cb, 1000 / 60);
};

// 兼容服务器端渲染的情况
if (process.env.VUE_ENV === 'client') {
    rAF = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || rAF;
}

export default {
    props: {
        value: {
            'type': Boolean,
            'default': false
        },
        width: {
            'type': [Array, Number],
            'default': 300
        }
    },
    data() {
        return {
            showStatus: this.value,
            startX: 0,
            startY: 0,
            wrapperClass: {
                'wd-sidebar': true,
                'expand': false,
                'collapse': true,
                'w-left': true
            },
            opacity: 0,
            iscroll: null
        };
    },
    computed: {
        widthProp() {
            return this.width + 'px';
        }
    },
    watch: {
        value() {
            this.showStatus = this.value;
        },
        showStatus(val) {
            this.toggleScroll(val);
            this.$emit('input', val);
        }
    },
    methods: {
        toggleTouchStart(e) {
            if (this.wrapperClass.expand) {
                return;
            }

            let {clientX, clientY} = e.touches[0];
            this.startX = clientX;
            this.startY = clientY;
        },
        toggleTouchMove(e) {
            if (this.wrapperClass.expand) {
                return;
            }

            let {clientX, clientY} = e.touches[0];
            let x = clientX - this.startX;

            if (x > 5 && Math.abs(clientY - this.startY) / x < 0.577) {
                this.wrapperClass.expand = true;
                this.wrapperClass.collapse = false;

                this.$nextTick(() => {
                    this.bindScroll(e);
                });
            }
        },
        toggleClick(e) {
            if (this.iscroll) {
                this.forceToggleScroll(false);
            }
        },
        bindScroll(e) {
            if (this.$isServer || this.iscroll) {
                return;
            }

            this.iscroll = new IScroll(this.$refs.sidebarWrapper, {
                eventPassthrough: true,
                scrollY: false,
                scrollX: true,
                bounce: false,
                startX: -this.width
            });

            this.changeOpacity();

            this.iscroll.on('scrollEnd', () => {
                let {directionX, x} = this.iscroll;

                if (x === 0) {
                    this.showStatus = true;
                    return;
                }

                if (x === -this.width) {
                    this.showStatus = false;
                    this.unbindScroll();
                    return;
                }

                if (directionX > 0) {
                    this.forceToggleScroll(false);
                }
                else if (directionX < 0) {
                    this.forceToggleScroll(true);
                }
                else {
                    this.showStatus = !this.showStatus;
                }
            });

            e && this.iscroll._start(e);
        },
        unbindScroll() {
            if (!this.iscroll) {
                return;
            }

            this.iscroll.destroy();
            this.iscroll = null;
            this.wrapperClass.expand = false;
            this.wrapperClass.collapse = true;
            this.opacity = 0;
            this.$refs.sidebarScroller.setAttribute(
                'style',
                `padding-left:${this.widthProp}`
            );
        },
        toggleScroll(val) {
            if (val === true) {
                this.wrapperClass.expand = true;
                this.wrapperClass.collapse = false;

                this.$nextTick(() => {
                    if (!this.iscroll) {
                        this.bindScroll();
                    }

                    if (this.iscroll.x < 0) {
                        setTimeout(() => {
                            this.iscroll && this.iscroll.scrollTo(0, 0, 200);
                        }, 10);
                    }
                });
            }
            else {
                if (this.iscroll && this.iscroll.x > -this.width) {
                    setTimeout(() => {
                        this.iscroll.scrollTo(-this.width, 0, 200);
                    });
                }
            }
        },
        forceToggleScroll(val) {
            if (this.showStatus === val) {
                this.toggleScroll(val);
            }
            else {
                this.showStatus = val;
            }
        },
        changeOpacity() {
            if (this.wrapperClass.expand && this.iscroll) {
                this.opacity = (this.iscroll.x + this.width) / this.width * 0.5;
                rAF(this.changeOpacity.bind(this));
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
.sidebar-wrapper
    z-index 9999

    .sidebar-main
        overflow-y auto
        overflow-x hidden
        box-sizing border-box
        z-index 25
        display none
        background #fff
        height 0
        top 0

    .touch-toggle
        position fixed
        top 0
        bottom 0
        left 0
        width 45px
        z-index 100
        opacity 0
        transition opacity .3s

    &.collapse
        // z-index 0
        margin-top 0 !important
        .sidebar-scroller
            padding-left 0 !important
        .touch-toggle
            padding-left 0 !important
            top 64px

    &.expand
        position fixed
        top 0
        right 0
        bottom 0
        left 0
        z-index 150
        overflow hidden
        box-shadow 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px rgba(0, 0, 0, .14), 0 1px 10px rgba(0, 0, 0, .12)

        .sidebar-scroller
            width 100%
            height 100%
            white-space nowrap
            position relative
            box-sizing content-box

        .sidebar-main
            display block
            height 100%
            position absolute
            top 0
            right auto
            bottom 0
            left 0
            overflow auto

        .touch-toggle
            position static
            width 100%
            height 100%
            background #212121
            opacity .5

</style>
