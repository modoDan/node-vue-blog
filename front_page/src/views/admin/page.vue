<template>
    <div class="user-index">
        <nav aria-label="...">
            <ul class="pager">
                <li class="previous">
                    <span v-if="pageLimit.page<=1">没有上一页了</span>
                    <router-link :to="{ path: pageLimit.url, query: { page: pageLimit.page-1 }}" v-else>&larr;上一页</router-link>
                </li>
                <li>一共有{{pageLimit.count}}条数据，每页显示{{pageLimit.limit}}条数据，一共{{pageLimit.pages}}页，当前第{{pageLimit.page}}页</li>
                <li class="next">
                    <span v-if="pageLimit.page>=pageLimit.pages">没有下一页了</span>
                    <router-link :to="{ path: pageLimit.url, query: { page: pageLimit.page+1 }}" v-else>&rarr;下一页</router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    props:['pageLimit'],
    mounted() {
    },
    methods: {
       
    }
}
</script>
<style>
</style>