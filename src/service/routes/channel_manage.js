import qs from 'querystring';
import _ from 'lodash';
import service from '../config';
import util from '../../util/extend';

/**
 * 获取频道详情
 */
export const getChannelDetail = (id) => {
    return service.get((`/v1/live/channel/${id}`));
};

/**
 * 获取频道分类
 */
export const getChannelType = ({category}) => {
    return service.get(util.format('/v1/live/channel-type?category={0}', category));
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
export const updateChannelById = (id, channel) => {
    return service.put(`/v1/live/channel/${id}`, channel);
};

/**
 * 根据id禁播或者恢复节目
 */
export const setChannelVisible = (id) => {
    return service.patch(`/v1/live/channel/${id}/visible`);
};

/**
 * 根据id删除频道
 */
export const deleteChannelById = (id) => {
    return service.delete(`/v1/live/channel/${id}`);
};

/**
 * 获取频道的列表
 */
export const getChannelList = ({pageNum, pageSize, keyword, typeIdList, visible, category}) => {
    let params = {
        pageNum,
        pageSize,
        keyword,
        typeIdList,
        visible,
        category
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/live/channel/page?${paramsStr}`);
};
