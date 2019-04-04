/**
 * @fileOverview Define the API functions of inter cut module
 */

import service from '../config';
import util from '../../util/extend';
import qs from 'querystring';
import _ from 'lodash';

/**
 * 创建插播
 */
export const createInterCut = ({name, scheduled, startTime, totalDuration, channelList, videoList}) => {
    return service.post('/v1/live/inter-cut', {
        name,
        scheduled,
        startTime,
        totalDuration,
        channelList,
        videoList
    });
};

/**
 * 获取插播列表
 */
export const getInterCutList = ({keyword, channelIdList, scheduled, playStatus, order, pageNum, pageSize}) => {
    const params = {
        keyword,
        channelIdList,
        scheduled,
        playStatus,
        order,
        pageSize,
        pageNum: pageNum - 1
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/live/inter-cut/page?${paramsStr}`);
};

/**
 * 修改插播信息
 */
export const updateInterCutInfo = ({id, name, createdAt, scheduled, startTime, totalDuration, channelList, videoList}) => {
    return service.put('/v1/live/inter-cut', {
        id,
        name,
        scheduled,
        createdAt,
        startTime,
        totalDuration,
        channelList,
        videoList
    });
};

/**
 * 获取插播详情
 */
export const getInterCutDetail = (id) => {
    return service.get(util.format('/v1/live/inter-cut/{0}', id));
};

/**
 * 获取插播生效时间是否冲突
 */
export const getInterCutConflicting = ({channelIdList, startTime, endTime, excludedInterCutId}) => {
    const params = {
        channelIdList,
        startTime,
        endTime,
        excludedInterCutId
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/live/inter-cut/conflicting?${paramsStr}`);
};

/**
 * 删除单个插播
 */
export const deleteInterCutById = (id) => {
    return service.delete(util.format('/v1/live/inter-cut/{0}', id));
};

/**
 * 批量删除插播
 */
export const batchDeleteInterCut = ({idList}) => {
    return service.delete('/v1/live/inter-cut/batch', {data: idList});
};
