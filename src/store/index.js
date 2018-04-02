// 组装模块并导出store
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import VuexModules from './modules'

Vue.use(Vuex)
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: VuexModules,
    // 严格模式，只允许在mutation中更新state状态，否则抛出错误
    strict: true
})

export default store
