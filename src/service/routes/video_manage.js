import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取所有视频的列表
 */
export const getVideoList = ({startedAt, endedAt, status, userId, name, key, m3u8For480P, m3u8For720P, m3u8For1080P, bitrate, frameRate, pageNum, pageSize, videoType}) => {
    let params = {
        userId,
        name,
        key,
        m3u8For480P,
        m3u8For720P,
        m3u8For1080P,
        bitrate,
        frameRate,
        status,
        pageNum,
        pageSize,
        videoType,
        startedAt,
        endedAt
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/video/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};

/**
 * 根据id删除视频
 */
export const deleteVideoById = (id) => {
    return service.delete(`/v1/storage/video/${id}`, {
        baseURL: '/storage'
    });
};

/**
 * 根据id列表删除视频
 */
export const deleteVideoByIdList = (ids) => {
    return service.patch(`/v1/storage/video/delete`, ids, {
        baseURL: '/storage'
    });
};

/**
 * 根据id列表重新转吗视频
 */
export const retryVideoByIdList = (ids) => {
    return service.patch('/v1/storage/video/retry', ids, {
        baseURL: '/storage'
    });
};

/**
 * 根据id列表批量导出ts文件
 */
export const exportTsVideos = ({videoIdList}) => {
    return service.post('/v1/storage/video/export', videoIdList, {
        baseURL: '/storage'
    });
};
