<template>
    <div class="admin-container">
        <header-box></header-box>  
        <router-view></router-view>
    </div>
</template>
<script>
import headerBox from './headerBox.vue'
export default {
  data(){
    return{
      userInfo:''
    }
  },
    components: {
      headerBox
    },
    mounted(){
    },
    methods:{
      
    }
}
</script>
<style>
</style>