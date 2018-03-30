// 用户信息
import axios from '../../../util/http'

const state = {
    uid: '',
    name: '',
    token: ''
}

const getters = {}

const mutations = {
    setUID(state, data) {
        state.uid = data
    },
    setName(state, data) {
        state.name = data
    },
    setToken(state, data) {
        state.token = data
    }
}

const actions = {
    // 登录
    login({commit}, userInfo) {
        return new Promise((resolve, reject) => {
            axios.post('/login', userInfo).then(res => {
                const data = res.data
                console.log(data)
                // 设置user模块
                commit('setUID', data.uid)
                commit('setName', data.name)
                commit('setToken', data.token)
                resolve(res)
            }).catch(err => {
                reject(err.data)
            })
        })
    },
    // 退出
    logout({commit}) {
        console.log('退出设置')
        return new Promise((resolve) => {
            commit('setUID', '')
            commit('setName', '')
            commit('setToken', '')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
