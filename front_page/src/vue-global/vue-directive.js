/**
 * 全局自定义指令
 * */
import Vue from 'vue'

//  html5的autofocus在移动版safari不工作
Vue.directive('focus', {
  //  被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
  inserted: function (el) {
    el.focus()
  }
})
