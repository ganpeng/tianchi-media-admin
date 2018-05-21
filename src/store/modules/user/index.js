// 用户信息
import service from '../../../service';
import router from '../../../router';
import Cookies from 'js-cookie';

const state = {
    name: '',
    token: ''
};

const getters = {};

const mutations = {
    setName(state, data) {
        if (data) {
            Cookies.set('name', data);
        } else {
            Cookies.remove('name');
        }
        state.name = data;
    },
    setToken(state, data) {
        if (data) {
            Cookies.set('token', data);
        } else {
            Cookies.remove('token');
        }
        state.token = data;
    }
};

const actions = {
    // 登录
    login({commit}, userInfo) {
        return new Promise((resolve, reject) => {
            service.login({
                name: userInfo.name,
                password: userInfo.password
            }).then(res => {
                if (res) {
                    const data = res.data;
                    // 设置user模块
                    commit('setName', data.name);
                    commit('setToken', data.token);
                }
                resolve(res);
            }).catch(err => {
                reject(err.data);
            });
        });
    },
    // 退出
    logout({commit}) {
        // 清除cookie,跳转到登录页面
        commit('setName', '');
        commit('setToken', '');
        router.push({name: 'Login'});
        // 请求登出接口
        return new Promise(() => {
            service.logout();
        });
    },
    // 刷新页面，重新设置 user 模块
    reLogin({commit}, userInfo) {
        return new Promise((resolve) => {
            commit('setName', userInfo.name);
            commit('setToken', userInfo.token);
            resolve();
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
