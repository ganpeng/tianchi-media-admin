// 用户信息
import axios from '../../../util/http'
import Cookies from 'js-cookie'

const state = {
    uid: '',
    username: '',
    token: ''
}

const getters = {}

const mutations = {
    setUID(state, data) {
        if (data) {
            Cookies.set('uid', data)
        } else {
            Cookies.remove('uid')
        }
        state.uid = data
    },
    setUsername(state, data) {
        if (data) {
            Cookies.set('username', data)
        } else {
            Cookies.remove('username')
        }
        state.username = data
    },
    setToken(state, data) {
        if (data) {
            Cookies.set('token', data)
        } else {
            Cookies.remove('token')
        }
        state.token = data
    }
}

const actions = {
    // 登录
    login({commit}, userInfo) {
        return new Promise((resolve, reject) => {
            axios.post('/api/v1/auth/login',
                {
                    username: userInfo.username,
                    password: userInfo.password
                }
            ).then(res => {
                if (res.data.code === 0) {
                    const data = res.data.data
                    // 设置user模块
                    commit('setUID', data.uid)
                    commit('setUsername', data.userName)
                    commit('setToken', data.token)
                }
                resolve(res)
            }).catch(err => {
                reject(err.data)
            })
        })
    },
    // 退出
    logout({commit}) {
        return new Promise((resolve) => {
            commit('setUID', '')
            commit('setUsername', '')
            commit('setToken', '')
            resolve()
        })
    },
    // 刷新页面，重新设置 user 模块
    reLogin({commit}, userInfo) {
        return new Promise((resolve) => {
            commit('setUID', userInfo.uid)
            commit('setUsername', userInfo.username)
            commit('setToken', userInfo.token)
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