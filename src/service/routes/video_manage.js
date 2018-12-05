import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取所有视频的列表
 */
export const getVideoList = ({originSiteToken, shareSiteToken, startedAt, endedAt, status, uploadStatus, downloadStatus, suffix, userId, name, key, m3u8For480P, m3u8For720P, m3u8For1080P, bitrate, frameRate, pageNum, pageSize, videoType}) => {
    let params = {
        originSiteToken,
        shareSiteToken,
        userId,
        name,
        key,
        m3u8For480P,
        m3u8For720P,
        m3u8For1080P,
        bitrate,
        frameRate,
        status,
        downloadStatus,
        uploadStatus,
        suffix,
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
 * 根据id删除对应服务器上的视频
 */
export const deleteSomeServerVideoById = ({host, port, id}) => {
    return service.delete('http://' + host + ':' + port + `/v1/storage/video/export/${id}`);
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
 * 根据id列表重新转码视频
 */
export const retryVideoByIdList = (ids) => {
    return service.patch('/v1/storage/video/retry', ids, {
        baseURL: '/storage'
    });
};

/**
 * 根据id列表批量导出ts文件
 */
export const exportTsVideos = ({videoIdList, isRetry}) => {
    let params = {
        isRetry
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.post(`/v1/storage/video/export?${paramsStr}`, videoIdList, {
        baseURL: '/storage'
    });
};

/**
 * 获取所有时长不一致视频的列表
 */
export const getDurationDiffVideoList = ({durationDiffGt, durationDiffLt, keyword, startedAt, endedAt, pageNum, pageSize}) => {
    let params = {
        durationDiffGt,
        durationDiffLt,
        keyword,
        startedAt,
        endedAt,
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/video/duration-diff/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};

/**
 * 获取下载视频列表
 */
export const getDownloadVideoList = ({keyword, status, startedAt, endedAt, pageNum, pageSize}) => {
    let params = {
        keyword,
        status,
        startedAt,
        endedAt,
        pageNum: pageNum - 1,
        pageSize
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/video/export/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};
