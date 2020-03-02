import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取直播推流详情
 */
export const getChannelPushDetail = (id) => {
    return service.get((`/v1/live/channelPush/${id}`));
};

/**
 * 新增直播推流
 */
export const createChannelPush = (channelPush) => {
    return service.post('/v1/live/channelPush', channelPush);
};

/**
 * 根据id全量修改直播推流
 */
export const updateChannelPushById = (id, channelPush) => {
    return service.put(`/v1/live/channelPush/${id}`, channelPush);
};

/**
 * 根据id禁播或者恢复直播推流
 */
export const setChannelPushVisible = (id) => {
    return service.patch(`/v1/live/channelPush/${id}/visible`);
};

/**
 * 根据id删除直播推流
 */
export const deleteChannelPushById = (id) => {
    return service.delete(`/v1/live/channelPush/${id}`);
};

/**
 * 获取直播推流的列表
 */
export const getChannelPushList = ({pageNum, pageSize, keyword, visible, category}) => {
    let params = {
        pageNum,
        pageSize,
        keyword,
        visible,
        category
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/live/channelPush/page?${paramsStr}`);
};

/**
 * 根据id的列表批量禁播或者恢复直播推流
 */
export const batchSetChannelPush = ({idList, visible}) => {
    const params = {
        idList,
        visible
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.patch(`/v1/live/channelPush/visible?${paramsStr}`);
};
