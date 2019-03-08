/**
 * @fileOverview Define API functions of authorize module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';

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
 * 获取区域数据
 */
export const fetchAreaList = () => {
    return service.get(`/v1/sys/area/list`);
};

/**
 * 获取区域分组数据
 */
export const fetchAreaGroupNameList = () => {
    return service.get(`/v1/sys/area/group-name/list`);
};

/**
 * 获取中国行政区域
 * @param level such as 'PROVINCE'、'CITY'、'COUNTY'、'STREET'
 */
export const getDistrictList = ({level, code}) => {
    let params = {level, code, pageNum: 0, pageSize: 1000};
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/sys/district/page?${paramsStr}`);
};

/**
 * 获取当前环境上传视频的服务器地址
 */
export const getServers = () => {
    return service.get('/v1/sys/config/upstreams');
};

/**
 * 获取回看时移前缀
 */
export const getLiveUrlPrefix = () => {
    return service.get('/v1/sys/config/live/url-prefix');
};
