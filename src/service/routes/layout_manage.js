/**
 * @fileOverview Define the API functions of layout manage module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 修改栏目布局
 */
export const modifyContentLayout = ({id, contentLayout}) => {
    return service.put('/v1/content/layout', contentLayout);
};

/**
 * 获取栏目布局
 * @param id The id of navBar.
 */
export const getContentLayout = ({navBarId}) => {
    return service.get(util.format('/v1/content/layout?navBarId={0}', navBarId));
};

/**
 * 获取角标的列表
 * @param markType The mark type such as SCORE、EPISODES_NUMBER、COPYRIGHT_RESERVED、LICENCE、CUSTOM.
 */
export const getCornerMarkList = ({markType}) => {
    return service.get(util.format('/v1/content/mark/list?markType={0}', markType));
};

/**
 * 添加角标
 */
export const appendCornerMark = ({caption, imageUri, markType}) => {
    return service.post('/v1/content/mark', {caption, imageUri, markType});
};

/**
 * 删除角标
 * @param id The id of corner mark.
 */
export const deleteCornerMark = (id) => {
    return service.delete(util.format('/v1/content/mark/{0}', id));
};

/**
 * 设置直播频道
 */
export const postChannelLayout = (reqBody) => {
    return service.put('/v1/ad/channel-layout', reqBody);
};

/**
 * 获取直播频道
 */
export const getChannelLayout = ({navBarId, releaseStatus, pageNum, pageSize}) => {
    const params = {
        navBarId,
        releaseStatus,
        pageNum,
        pageSize
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/ad/channel-layout/page?${paramsStr}`);
};

//  dev_v2.6移动端
/**
 * 设置移动端直播频道
 */
export const postAppChannelLayout = (reqBody) => {
    return service.put(`/v1/mobile/ad/channel-layout`, reqBody);
};

/**
 * 获取移动端直播频道
 */
export const getAppChannelLayout = ({navBarId, releaseStatus, pageNum, pageSize}) => {
    const params = {
        navBarId,
        releaseStatus,
        pageNum,
        pageSize
    };
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/mobile/ad/channel-layout/page?${paramsStr}`);
};
