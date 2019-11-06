/**
 * @fileOverview Define the API functions of role module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建角色
 */
export const createRole = ({name, price, validityDays, description, productList, visible}) => {
    return service.post('/v1/role', {
        name,
        price: price * 100,
        validityDays,
        priceUnit: 'CENT',
        description,
        productList,
        visible
    });
};

/**
 * 获取角色列表
 */
export const getRoleList = ({keyword, productId, createdAtStart, createdAtEnd, pageNum, pageSize, visible}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        productId,
        createdAtStart: createdAtStart ? new Date(createdAtStart).getTime() : '',
        createdAtEnd: createdAtEnd ? new Date(createdAtEnd).getTime() : '',
        visible
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/role/page?${paramsStr}`);
};

/**
 * 修改角色信息
 */
export const updateRoleInfo = ({id, name, price, validityDays, description, productList, visible}) => {
    return service.put('/v1/role', {
        id,
        name,
        price: price * 100,
        validityDays,
        priceUnit: 'CENT',
        description,
        productList,
        visible
    });
};

/**
 * 获取详情
 */
export const getRoleDetail = (id) => {
    return service.get(util.format('/v1/role/{0}', id));
};

/**
 * 角色的上下架
 */
export const setRoleVisible = ({id, visible}) => {
    return service.patch(util.format('/v1/role/{0}?visible={1}', id, visible));
};
