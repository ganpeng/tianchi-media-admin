import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 新增设备
 */
export const addBoss = (boss) => {
    return service.post('/v1/boss', boss);
};

/**
 * 根据id列表获取设备信息
 */
export const getBossById = (id) => {
    return service.get(`/v1/boss/${id}`);
};

/**
 * 根据id修改设备信息
 */
export const updateBossById = (boss) => {
    return service.put(`/v1/boss`, boss);
};

/**
 * 根据id删除设备信息
 */
export const deleteBossByIdList = (idList) => {
    return service.post(`/v1/boss/delete`, idList);
};

/**
 * 获取设备列表
 */
export const getBossList = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/boss/page?${paramsStr}`);
};

/**
 * 获取boss最大接入数
 */
export const getBossMax = () => {
  return service.get(`/v1/boss/max-limit`);
};

/**
 * 导入boss
 */
export const importBoss = (file) => {
  return service.post(`/v1/boss/import`, file);
};
