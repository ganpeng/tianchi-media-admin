import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 获取所有视频的列表
 * @param name The keyword of video, such as name or code.
 * @param startedAt The start time at upload to local successfully of video.
 * @param endedAt The end time at upload successfully of video.
 * @param status The status of video injecting, such as 'SUCCESS', 'FAILED', 'INJECTING'.
 * @param uploadStatus The status of video upload to master site, such as 'SUCCESS', 'FAILED', 'ON_GOING'.
 * @param downloadStatus The status of video download from master site, such as 'SUCCESS', 'FAILED', 'ON_GOING'.
 * @param suffix The suffix of video, such as 'mpg', 'ts', 'zip'.
 * @param originSiteId The id of video's origin source site.
 * @param shareSiteId The id of master site's video share branch site.
 * @param pageNum The current page number of video list.
 * @param pageSize The current page size of video list.
 */

export const getVideoList = ({name, startedAt, endedAt, status, uploadStatus, downloadStatus, suffix, originSiteId, shareSiteId, pageNum, pageSize}) => {
    // 注入中状态包括多种状态，因此改为Array形式
    let statusList = [];
    switch (status) {
        case 'SUCCESS':
        case 'FAILED':
            statusList = [status];
            break;
        case 'INJECTING':
            statusList = ['UPLOAD_COMPLETED', 'SPLIT_TASK_SUBMITTED', 'SPLIT_TASK_ON_QUEUE', 'SPLIT_TASK_ON_PENDING', 'SPLIT_TASK_ON_PROCESS', 'SPLIT_TASK_SUCCESS'];
            break;
        default:
            break;
    }
    let params = {
        name,
        startedAt,
        endedAt,
        statusList,
        downloadStatus,
        uploadStatus,
        suffix,
        originSiteId,
        shareSiteId,
        pageNum,
        pageSize
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
