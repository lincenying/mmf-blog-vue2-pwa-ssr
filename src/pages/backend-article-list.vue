<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <div class="list-section list-header">
                <div class="list-title">标题</div>
                <div class="list-category">分类</div>
                <div class="list-date">最后更新</div>
                <div class="list-action">操作</div>
            </div>
            <div v-for="item in topics.data" :key="item._id" class="list-section">
                <div class="list-title">{{ item.title }}</div>
                <div class="list-category">{{ item.category_name }}</div>
                <div class="list-date">{{ item.update_date | timeAgo }}</div>
                <div class="list-action">
                    <router-link :to="`/backend/article/modify/${item._id}`" class="badge badge-success">编辑</router-link>
                    <a v-if="item.is_delete" href="javascript:;" @click="handleRecover(item._id)">恢复</a>
                    <a v-else href="javascript:;" @click="handleDelete(item._id)">删除</a>
                    <router-link v-if="item.comment_count > 0" :to="`/backend/article/comment/${item._id}`" class="badge badge-success">评论</router-link>
                </div>
            </div>
        </div>
        <div v-if="topics.hasNext" class="settings-footer">
            <a v-if="!loading" class="admin-load-more" href="javascript:;" @click="loadMore()">加载更多</a>
            <a v-else class="admin-load-more" href="javascript:;">加载中...</a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { showMsg } from '@/utils'

// import api from '~api'
import checkAdmin from '@/mixins/check-admin'

export default {
    name: 'BackendArticleList',
    mixins: [checkAdmin],
    async asyncData({ store, route }, config = { page: 1 }) {
        await store.dispatch('backend/article/getArticleList', {
            ...config,
            path: route.path,
        })
    },
    data() {
        return {
            loading: false,
        }
    },
    computed: {
        ...mapGetters({
            topics: 'backend/article/getArticleList',
        }),
    },
    mounted() {},
    methods: {
        async loadMore(page = this.topics.page + 1) {
            this.loading = true
            await this.$options.asyncData({ store: this.$store, route: this.$route }, { page })
            this.loading = false
        },
        async handleRecover(id) {
            const { code, message } = await this.$store.$api.get('backend/article/recover', { id })
            if (code === 200) {
                showMsg({ type: 'success', content: message })
                this.$store.commit('backend/article/recoverArticle', id)
            }
        },
        async handleDelete(id) {
            const { code, message } = await this.$store.$api.get('backend/article/delete', { id })
            if (code === 200) {
                showMsg({ type: 'success', content: message })
                this.$store.commit('backend/article/deleteArticle', id)
            }
        },
    },
    metaInfo() {
        return {
            title: '文章列表 - M.M.F 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'M.M.F 小屋' }],
        }
    },
}
</script>
