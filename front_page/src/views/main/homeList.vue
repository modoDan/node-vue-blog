<template>
  <div class="list-box">
    <div class="panel panel-default" v-for="content in contents">
        <div class="panel-body">
            <h2>{{content.title}}</h2>
            <p>
                作者：<span>{{content.user ? content.user.username : ''}}</span>
                时间：<span v-text="$formatDate(content.addTime)"></span>
                阅读：<span>{{content.views}}</span>
                评论：<span>{{content.comments.length}}</span>
            </p>
            <dfn>
                <p>{{content.description}}</p>
            </dfn>
            <div>
                <a @click="readDetail(content._id)">阅读全文</a>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
   data(){
    return{
     category:'',
     page:1,
     pages:0
    }
  },
  props: ['contents'],
  methods:{
    readDetail(viewid){
      this.$emit('read-detail',{
        contentid:viewid,
        category:this.category
      })
    }
  }
}
</script>

<style>

</style>
