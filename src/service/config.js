/**
 * @fileOverview The config of http request
 */

import axios from 'axios';
import store from '../store';
import {Message} from 'element-ui';

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
    if (response.data.code === 0) {
        return response.data;
        // 用户未登录，删除本地cookie、storage、store中数据，转到登录页面
    } else if (response.data.code === 1001) {
        store.dispatch('user/logout', false);
        return;
    }
    Message({
        message: response.data.message,
        type: 'warning'
    });
    return response.data;
}, () => {
    Message({
        message: '网络异常',
        type: 'error'
    });
});

export default service;
