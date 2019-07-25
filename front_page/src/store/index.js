import Vue from 'vue'
import Vuex from 'vuex'
import main from './modules/main'
// import admin from './store/modules/admin'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    main,
    // admin
  },
  getters
})

export default store