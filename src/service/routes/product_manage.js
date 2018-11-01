/**
 * @fileOverview Define the API functions of product module
 */

import service from '../config';
import util from '../../util/extend';

/**
 * 添加产品包
 */
export const createProduct = ({category, name, desc, targetIdList}) => {
    return service.post('/v1/product', {category, name, desc, targetIdList});
};

/**
 * 获取产品包列表
 */
export const getProductList = ({pageNum, pageSize, keyword}) => {
    return service.get(util.format('/v1/product/page?pageNum={0}&pageSize={1}&keyword={2}', pageNum - 1, pageSize, keyword));
};

/**
 * 获取产品包详细信息
 */
export const getProductInfo = ({id}) => {
    return service.get(util.format('/v1/product/{0}', id));
};

/**
 * 修改产品包信息
 */
export const updateProductInfo = ({id, category, name, desc, targetIdList}) => {
    return service.put(util.format('/v1/product/{0}', id), {category, name, desc, targetIdList});
};
