<template>
    <div class="tips-box">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">{{tipsMsg.url?'成功':'错误'}}提示</h3>
            </div>
            <div class="panel-body">
                {{tipsMsg.message}}
            </div>
            <div class="pannel-footer">
                <router-link :to="tipsMsg.toUrl" v-if="tipsMsg.url">点击这里跳转</router-link>
                <a href="javascript:window.history.back();" v-else>返回上一步</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    props:['tipsMsg'],
    mounted() {},
    methods: {}
}
</script>
<style>
</style>