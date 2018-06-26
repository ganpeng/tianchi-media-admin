/**
 * @fileOverview Define API functions of authorize module
 */

import service from '../config';
// import wsCache from '../../util/webStorage';

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
    return service.get('/v1/sys/config/image/url-prefix');
};

/**
 * 获取区域数据
 */
export const fetchAreaList = () => {
    return service.get(`/v1/sys/area/area/list`);
};
