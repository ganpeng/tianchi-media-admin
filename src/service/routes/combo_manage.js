/**
 * @fileOverview Define the API functions of combo module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建套餐
 */
export const createCombo = ({name, price, validityDays, description, visible}) => {
    return service.post('/v1/user/membership-scheme', {
        name,
        price: price * 100,
        validityDays,
        priceUnit: 'CENT',
        description,
        visible
    });
};

/**
 * 获取套餐列表
 */
export const getComboList = ({keyword, validityDays, createdAtStart, createdAtEnd, pageNum, pageSize, visible, sortKey, sortDirection}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        validityDays,
        createdAtStart: createdAtStart ? new Date(createdAtStart).getTime() : '',
        createdAtEnd: createdAtEnd ? new Date(createdAtEnd).getTime() : '',
        visible,
        sortKey,
        sortDirection
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/user/membership-scheme/page?${paramsStr}`);
};

/**
 * 修改套餐信息
 */
export const updateComboInfo = ({id, name, price, validityDays, description, visible}) => {
    return service.put('/v1/user/membership-scheme', {
        id,
        name,
        price: price * 100,
        validityDays,
        priceUnit: 'CENT',
        description,
        visible
    });
};

/**
 * 获取详情
 */
export const getComboDetail = (id) => {
    return service.get(util.format('/v1/user/membership-scheme/{0}', id));
};

/**
 * 套餐的上下架
 */
export const setComboVisible = ({id, visible}) => {
    return service.patch(util.format('/v1/user/membership-scheme/{0}?visible={1}', id, visible));
};
