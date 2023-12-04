<template>
    <div class="card feed">
        <div class="feed-content">
            <div class="feed-source-time">
                <span class="feed-source">
                    来自分类 <router-link :to="`/category/${item.category}`" class="feed-minor-link">{{ item.category_name }}</router-link>
                </span>
                <span class="feed-time">{{ item.update_date }}</span>
            </div>
            <div class="feed-main-link-wrap"><router-link :to="`/article/${item._id}`" class="feed-main-link">{{ item.title }}</router-link></div>
            <div class="feed-desc-wrap"><div class="feed-article-content markdown-body" v-text="item.content"></div></div>
        </div>
        <Actions :item="item"></Actions>
    </div>
</template>

<script>
import actions from './item-actions.vue'

export default {
    name: 'TopicsItem',
    components: {
        Actions: actions
    },
    props: ['item'],
    data() {
        return {
            showMore: false
        }
    }
}
</script>
