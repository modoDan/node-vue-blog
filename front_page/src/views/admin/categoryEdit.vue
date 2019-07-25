<template>
    <div class="category-edit">
        <div class="container-fluid">
            <ol class="breadcrumb">
                <li><a href="/">管理首页</a></li>
                <li>
                    <span v-if="!isSubmit">分类{{categoryId?'编辑':'添加'}}</span>
                    <span v-else>{{isSuccess?'成功':'失败'}}提示</span>
                </li>
            </ol>
            <div class="text-content" v-if="!isSubmit">
                <h3 v-if="categoryId">分类编辑 -- {{categoryName}}</h3>
                <h3 v-else>分类添加</h3>
                <div class="form-group">
                    <label for="name">分类名称：</label>
                    <input type="text" class="form-control" id="name" placeholder="请输入分类名称" name="name" v-model="categoryName">
                </div>
                <button type="submit" class="btn btn-default" @click="categorySave(categoryId)">提交</button>
            </div>
            <tips v-else :tipsMsg="tipsMsg"></tips>
        </div>
    </div>
</template>
<script>
import tips from './tips.vue'
import { GETCATEADD, POSTCATEADD, GETCATEEDIT, POSTCATEEDIT } from '../../apis/admin.js'
export default {
    data() {
        return {
            categoryName: '',
            isSuccess: '',
            isSubmit: false,
            tipsMsg: ''
        }
    },
    components: {
        tips
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                //编辑查询
                this.init(val.query.id)
            },
            deep: true
        }
    },
    computed: {
        categoryId() {
            return this.$route.query.id ? this.$route.query.id : ''
        }
    },
    mounted() {
        this.init(this.categoryId)
    },
    methods: {
        async init(id) {
            if (id) {
                let cate_info = await GETCATEEDIT({
                    id: id
                })
                this.categoryName = cate_info.category.name;
            } else {
                await GETCATEADD();
                this.categoryName = ''
            }
        },
        async categorySave(id) {
            this.isSubmit = true
            if (id) {
                let cate_info = await POSTCATEEDIT({
                    id: id,
                    name: this.categoryName
                })
                this.isSuccess = cate_info.url;
                this.tipsMsg = { ...cate_info, toUrl: 'category_index' };
            } else {
                let cate_info = await POSTCATEADD({
                    name: this.categoryName
                })
                this.isSuccess = cate_info.url;
                this.tipsMsg = { ...cate_info, toUrl: 'category_index' };
            }
        }
    }
}
</script>
<style>
</style>