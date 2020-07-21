/**
 * @fileOverview Define the API functions of active code module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建激活码
 */
export const createActiveCode = ({num}) => {
    return service.post('/v1/active_code?num=' + num, {}, {
        responseType: 'blob'
    });
};

/**
 * 获取激活码列表
 */
export const getCodeList = ({keyword, status, startActiveAt, endActiveAt, pageNum, pageSize, startCreatedAt, endCreatedAt}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        status,
        startActiveAt: startActiveAt ? new Date(startActiveAt).getTime() : '',
        endActiveAt: endActiveAt ? new Date(endActiveAt).getTime() : '',
        startCreatedAt: startCreatedAt ? new Date(startCreatedAt).getTime() : '',
        endCreatedAt: endCreatedAt ? new Date(endCreatedAt).getTime() : '',
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/active_code/page?${paramsStr}`);
};


/**
 * 激活码删除
 */
export const removeActiveCode = (id) => {
    return service.delete('/v1/active_code/' + id);
};

/**
 * 批量删除激活码
 */
export const batchDeleteActiveCode = ({idList}) => {
    return service.delete('/v1/active_code', {data: idList});
};


/**
 * 导出选中激活码
 */
export const exportSelectedActiveCode = ({idList}) => {
    const params = {
        idList
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.post(`/v1/active_code/export?${paramsStr}`, {}, {
        responseType: 'blob'
    });
};


/**
 * 激活码开关情况
 */
export const getCodeSwitchInfo = () => {
    return service.get('/v1/sys/system-config/active-code/switch');
};

/**
 * 激活码开关情况
 */
export const updateCodeSwitchInfo = (status) => {
    return service.patch('/v1/sys/system-config/active-code/switch?status=' + status);
};
