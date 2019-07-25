<template>
    <div class="content-index">
        <div class="container-fluid">
            <ol class="breadcrumb">
                <li><a href="/">管理首页</a></li>
                <li><span>内容列表</span></li>
            </ol>
            <h3>内容列表</h3>
            <table class="table table-hover table-striped">
                <tr>
                    <th>ID</th>
                    <th>分类名称</th>
                    <th>标题</th>
                    <th>作者</th>
                    <th>添加时间</th>
                    <th>阅读量</th>
                    <th>操作</th>
                </tr>
                <tr v-for="content in contents">
                    <td>{{content._id}}</td>
                    <td>{{content.category?content.category.name:''}}</td>
                    <td>{{content.title}}</td>
                    <td>{{content.user?content.user.username:''}}</td>
                    <td>{{$formatDate(content.addTime)}}</td>
                    <td>{{content.views}}</td>
                    <td>
                        <router-link :to="{path:'/content_edit',query:{id:content._id}}">修改</router-link> |
                        <a href="#" @click="deleteContent(content._id)">删除</a>
                    </td>
                </tr>
            </table>
            <page :pageLimit="pageLimit"></page>
        </div>
    </div>
</template>
<script>
import page from './page.vue'
import { CONTENTINDEX, CONTENTDELETE } from '../../apis/admin.js'
export default {
    data() {
        return {
            contents: [],
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
        async init(pageid) {
            let content_info = await CONTENTINDEX({
                page: pageid
            })
            let { contents, page, pages, count, limit } = content_info;
            this.contents = contents;
            this.pageLimit = { page, pages, count, limit, url: 'content_index' }
        },
        async deleteContent(id) {
            await CONTENTDELETE({
                id: id
            })
            this.contents.forEach((item, index) => {
                if (item._id == id) {
                    this.contents.splice(index, 1)
                }
            })
        }
    }
}
</script>
<style>
</style>