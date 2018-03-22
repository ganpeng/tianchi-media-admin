// ajax全局设置

import axios from "axios"
import store from "../store"

var service = axios.create({
    baseURL: '',
    timeout: 5000,
    headers: {}
})

// 请求之前拦截设置token,进行权限验证
service.interceptors.request.use(
    function (config) {
        if (store.state.user.token) {
            config.headers.Authorization = store.state.user.token
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default service
