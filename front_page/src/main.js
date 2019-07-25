import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import axios from "axios";
import store from "./store"

Vue.prototype.$axios = axios;
Vue.config.productionTip = false
//全局引用日历组件
import myCalender from './components/calender/index.js'
Vue.use(myCalender);
//日历格式
import {formatDate} from './components/utils/tools';
Vue.prototype.$formatDate = formatDate;

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import './icons'
//import * as serviceWorker from './serviceWorker';
 if ('serviceWorker' in navigator) {
     window.addEventListener('load', function () {
         navigator.serviceWorker.register('/sw.js', {scope: '/'})
             .then(function (registration) {

                 // 注册成功
                 console.log('ServiceWorker registration successful with scope: ', registration.scope);
             })
             .catch(function (err) {

                 // 注册失败:(
                 console.log('ServiceWorker registration failed: ', err);
             });
     });
 }
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
