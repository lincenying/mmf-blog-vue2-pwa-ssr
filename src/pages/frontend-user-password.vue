<template>
    <div class="main wrap">
        <div class="main-left">
            <div class="home-feeds cards-wrap">
                <div class="settings-main card">
                    <div class="settings-main-content">
                        <AInput title="当前密码">
                            <input v-model="form.old_password" type="password" placeholder="当前密码" class="base-input" name="old_password" />
                        </AInput>
                        <AInput title="新的密码">
                            <input v-model="form.password" type="password" placeholder="新的密码" class="base-input" name="password" />
                        </AInput>
                        <AInput title="确认密码">
                            <input v-model="form.re_password" type="password" placeholder="确认密码" class="base-input" name="re_password" />
                        </AInput>
                    </div>
                    <div class="settings-footer"><a href="javascript:;" class="btn btn-yellow" @click="handleModify">保存设置</a></div>
                </div>
            </div>
        </div>
        <div class="main-right"><Account></Account></div>
    </div>
</template>

<script>
// import api from '~api'
import { showMsg } from '@/utils'
import metaMixin from '@/mixins'
import checkUser from '@/mixins/check-user'
import account from '@/components/aside-account.vue'
import aInput from '@/components/_input.vue'

export default {
    name: 'FrontendUserPassword',
    components: {
        AInput: aInput,
        Account: account
    },
    mixins: [metaMixin, checkUser],
    data() {
        return {
            loading: false,
            form: {
                old_password: '',
                password: '',
                re_password: ''
            }
        }
    },
    methods: {
        async handleModify() {
            if (this.loading)
                return
            if (!this.form.password || !this.form.old_password || !this.form.re_password) {
                showMsg('请将表单填写完整!')
                return
            } else if (this.form.password !== this.form.re_password) {
                showMsg('两次密码输入不一致!')
                return
            }
            this.loading = true
            const { code, message } = await this.$store.$api.post('frontend/user/password', this.form)
            this.loading = false
            if (code === 200) {
                showMsg({ type: 'success', content: message })
                this.form.old_password = ''
                this.form.password = ''
                this.form.re_password = ''
            }
        }
    },
    metaInfo() {
        return {
            title: '密码 - M.M.F 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'M.M.F 小屋' }]
        }
    }
}
</script>
