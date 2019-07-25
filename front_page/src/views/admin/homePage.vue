<template>
    <div class="home-page">
        <div class="container-fluid">
            <div class="jumbotron">
                <h1>Hello, {{username}}!</h1>
                <p>欢迎进入我的博客后台管理!!!</p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations,mapGetters} from 'vuex'
import { ADMIN } from '../../apis/admin.js'
export default {
    data() {
        return {
        }
    },
    computed:{
        ...mapGetters([
          'username',
        ])
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            let admin_info = await ADMIN();
            this.GET_INFO(admin_info.userInfo)
            console.log(this.$cookies.get('userInfo'))
        },
        ...mapMutations([
          'GET_INFO', // 将 `this.GET_INFO()` 映射为 `this.$store.commit('GET_INFO')`
        ]),
    }
}
</script>
<style>
</style>