// 用户信息
import service from '../../../service';
import router from '../../../router';
import Cookies from 'js-cookie';
import wsCache from '../../../util/webStorage';
import store from '../../index';

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
                    // 获取区域列表
                    service.fetchAreaList()
                        .then((res) => {
                            if (res && res.code === 0) {
                                wsCache.localStorage.set('areaList', res.data);
                            }
                        });
                    // 当前环境的域名
                    let currentDomain = window.location.protocol + '//' + window.location.host;
                    // 设置图片的根路径为当前地址域名
                    window.localStorage.setItem('imageBaseUri', currentDomain);
                    // 设置视频的根路径为当前地址域名
                    window.localStorage.setItem('videoBaseUri', currentDomain);
                    // 获取当前环境对应的上传服务器的地址列表
                    service.getServers()
                        .then((res) => {
                            if (res && res.code === 0) {
                                wsCache.localStorage.set('servers', res.data);
                            }
                        });
                }
                resolve(res);
            }).catch(err => {
                reject(err.data);
            });
        });
    },
    // 退出
    logout({commit}, hasToken) {
        // 清除cookie,跳转到登录页面
        commit('setName', '');
        commit('setToken', '');
        wsCache.localStorage.clearAll();
        store.commit('layout/setState', {navBarList: []});
        //  清除上传视频的所有数据
        store.commit('uploadVideo/resetState');
        router.push({name: 'Login'});
        if (hasToken) {
            // 请求登出接口
            return new Promise(() => {
                service.logout();
            });
        }
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
