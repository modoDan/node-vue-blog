<template>
    <div class="login-box">
        <div v-if="userInfo._id" id="userInfo" class="panel panel-default">
            <div class="panel-body">
                <h4 class="line-header">
                        用户信息
                    </h4>
                <div>
                    <p>
                        <svg-icon icon-class="user" />
                        <span class="username">{{userInfo.username}}</span>
                    </p>
                    <p v-if="userInfo.isAdmin">
                        <span class="info">你好，管理员!</span>
                        <router-link to="/home_page">进入管理页面</router-link>
                    </p>
                    <p v-else><span class="info">欢迎光临我的blog!</span></p>
                    <p><a href="" class="logout" @click="logoutBtn()">退出登录</a></p>
                </div>
            </div>
        </div>
        <div v-else class="boxStatus">
            <div class="panel panel-default">
                <div class="panel-body">
                    <h4 class="line-header">
                          {{isRegister ? '注册' : '登录'}}
                      </h4>
                    <div class="user-box panel-body">
                        <p><label for="username">用户名：</label><input type="text" name="username" id="username" class="input-form" v-model="username">
                        </p>
                        <p><label for="password">密码：</label><input type="password" name="password" id="password" class="input-form" v-model="password">
                        </p>
                        <p v-show="isRegister"><label for="repassword">确认密码：</label><input type="password" name="repassword" id="repassword" class="input-form" v-model="repassword">
                        </p>
                        <p><input type="submit" name="submit" v-model="submitValue" @click="submitBtn()"></p>
                    </div>
                    <div v-if="!isRegister">还没注册&nbsp;|&nbsp;<a class="registerBtn" @click="chooseStatus">马上注册</a></div>
                    <div v-else>已有账号&nbsp;|&nbsp;<a class="loginBtn" @click="chooseStatus">点击登录</a></div>
                </div>
            </div>
            <div class="tiptext" v-show="showTips">{{tipMsgs}}</div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { REGISTER } from '../../apis/api.js'
export default {
    data() {
        return {
            showTips: false,
            isRegister: false,
            repassword: '',
            password: '',
            username: '',
            tipMsgs: ''
        }
    },
    computed: {
        submitValue() {
            return this.isRegister ? 'Register' : 'Login';
        },
        ...mapState({
            userInfo: state => state.main.userInfo
        })
    },
    mounted() {

    },
    methods: {
        ...mapActions([
            'GetLogin', // 将 `this.GetLogin()` 映射为 `this.$store.dispatch('GetLogin')`
        ]),
        chooseStatus() {
            this.isRegister = !this.isRegister
        },
        logoutBtn() {
            this.$store.dispatch("GetLogout");
        },
        async submitBtn() {
            if (this.isRegister) {
                let register_info = await REGISTER({
                    password: this.password,
                    repassword: this.repassword,
                    username: this.username,
                })
                if (!register_info.code) {
                    this.isRegister = false;
                    this.password = ''
                    this.repassword = ''
                    this.username = ''
                    this.showTips = false
                } else {
                    this.tipMsgs = register_info.message
                    this.showTips = true
                }
            } else {
                this.GetLogin({
                    password: this.password,
                    username: this.username,
                }).then((res) => {
                    if (!res.code) {
                        this.showTips = false
                    } else {
                        this.tipMsgs = res.message
                        this.showTips = true
                    }
                });
            }
        }
    }
}
</script>
<style>
</style>