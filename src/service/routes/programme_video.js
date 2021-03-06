import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

/**
 * 新增节目视频
 */
export const createProgrammeVideo = (video) => {
    return service.post('/v1/content/programme/video', video);
};

/**
 *  新增多条节目视频
 */
export const createMultProgrammeVideo = (videoList) => {
    return service.post('/v1/content/programme/video', videoList);
};

/**
 * 获取节目视频列表
 */
export const getProgrammeVideoList = ({pageNum, pageSize}) => {
    return service.get('/v1/content/programme/video/list', {
        params: {
            pageNum,
            pageSize
        }
    });
};

/**
 *  根据节目视频的id获取视频
 */
export const getProgrammeVideoInfo = ({id}) => {
    return service.get(`/v1/content/programme/video/${id}`);
};

/**
 * 根据节目视频的id更新节目视频信息
 */
export const updateProgrammeVideoInfo = ({id, video}) => {
    // return service.patch(`/v1/content/programme/video/${id}`, video);
    return service.put(`/v1/content/programme/video/${id}`, video);
};

/**
 *  根据节目视频的id删除视频
 */
export const deleteProgrammeVideoById = (id) => {
    return service.delete(`/v1/content/programme/video/${id}`);
};

/**
 * 子集下架
 */
export const lowerFrameVideo = (id) => {
    return service.patch(`/v1/content/programme/video/${id}/visible`);
};

/**
 * 获取节目视频子集列表
 */
export const getProgrammeVideoListById = ({pageNum, pageSize, programmeId, parentId, typeList}) => {
    let params = {
        pageNum, pageSize, programmeId, parentId, typeList
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.get(`/v1/content/programme/video/page?${paramsStr}`);
};
