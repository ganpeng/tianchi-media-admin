import service from '../config';

/**
 * 新增节目视频
 */
export const createProgrammeVideo = (video) => {
    return service.post('/v1/content/programme/video', video);
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
    return service.put(`/v1/content/programme/${id}`, video);
};

/**
 * 子集下架
 */
export const toggleVisible = ({id}) => {
    return service.patch(`/v1/content/programme/video/${id}/visible`);
};
