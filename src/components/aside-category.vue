<template>
    <div class="card card-topics">
        <template v-for="item in category">
            <router-link :key="item._id" :to="`/category/${item._id}`" class="topic-item">
                <span class="avatar-link"><img src="/static/images/topic-1.png" class="avatar-image"></span>
                <div>
                    <h3 class="topic-title">{{ item.cate_name }}</h3>
                    <p class="topic-meta">{{ item.cate_num || 0 }} 篇文章</p>
                    <i class="icon icon-arrow-right"></i>
                </div>
            </router-link>
        </template>
    </div>
</template>

<script>
export default {
    name: 'AsideCategory',
    props: ['category'],
    serverCacheKey: () => {
        return `aside::category`
    },
}
</script>
