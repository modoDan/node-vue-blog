<template>
    <div class="category-edit">
        <div class="container-fluid">
            <ol class="breadcrumb">
                <li><a href="/">管理首页</a></li>
                <li>
                    <span v-if="!isSubmit">内容{{contentId?'编辑':'添加'}}</span>
                    <span v-else>{{isSuccess?'成功':'失败'}}提示</span>
                </li>
            </ol>
            <div class="text-content" v-if="!isSubmit">
                <h3>内容添加</h3>
                <div class="form-group">
                    <label for="name">分类：</label>
                    <select name="category" id="category" class="form-control" v-model="categoryId">
                        <option :value="category._id" v-for="category in categories">{{category.name}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="name">标题：</label>
                    <input type="text" class="form-control" id="title" placeholder="请输入内容标题" name="title" v-model="formTitle">
                </div>
                <div class="form-group">
                    <label for="name">简介：</label>
                    <textarea type="text" class="form-control" rows="5" id="description" placeholder="请输入内容简介" name="description" v-model="formDescript"></textarea>
                </div>
                <div class="form-group">
                    <label for="name">内容：</label>
                    <textarea type="text" class="form-control" rows="10" id="content" placeholder="请输入内容" name="content" v-model="formContent"></textarea>
                </div>
                <button type="submit" class="btn btn-default" @click="contentSave(contentId)">提交</button>
            </div>
            <tips v-else :tipsMsg="tipsMsg"></tips>
        </div>
    </div>
</template>
<script>
import tips from './tips.vue'
import { GETCONTENTADD, POSTCONTENTADD, GETCONTENTEDIT, POSTCONTENTEDIT } from '../../apis/admin.js'
export default {
    data() {
        return {
            categories: [],
            isSuccess: '',
            isSubmit: false,
            tipsMsg: '',
            formTitle: '',
            formDescript: '',
            formContent: '',
            categoryId: ''
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
        contentId() {
            return this.$route.query.id ? this.$route.query.id : ''
        },
    },
    mounted() {
        this.init(this.contentId)
    },
    methods: {
        async init(id) {
            if (id) {
                let content_info = await GETCONTENTEDIT({
                    id: id
                })
                let { content, categories } = content_info;
                this.categories = categories
                this.content = content
                this.categoryId = content.category ? content.category._id : '';
                this.formTitle = content.title;
                this.formDescript = content.description;
                this.formContent = content.content
            } else {
                let content_info = await GETCONTENTADD();
                let { categories } = content_info;
                this.categories = categories
                this.categoryId = categories[0]._id
            }
        },
        async contentSave(id) {
            this.isSubmit = true
            if (id) {
                let content_info = await POSTCONTENTEDIT({
                    id: id,
                    category: this.categoryId,
                    title: this.formTitle,
                    description: this.formDescript,
                    content: this.formContent,
                })
                this.isSuccess = content_info.url;
                this.tipsMsg = { ...content_info, toUrl: 'content_index' };
            } else {
                let content_info = await POSTCONTENTADD({
                    category: this.categoryId,
                    title: this.formTitle,
                    description: this.formDescript,
                    content: this.formContent,
                })
                this.isSuccess = content_info.url;
                this.tipsMsg = { ...content_info, toUrl: 'content_index' };
            }
        }
    }
}
</script>
<style>
</style>