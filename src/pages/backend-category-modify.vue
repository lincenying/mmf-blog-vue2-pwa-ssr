<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <AInput title="分类名称">
                <input v-model="form.cate_name" type="text" placeholder="分类名称" class="base-input" name="cate_name">
                <span class="input-info error">请输入分类名称</span>
            </AInput>
            <AInput title="分类排序">
                <input v-model="form.cate_order" type="text" placeholder="分类排序" class="base-input" name="cate_order">
                <span class="input-info error">请输入分类排序</span>
            </AInput>
        </div>
        <div class="settings-footer">
            <a href="javascript:;" class="btn btn-yellow" @click="handleModify">编辑分类</a>
            <router-link to="/backend/category/list" class="btn btn-blue">返回</router-link>
        </div>
    </div>
</template>

<script>
// import api from '~api'
import { mapGetters } from 'vuex'
import aInput from '../components/_input.vue'
import { showMsg } from '@/utils'
import checkAdmin from '@/mixins/check-admin'

export default {
    name: 'BackendCategoryModify',
    components: {
        AInput: aInput,
    },
    mixins: [checkAdmin],
    async asyncData({ store, route }) {
        await store.dispatch('global/category/getCategoryItem', {
            path: route.path,
            id: route.params.id,
        })
    },
    data() {
        return {
            loading: false,
            form: {
                id: this.$route.params.id,
                cate_name: '',
                cate_order: '',
            },
        }
    },
    computed: {
        ...mapGetters({
            item: 'global/category/getCategoryItem',
        }),
    },
    watch: {
        item(val) {
            this.form.cate_name = val.data.cate_name
            this.form.cate_order = val.data.cate_order
        },
    },
    mounted() {
        this.form.cate_name = this.item.data.cate_name
        this.form.cate_order = this.item.data.cate_order
    },
    methods: {
        async handleModify() {
            if (this.loading)
                return
            if (!this.form.cate_name || !this.form.cate_order) {
                showMsg('请将表单填写完整!')
                return
            }
            this.loading = true
            const { code, data, message } = await this.$store.$api.post('backend/category/modify', this.form)
            this.loading = false
            if (code === 200 && data) {
                showMsg({ type: 'success', content: message })
                this.$store.commit('global/category/updateCategoryItem', data)
                this.$router.push('/backend/category/list')
            }
        },
    },
    metaInfo() {
        return {
            title: '编辑分类 - M.M.F 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'M.M.F 小屋' }],
        }
    },
}
</script>
