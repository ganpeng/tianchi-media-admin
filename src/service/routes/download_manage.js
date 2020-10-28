/**
 * @fileOverview Define the API functions of goods module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 获取导出列表
 */
export const getExportFileList = ({keyword, status, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword,
        status
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/excel-export/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};

/**
 * 下载excel
 */
export const getDownloadFile = (id) => {
    return service.post('/v1/storage/excel-export/download?id=' + id, 0, {
        baseURL: '/storage',
        responseType: 'blob'
    });
};

/**
 * 批量删除下载文件
 */
export const batchDeleteDownloadFile = ({idList}) => {
    return service.delete('/v1/storage/excel-export', {data: idList, baseURL: '/storage'});
};

/**
 * 商品的上下架
 */
export const setGoodsVisible = ({id, visible}) => {
    return service.patch(util.format('/v1/commodity/{0}?visible={1}', id, visible));
};
