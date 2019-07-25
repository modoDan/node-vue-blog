<template>
    <div class="user-index">
        <div class="container-fluid">
            <ol class="breadcrumb">
                <li><a href="/">管理首页</a></li>
                <li><span>用户列表</span></li>
            </ol>
            <h3>用户列表</h3>
            <table class="table table-hover table-striped">
                <tr>
                    <th>ID</th>
                    <th>用户名</th>
                    <th>密码</th>
                    <th>是否是管理员</th>
                </tr>
                <tr v-for="user in users">
                    <td>{{user._id.toString()}}</td>
                    <td>{{user.username}}</td>
                    <td>{{user.password}}</td>
                    <td>
                        {{user.isAdmin?'是':''}}
                    </td>
                </tr>
            </table>
            <page :pageLimit="pageLimit"></page>
        </div>
    </div>
</template>
<script>
import page from './page.vue'
import { USERINDEX } from '../../apis/admin.js'
export default {
    data() {
        return {
            userInfo: '',
            users: [],
            pageLimit: {}
        }
    },
    components: {
        page
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                //分页查询
                this.init(val.query.page)
            },
            deep: true
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        async init(page) {
            let user_info = await USERINDEX({
                page: page
            })
            this.users = user_info.users;
            this.pageLimit = { ...user_info, url: 'user_index' }
        }
    }
}
</script>
<style>
</style>