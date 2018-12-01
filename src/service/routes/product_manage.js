/**
 * @fileOverview Define the API functions of product module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 添加产品包
 */
export const createProduct = ({category, name, description, contentIdList}) => {
    return service.post('/v1/product', {category, name, description, contentIdList});
};

/**
 * 获取产品包列表
 */
export const getProductList = ({productCategory, pageNum, pageSize, keyword, orderList, createdAtStart, createdAtEnd}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        productCategory,
        orderList,
        createdAtStart,
        createdAtEnd
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/product/page?${paramsStr}`);
};

/**
 * 获取产品包信息
 */
export const getProductInfo = ({id}) => {
    return service.get(util.format('/v1/product/{0}', id));
};

/**
 * 获取节目包内的节目内容列表
 */
export const getProgrammeProductContentList = ({id, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(util.format('/v1/product/{0}/programme/list', id) + `?${paramsStr}`);
};

/**
 * 获取轮播频道包内的频道内容列表
 */
export const getCarouselProductContentList = ({id, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(util.format('/v1/product/{0}/carousel/list', id) + `?${paramsStr}`);
};

/**
 * 获取直播回看包内的频道内容列表
 */
export const getRecordProductContentList = ({id, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(util.format('/v1/product/{0}/channel/list', id) + `?${paramsStr}`);
};

/**
 * 修改产品包信息
 */
export const updateProductInfo = ({id, category, name, description, contentIdList}) => {
    return service.patch(util.format('/v1/product/{0}', id), {category, name, description, contentIdList});
};

/**
 * 上架或下架产品包
 */
export const setProductVisible = ({id}) => {
    return service.patch(util.format('/v1/product/{0}/visible', id));
};
