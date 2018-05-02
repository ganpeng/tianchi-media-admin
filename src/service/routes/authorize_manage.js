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
