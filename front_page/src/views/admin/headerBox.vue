<template>
    <div class="header-box">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link to="/home_page">
                        <a class="navbar-brand" href="#">后台管理</a>
                    </router-link>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li>
                            <router-link to="/user_index">
                                用户管理
                            </router-link>
                        </li>
                        <li class="dropdown" v-for="menu in menuList" :class="{'open':menu.open}">
                            <a href="#" class="dropdown-toggle" 
                            data-toggle="dropdown" role="button" 
                            aria-haspopup="true" aria-expanded="false" 
                            @click="openDrop(menu)" 
                            v-clickoutside="() => menu.open = false">{{menu.name}}
                            <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li v-for="child in menu.child">
                                    <router-link :to="child.url">
                                        {{child.name}}
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown" :class="{'open':isExit}">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                            @click="openExit()" 
                            v-clickoutside="() => isExit = false">{{username}}<span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li>
                                    <router-link to="/main_index">退出</router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import clickoutside from '../../components/utils/clickoutside';
export default {
    data() {
        return {
            isExit:false,
            menuList: [{
                name: '分类管理',
                open: false,
                child: [
                    { name: '分类首页', url: 'category_index' },
                    { name: '添加分类', url: 'category_edit' },
                ]
            }, {
                name: '内容管理',
                open: false,
                child: [
                    { name: '内容首页', url: 'content_index' },
                    { name: '添加内容', url: 'content_edit' },
                ]
            }]
        }
    },
    directives: {
        clickoutside
    },
    computed:{
        ...mapGetters([
          'username'
        ])
    },
    mounted() {},
    methods: {
        openDrop(item) {
            this.$set(item, 'open', true)
        },
        openExit(){
            this.isExit = true;
        }
    }
}
</script>
<style>
</style>