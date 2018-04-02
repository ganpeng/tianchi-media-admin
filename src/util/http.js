// ajax全局设置

import axios from 'axios'
import store from '../store'
import qs from 'qs'

let service = axios.create({
    timeout: 5000,
    headers: {
        'Accept': 'application/json',
        'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}'
    }
})

// 请求之前拦截设置token, 进行权限验证
service.interceptors.request.use(
    function (config) {
        if (store.state.user.token) {
            config.headers['x-tianchi-token'] = store.state.user.token
        }
        // 更改data数据类型为 form-data
        if (config.method === 'post') {
            config.data = qs.stringify(config.data)
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default service
