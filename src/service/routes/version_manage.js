import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 新增版本
 */
export const postVersion = (version) => {
    return service.post('/v1/sys/client-version', version);
};

/**
 * 获取版本列表
 */
export const getVersionList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/sys/client-version/page?${paramsStr}`);
};

/**
 * 获取客户端错误日志列表
 */
export const getClientErrorLogList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/stb/crash-log/page?${paramsStr}`);
};
