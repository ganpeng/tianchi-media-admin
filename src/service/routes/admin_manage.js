/**
 * @fileOverview Define the API functions of admin module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';
import util from '../../util/extend';

/**
 * 添加平台管理员
 */
export const createAdmin = ({email, mobile, name, remark, departmentList, roleList}) => {
    return service.post('/v1/admin', {email, mobile, name, remark, departmentList, roleList});
};

/**
 * 获取平台管理员信息列表
 */
export const getAdminList = ({keyword, departmentId, roleId, status, pageNum, pageSize, sortKey, sortDirection}) => {
    const params = {
        keyword,
        departmentId,
        roleId,
        status,
        pageSize,
        pageNum: pageNum - 1,
        sortKey,
        sortDirection
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/admin/page?${paramsStr}`);
};

/**
 * 获取平台管理员详细信息
 */
export const getAdminInfo = ({id}) => {
    return service.get(util.format('/v1/admin/{0}', id));
};

/**
 * 删除单个管理员
 * @param id The id of admin.
 */
export const removeAdmin = (id) => {
    return service.delete('/v1/admin/' + id);
};

/**
 * 批量启用或者禁用管理员
 * @param idList The idList of admin.
 * @param status The status of admin.
 */
export const batchUpdateAdminStatus = ({idList, status}) => {
    return service.patch('/v1/admin/batch/status?status=' + status, idList);
};

/**
 * 获取平台管理员自身信息
 */
export const getAdminSelfInfo = () => {
    return service.get(util.format('/v1/admin/self'));
};

/**
 * 修改平台管理员自身信息
 */
export const updateAdminSelfInfo = ({email, telephone, mobile, name}) => {
    return service.put('/v1/admin/self', {email, telephone, mobile, name});
};

/**
 * 修改平台管理员自身密码
 */
export const updateAdminSelfPassword = ({password, newPassword}) => {
    return service.patch('/v1/admin/self/password', {password, newPassword});
};

/**
 * 修改平台管理员信息
 */
export const updateAdminInfo = ({id, email, mobile, name, remark, departmentList, roleList}) => {
    return service.put(util.format('/v1/admin/{0}', id), {id, email, mobile, name, remark, departmentList, roleList});
};

/**
 * 重置平台管理员密码为 123456
 */
export const resetAdminPassword = ({id}) => {
    return service.patch(util.format('/v1/admin/{0}/password', id));
};

/**
 * 禁用或者开启平台管理员
 */
export const setAdminStatus = ({id, status}) => {
    return service.patch(util.format('/v1/admin/{0}/status?status={1}', id, status));
};

/**
 * 获取平台管理员登录日志信息
 */
export const getAdminLoginLog = ({id, pageNum, pageSize}) => {
    const params = {
        id,
        pageSize,
        pageNum: pageNum - 1
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/log?${paramsStr}`);
};
