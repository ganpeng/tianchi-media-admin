/**
 * @fileOverview Define the API functions of master video module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 子站上传单个视频到主站
 */
export const uploadSingleVideoToMaster = ({videoId}) => {
    return service.put(util.format('/v1/storage/master/video?videoId={0}', videoId));
};

/**
 * 获取主站共享的视频列表
 */
export const getMasterVideoList = ({keyword, pageNum, pageSize}) => {
    const params = {
        pageNum: pageNum - 1,
        pageSize,
        keyword
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/master/video/page?${paramsStr}`);
};
