/**
 * @fileOverview Define the API functions of department module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建商品
 */
export const createGoods = ({name, price, validityDays, description, productList, visible}) => {
    return service.post('/v1/commodity', {
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
 * 获取商品列表
 */
export const getGoodsList = ({keyword, productId, createdAtStart, createdAtEnd, pageNum, pageSize, visible}) => {
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

    return service.get(`/v1/commodity/page?${paramsStr}`);
};

/**
 * 修改商品信息
 */
export const updateGoodsInfo = ({id, name, price, validityDays, description, productList, visible}) => {
    return service.put('/v1/commodity', {
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
export const getGoodsDetail = (id) => {
    return service.get(util.format('/v1/commodity/{0}', id));
};

/**
 * 商品的上下架
 */
export const setGoodsVisible = ({id, visible}) => {
    return service.patch(util.format('/v1/commodity/{0}?visible={1}', id, visible));
};
