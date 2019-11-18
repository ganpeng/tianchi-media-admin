/**
 * @fileOverview The config of http request
 */

import axios from 'axios';
import store from '../store';
import {Message, MessageBox} from 'element-ui';

let service = axios.create({
    headers: {
        'Accept': 'application/json',
        'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}'
    }
});

service.defaults.baseURL = '/admin';

// 请求之前拦截设置token, 进行权限验证
service.interceptors.request.use(
    function (config) {
        if (store.state.user.token) {
            config.headers['x-tianchi-token'] = store.state.user.token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器，统一处理
service.interceptors.response.use((response) => {
    // 添加响应的头到response.data中
    response.data.config = response.config;
    if (response.data.code === 0) {
        return response.data;
    }
    // 去除下载媒体流的信息提示
    if (response.data.config.responseType !== 'blob') {
        Message({
            message: response.data.message,
            type: 'warning'
        });
    }
    return response.data;
}, (err) => {
    // 用户未登录，删除本地cookie、storage、store中数据，转到登录页面
    if (err.response && err.response.data.code === 1001) {
        MessageBox.alert('该账号已在其他位置登录，如非本人操作，可点击重新登录后修改密码。', '异地登录提示', {
            confirmButtonText: '确定',
            callback: () => {
                store.dispatch('user/logout', false);
            }
        });
        return;
    }
    if (window.navigator.onLine) {
        Message({
            message: err.response ? err.response.data.message : '请求出现错误',
            type: 'warning'
        });
    } else {
        Message({
            message: '网络连接失败，请检查您的网络连接情况',
            type: 'error'
        });
    }
    return {config: err.config};
});

export default service;
