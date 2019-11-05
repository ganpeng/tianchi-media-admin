/**
 * @fileOverview Define the API functions of department module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建部门
 */
export const createDepartment = ({name, description, adminList}) => {
    return service.post('/v1/department', {
        name,
        description,
        adminList
    });
};

/**
 * 获取部门列表
 */
export const getDepartmentList = ({keyword, id, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        id
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/department/page?${paramsStr}`);
};

/**
 * 修改部门信息
 */
export const updateDepartmentInfo = ({id, name, description, adminList}) => {
    return service.put('/v1/department', {
        id,
        name,
        description,
        adminList
    });
};

/**
 * 获取详情
 */
export const getDepartmentDetail = (id) => {
    return service.get(util.format('/v1/department/{0}', id));
};

/**
 * 部门的删除
 */
export const setDepartmentVisible = (id) => {
    return service.delete(util.format('/v1/department/{0}', id));
};
