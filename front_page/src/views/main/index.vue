<template>
  <div class="main-container">
    <header-box :categories="categories" :category="category" @new-cate="newCategory"></header-box>
    <section>
        <div class="nav-left">
            <div v-if="!isView">
              <home-list :contents="contents" @read-detail="goView"></home-list>
              <page-box :pageLimit="pageLimit" :category="category" @new-cate="newCategory"></page-box>
            </div>
            <view-detail :query="viewQuery" v-else></view-detail>
                
        </div>
        <div class="nav-right">
          <login-box></login-box>
          <my-calender :options="options"></my-calender>
        </div>
    </section>
  </div>
</template>

<script>
import viewDetail from './viewDetail.vue'
import homeList from './homeList.vue'
import loginBox from './loginBox.vue'
import headerBox from './headerBox.vue'
import pageBox from './pageBox.vue'
import { mapGetters , mapMutations } from 'vuex'
import { MAIN } from '../../apis/main.js'
export default {
  data(){
    return{
      category:'',
      categories:[],
      contents:[],
      pageLimit:{},
      viewQuery:'',
      isView:false,
      options: {
        dateType: 'day',
        compareTime: ['2018-10-01', '2018-09-01', '2018-08-21', '2018-07-09'],
        events: this.pickDate, 
        text: '',
        styles: 'tipClass'
      },
    }
  },
  components: {
    viewDetail,
    homeList,
    loginBox,
    headerBox,
    pageBox
  },
  activated: function () {  
     this.init()
  },
  computed:{
    ...mapGetters([
      'userInfo'
    ])
  },
  watch:{
    viewQuery:{
      handler(val,oldVal){
        if(val){
          this.goView(val)
        }
      },
      deep:true
    },
    isView:{
       handler(val,oldVal){
        if(val){
          this.pageLimit = {}
        }
      },
      deep:true
    },
  },
  mounted(){
  },
  deactivated: function () {
  },
  methods:{
    async init(){
      let main_info = await MAIN();
      let {categories,category,userInfo,contents,limit,page,pages,count} = main_info
          this.categories = categories;
          this.category = category;
          this.GET_INFO(userInfo);
          this.contents = contents;
          this.pageLimit = {
            limit,
            page,
            pages,
            count
          }
    },
    newCategory(msg){
      let {category,userInfo,contents,limit,page,pages,count} = msg
      this.isView = false
      this.contents = contents
      this.category = category
      this.pageLimit = {
            limit,
            page,
            pages,
            count
      }
    },
    goView(msg){
      this.viewQuery = msg
      this.isView = true
    },
    ...mapMutations([
        'GET_INFO'
    ]),
  }
}
</script>

<style>

</style>
