/**
 * @fileOverview Define API functions of authorize module
 */

import service from '../config';

/**
 * 管理平台登录
 */
export const login = ({name, password}) => {
    return service.post('/v1/auth/login', {name, password});
};

/**
 * 管理平台登出
 */
export const logout = () => {
    return service.delete('/v1/auth/logout');
};

/**
 * 获取图片地址的根路径
 */
export const getImageBaseUri = () => {
    return service.get('/v1/sys/config/version')
        .then((res) => {
            if (res && res.code === 0) {
                window.localStorage.setItem('imageBaseUri', res.data);
            }
        });
};
