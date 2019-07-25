<template>
    <div class="page-box">
        <div class="panel panel-default" v-if="pageLimit.count">
            <nav aria-label="...">
                <ul class="pager">
                    <li class="previous" v-if="pageLimit.page<=1"><span>没有上一页了</span></li>
                    <li class="previous" v-else><a href="#" @click="pageCheck(pageLimit.page-1)">&larr;上一页</a></li>
                    <li v-show="pageLimit.pages>0"><strong>{{pageLimit.page}}/{{pageLimit.pages}}</strong></li>
                    <li class="next" v-if="pageLimit.page>=pageLimit.pages"><span>没有下一页了</span></li>
                    <li class="next" v-else><a href="#" @click="pageCheck(pageLimit.page+1)">&rarr;下一页</a></li>
                </ul>
            </nav>
        </div>
        <div v-else>
            暂无数据
        </div>
    </div>
</template>
<script>
import { MAIN } from '../../apis/main.js'
export default {
    data() {
        return {

        }
    },
    props: ['pageLimit', 'category'],
    methods: {
        async pageCheck(page) {
            let main_info = await MAIN({
                category: this.category,
                page: page
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