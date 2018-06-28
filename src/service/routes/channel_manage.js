import service from '../config';

/**
 * 获取频道分类
 */
export const getChannelType = () => {
    return service.get('/v1/live/channel-type');
};

/**
 * 保存频道分类
 */
export const putChannelType = (channelType) => {
    return service.put('/v1/live/channel-type', channelType);
};

/**
 *  查看某中类别下频道的计数
 */
export const getChannelCount = (id) => {
    return service.get((`/v1/live/channel-type/${id}/channel-count`));
};

/**
 * 批量新增直播频道
 */
export const createChannels = (channelList) => {
    return service.post('/v1/live/channel', channelList);
};

/**
 * 根据id修改直播频道
 */
export const updateChannelById = (channel) => {
    return service.put(`/v1/live/channel`, channel);
};

/**
 * 根据id删除直播频道
 */
export const deleteChannelById = (id) => {
    return service.delete(`/v1/live/channel/${id}`);
};

/**
 * 获取频道的列表
 */
export const getChannelList = ({pageNum, pageSize, releaseStatus}) => {
    return service.get('/v1/live/channel/page', {
        params: {
            pageNum,
            pageSize,
            releaseStatus
        }
    });
};
