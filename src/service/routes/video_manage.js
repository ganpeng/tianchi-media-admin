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

export const getVideoList = ({keyword, startedAt, endedAt, status, uploadStatus, downloadStatus, suffix, originSiteId, shareSiteId, pageNum, pageSize, statusCombinator, refCount, sortKey, sortDirection}) => {
    // 注入中状态包括多种状态，因此改为Array形式
    let statusList = [];
    switch (status) {
        case 'SUCCESS':
        case 'FAILED':
        case 'UPLOAD_COMPLETED':
        case 'SPLIT_TASK_ON_PROCESS':
        case 'SPLIT_TASK_SUCCESS':
        case 'DELETING':
            statusList = [status];
            break;
        case 'WAITING_SPLIT':
            statusList = ['SPLIT_TASK_SUBMITTED', 'SPLIT_TASK_ON_QUEUE', 'SPLIT_TASK_ON_PENDING'];
            break;
        default:
            break;
    }
    let params = {
        keyword,
        startedAt,
        endedAt,
        statusList,
        downloadStatus,
        uploadStatus,
        suffix,
        originSiteId,
        shareSiteId,
        pageNum,
        pageSize,
        statusCombinator,
        refCount,
        sortKey,
        sortDirection
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/video/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};

/**
 * 根据id删除视频列表中的视频
 */
export const deleteVideo = ({host, port, id}) => {
    return service.delete('http://' + host + ':' + port + `/v1/storage/video/${id}`);
};

/**
 * 根据id删除导出的视频
 */
export const deleteSomeServerVideoById = ({host, port, id}) => {
    return service.delete('http://' + host + ':' + port + `/v1/storage/video/export/${id}`);
};

/**
 * 根据id列表重新转码视频
 */
export const retryInjectVideo = ({id, host, port}) => {
    return service.patch('http://' + host + ':' + port + `/v1/storage/video/retry/${id}`);
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
 * 根据id列表批量取消'转码中'和'入库中'的视频
 */
export const bacthCancelInjectVideos = ({storageVideoIdList}) => {
    return service.post(`/v1/storage/video/batch-injection/cancel`, storageVideoIdList, {
        baseURL: '/storage'
    });
};

/**
 * 根据id列表批量取消'拉取中'的视频
 */
export const bacthCancelPullVideoFromMainSite = ({storageVideoIdList}) => {
    return service.post(`/v1/storage/video/batch-pull/cancel`, storageVideoIdList, {
        baseURL: '/storage'
    });
};

/**
 * 导出全部视频列表的EXCEL
 */
export const exportAllVideoListExcel = () => {
    return service.post('/v1/storage/video/export/excel', 0, {
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

/**
 * 获取可以使用的视频列表
 */
export const getSuccessVideoList = ({keyword, pageNum, pageSize}) => {
    let params = {
        keyword,
        statusList: ['SUCCESS'],
        downloadStatus: 'SUCCESS',
        uploadStatus: 'SUCCESS',
        pageNum: pageNum,
        pageSize,
        statusCombinator: 'OR'
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/storage/video/page?${paramsStr}`, {
        baseURL: '/storage'
    });
};

/**
 * 导出全部视频列表的EXCEL
 */
// export const exportAllVideoListExcel = () => {
//     return service.post('/v1/storage/video/export/excel', 0, {
//         baseURL: '/storage',
//         responseType: 'blob'
//     });
// };
