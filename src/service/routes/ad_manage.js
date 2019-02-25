/**
 * @fileOverview Define the API functions of ad module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';
import util from '../../util/extend';

/**
 * 创建广告
 */
export const createAD = ({name, desc, adType, applyDateBegin, applyDateEnd, adMaterialList}) => {
    return service.post('/v1/ad/general-ad', {
        name,
        desc,
        adType,
        applyDateBegin,
        applyDateEnd,
        adMaterialList
    });
};

/**
 * 获取广告主的资源列表
 * @param mediaType The type of resource, such as IMAGE、VIDEO.
 */
export const getADOwnerResourceList = ({advertiserId, mediaType, pageNum, pageSize}) => {
    const params = {
        advertiserId,
        mediaType,
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/ad/ad-material/page?${paramsStr}`);
};

/**
 * 获取广告列表
 * @param adStatus The type of resource, such as EXPIRED、ACTIVE、WAITING.
 * @param mediaType The type of resource, such as IMAGE、VIDEO.
 */
export const getADList = ({keyword, advertiserId, adType, visible, adStatus, mediaType, createdAtStart, createdAtEnd, order, pageNum, pageSize}) => {
    const params = {
        keyword,
        advertiserId,
        adType,
        visible,
        adStatus,
        mediaType,
        createdAtStart,
        createdAtEnd,
        order,
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/ad/general-ad/page?${paramsStr}`);
};

/**
 * 广告下架
 * @param id The id of ad.
 */
export const setADVisible = (id) => {
    return service.patch(util.format('/v1/ad/general-ad/{0}/visible', id));
};

/**
 * 删除单个广告
 * @param id The id of ad.
 */
export const deleteAD = (id) => {
    return service.delete(util.format('/v1/ad/general-ad/{0}', id));
};
