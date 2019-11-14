// 用户信息
import service from '../../../service';
import router from '../../../router';
import Cookies from 'js-cookie';
import wsCache from '../../../util/webStorage';
import store from '../../index';
import init from '@/util/init';

const state = {
    name: '',
    token: '',
    reset: '',
    roleList: [],
    role: []
};

const getters = {
    name(state) {
        return state.name;
    },
    roleList(state) {
        return state.roleList;
    },
    role(state) {
        return state.role;
    }
};

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
    },
    setReset(state, data) {
        if (data) {
            Cookies.set('reset', data);
        } else {
            Cookies.remove('reset');
        }
        state.reset = data;
    },
    setRoleList(state, data) {
        if (data) {
            wsCache.localStorage.set('roleList', data);
        }
        state.roleList = data;
    },
    setRole(state, data) {
        if (data) {
            wsCache.localStorage.set('role', data);
        }
        state.role = data;
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
                    commit('setReset', data.reset);
                    commit('setRoleList', data.roleList);
                    commit('setRole', data.role);
                    // 获取区域列表
                    service.fetchAreaList().then((res) => {
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

                    //  登录成功后初始化页面布局的数据结构
                    init();
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
        commit('setReset', '');
        commit('setRoleList', '');
        commit('setRole', '');
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
            commit('setReset', userInfo.reset);
            commit('setRoleList', userInfo.roleList);
            commit('setRole', userInfo.role);
            resolve();
        });
    },
    setReset({commit}, resetValue) {
        return new Promise((resolve) => {
            commit('setReset', resetValue);
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
