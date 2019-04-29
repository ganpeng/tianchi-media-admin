/**
 * @fileOverview Define the API functions of order module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 获取订单信息列表
 */
export const getOrderList = ({keyword, productId, payWay, status, pageNum, pageSize, commitAtStart, commitAtEnd}) => {
    let params = {
        keyword,
        productId,
        payWay,
        status,
        commitAtStart,
        commitAtEnd,
        pageNum: pageNum - 1,
        pageSize
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/order/page?${paramsStr}`);
};

/**
 * 根据id获取订单详细信息
 */
export const getOrderDetail = ({id}) => {
    return service.get(util.format('/v1/order/{0}', id));
};
