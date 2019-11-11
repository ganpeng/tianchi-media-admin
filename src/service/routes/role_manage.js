/**
 * @fileOverview Define the API functions of role module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 获取角色权限树
 */
export const getAthorityTree = () => {
    return service.get('/v1/sys_resource');
};

/**
 * 创建角色
 */
export const createRole = ({roleName, roleDesc, resourceList, visible}) => {
    return service.post('/v1/sys_role', {
        roleName, roleDesc, resourceList, visible
    });
};

/**
 * 获取角色列表
 */
export const getRoleList = ({keyword, visible, pageNum, pageSize}) => {
    const params = {
        keyword,
        visible,
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/sys_role/page?${paramsStr}`);
};

/**
 * 修改角色信息
 */
export const updateRoleInfo = ({id, roleName, roleDesc, resourceList, visible}) => {
    return service.put('/v1/sys_role/' + id, {id, roleName, roleDesc, resourceList, visible});
};

/**
 * 获取详情
 */
export const getRoleDetail = (id) => {
    return service.get('/v1/sys_role/' + id);
};

/**
 * 角色的批量上下架
 */
export const batchSetRoleVisible = ({idList, visible}) => {
    return service.patch('/v1/sys_role/visible?visible=' + visible, idList);
};

/**
 * 角色的上下架
 */
export const setRoleVisible = (id) => {
    return service.patch('/v1/sys_role/' + id + '/visible');
};

/**
 * 角色的删除
 */
export const removeRole = (id) => {
    return service.delete('/v1/sys_role/' + id);
};

/**
 * 角色的批量删除
 */
export const batchRemoveRole = ({idList}) => {
    return service.delete('/v1/sys_role', {data: idList});
};
