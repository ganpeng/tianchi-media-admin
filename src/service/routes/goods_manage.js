/**
 * @fileOverview Define the API functions of goods module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建商品
 */
export const createGoods = ({name, price, duration, desc, productList, visible}) => {
    return service.post('/v1/content/goods', {
        name,
        price,
        duration,
        desc,
        productList,
        visible
    });
};

/**
 * 获取商品列表
 */
export const getGoodsList = ({keyword, productId, createdAtBegin, createdAtEnd, pageNum, pageSize, visible}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        productId,
        createdAtBegin: createdAtBegin ? new Date(createdAtBegin).getTime() : '',
        createdAtEnd: createdAtEnd ? new Date(createdAtEnd).getTime() : '',
        visible
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/content/goods/page?${paramsStr}`);
};

/**
 * 修改商品信息
 */
export const updateGoodsInfo = ({id, name, price, duration, desc, productList, visible}) => {
    return service.patch(util.format('/v1/content/subject/{0}', id), {
        id,
        name,
        price,
        duration,
        desc,
        productList,
        visible
    });
};

/**
 * 获取专题详情
 */
export const getGoodsDetail = (id) => {
    return service.get(util.format('/v1/content/goods/{0}', id));
};

/**
 * 商品的上下架，假如线上是上架状态，请求之后会更改为下架状态，反之亦然
 */
export const setGoodsVisible = (id) => {
    return service.patch(util.format('/v1/content/goods/{0}/visible', id));
};
