/**
 * @fileOverview Define the API functions of ad module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建广告
 */
export const createAD = ({name, desc, adType, adMaterialList}) => {
    return service.post('/v1/ad/general-ad', {name, desc, adType, adMaterialList});
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
