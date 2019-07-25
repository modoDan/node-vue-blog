<template>
    <div class="header-box">
        <h1 class="blogBg">hello to my blog !!</h1>
        <ul class="nav nav-pills nav-header">
            <li role="presentation" :class="{'active':category == ''}"><a href="/">首页</a>
            <li role="presentation" v-for="cate in categories" :class="{'active':category == cate._id}">
                <a href="#" @click="menuSelect(cate._id)">{{cate.name}}</a>
            </li>
        </ul>
    </div>
</template>
<script>
import { MAIN } from '../../apis/main.js'
export default {
    data() {
        return {

        }
    },
    props: ['categories', 'category'],
    methods: {
        async menuSelect(cateid) {
            let main_info = await MAIN({
                category: cateid,
            });
            if (!main_info.code) {
                this.$emit('new-cate', main_info)
            }
        }
    }
}
</script>
<style>
</style>