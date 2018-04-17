// 用户信息
import axios from '../../../util/http'
import router from '../../../router'
import util from '../../../util/extend'
import Cookies from 'js-cookie'

const state = {
    uid: '',
    name: '',
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
    setName(state, data) {
        if (data) {
            Cookies.set('name', data)
        } else {
            Cookies.remove('name')
        }
        state.name = data
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
            axios.post('/v1/auth/login',
                {
                    name: userInfo.name,
                    password: userInfo.password
                }
            ).then(res => {
                if (res) {
                    const data = res.data
                    // 设置user模块
                    commit('setUID', data.uid)
                    commit('setName', data.name)
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
        let token = Cookies.get('token')
        // 清除cookie,跳转到登录页面
        commit('setUID', '')
        commit('setName', '')
        commit('setToken', '')
        router.push({name: 'Login'})
        // 请求登出接口
        return new Promise(() => {
            axios.delete(util.format('/v1/auth/logout?token={0}', token))
        })
    },
    // 刷新页面，重新设置 user 模块
    reLogin({commit}, userInfo) {
        return new Promise((resolve) => {
            commit('setUID', userInfo.uid)
            commit('setName', userInfo.name)
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
