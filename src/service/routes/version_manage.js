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
 * dev_v2.5 新增版本
 */
export const newPostVersion = (version) => {
    return service.post(`/v1/sys/client-version/addVersion`, version);
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
 * 根据版本id获取版本
 */
export const getVersionById = (id) => {
    return service.get(`/v1/sys/client-version/${id}`);
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

/**
 * 根据版本的id删除版本
 */
export const deleteVersionById = (id) => {
    return service.delete(`/v1/sys/client-version?id=${id}`);
};

/**
 * 发布，撤回
 */
export const launchVersion = (id, releaseStatus) => {
    return service.put(`/v1/sys/client-version/launch?id=${id}&releaseStatus=${releaseStatus}`);
};

/**
 * 编辑版本
 */
export const editVersionById = (version) => {
    return service.put(`/v1/sys/client-version/edit`, version);
};

/**
 * 保存套餐图
 */
export const putImagePackage = (data) => {
    return service.put(`/v1/content/image-package`, data);
};

/**
 * 获取套餐图
 */
export const getImagePackage = () => {
    return service.get(`/v1/content/image-package`);
};
