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
export const createAdmin = ({email, mobile, name}) => {
    return service.post('/v1/admin', {email, mobile, name});
};

/**
 * 获取平台管理员信息列表
 */
export const getAdminList = ({pageNum, pageSize, keyword}) => {
    const params = {
        keyword,
        pageSize,
        pageNum: pageNum - 1
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
export const updateAdminInfo = ({id, email, telephone, mobile, name}) => {
    return service.put(util.format('/v1/admin/{0}', id), {email, telephone, mobile, name});
};

/**
 * 重置平台管理员密码
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
