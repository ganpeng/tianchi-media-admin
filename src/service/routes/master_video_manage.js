/**
 * @fileOverview Define the API functions of master video module
 */

import service from '../config';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 子站批量上传视频到主站
 */
export const batchPushVideoToMaster = ({videoIdList}) => {
    return service.put('/v1/storage/master/video/push', videoIdList, {
        baseURL: '/storage'
    });
};

/**
 * 子站从主站批量拉取视频
 */
export const batchPullVideoFromMaster = ({videoIdList}) => {
    return service.put('/v1/storage/master/video/pull', videoIdList, {
        baseURL: '/storage'
    });
};

/**
 * 获取主站可在子站共享的视频列表
 */
export const getMasterVideoList = ({keyword, suffix, pageNum, pageSize}) => {
    const params = {
        keyword,
        suffix,
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/master/video/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};
