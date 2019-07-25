<template>
    <div class="category-index">
        <div class="container-fluid">
            <ol class="breadcrumb">
                <li><a href="/">管理首页</a></li>
                <li><span>分类列表</span></li>
            </ol>
            <h3>分类列表</h3>
            <table class="table table-hover table-striped">
                <tr>
                    <th>ID</th>
                    <th>分类名称</th>
                    <th>操作</th>
                </tr>
                <tr v-for="category in categories">
                    <td>{{category._id}}</td>
                    <td>{{category.name}}</td>
                    <td>
                        <router-link :to="{path:'/category_edit',query:{id:category._id}}">修改</router-link> |
                        <a href="#" @click="deleteCategory(category._id)">删除</a>
                    </td>
                </tr>
            </table>
            <page :pageLimit="pageLimit"></page>
        </div>
    </div>
</template>
<script>
import page from './page.vue'
import { CATEGORYINDEX, CATEDELETE } from '../../apis/admin.js'
export default {
    data() {
        return {
            categories: [],
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
            let cate_info = await CATEGORYINDEX({
                page: pageid
            })
            let { categories, page, pages, count, limit } = cate_info;
            this.categories = categories;
            this.pageLimit = { page, pages, count, limit, url: 'category_index' }
        },
        async deleteCategory(id) {
            await CATEDELETE({
                id: id
            })
            this.categories.forEach((item, index) => {
                if (item._id == id) {
                    this.categories.splice(index, 1)
                }
            })
        }
    }
}
</script>
<style>
</style>