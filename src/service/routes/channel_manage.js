import qs from 'querystring';
import _ from 'lodash';
import service from '../config';

const sevenDayTimeStamp = 60 * 60 * 24 * 7 * 1000;

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
    if (category) {
        return service.get(`/v1/live/channel-type?category=${category}`);
    } else {
        return service.get(`/v1/live/channel-type`);
    }
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
 * 新增频道
 */
export const createChannels = (channelList) => {
    return service.post('/v1/live/channel', channelList);
};

/**
 * 根据id全量修改频道
 */
export const updateChannelById = (id, channel) => {
    return service.put(`/v1/live/channel/${id}`, channel);
};

/**
 * 根据id部分修改频道
 */
export const updateChannelPartInfoById = ({id, putChannelReq}) => {
    return service.patch(`/v1/live/channel/${id}`, putChannelReq);
};

/**
 * 根据id禁播或者恢复频道
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
export const getChannelList = ({pageNum, pageSize, record, keyword, typeIdList, visible, category, common, companyCode, protocolList, refCount}) => {
    let params = {
        pageNum,
        pageSize,
        record,
        keyword,
        typeIdList,
        visible,
        category,
        common,
        companyCode,
        protocolList,
        refCount
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.get(`/v1/live/channel/page?${paramsStr}`);
};

/**
 * 根据频道的id获取节目单
 */
export const getChannelPageById = (id) => {
    return service.get(`/v1/live/channel-programme/list`, {
        params: {
            channelId: id,
            startDate: new Date().getTime() - sevenDayTimeStamp,
            endDate: new Date().getTime() + sevenDayTimeStamp
        }
    });
};

/**
 * 根据id的列表批量禁播或者恢复频道
 */
export const batchSetChannel = ({idList, visible}) => {
    const params = {
        idList,
        visible
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));

    return service.patch(`/v1/live/channel/visible?${paramsStr}`);
};

/**
 * 根据id获取类型组列表
 */
export const getProgrammeTypeGroupListById = (id) => {
    return service.get(`/v1/content/programme-type-group/list?categoryId=${id}`);
};

/**
 *  根据id保存节目组列表
 */
export const postProgrammeTypeGroupListById = (categoryId, programmeTypeGroupList) => {
    return service.post(`/v1/content/programme-type-group?categoryId=${categoryId}`, programmeTypeGroupList);
};

/**
 * 根据关键字搜索直播频道
 */
export const searchLiveChannelList = (keyword) => {
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&category=LIVE`);
};

/**
 * 根据关键字搜索轮播频道
 */
export const searchCarouselChannelList = (keyword) => {
    // return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&category=CAROUSEL`);
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999`);
};

/**
 * 获取频道区域列表
 */
export const getFilialeList = () => {
    return service.get('/v1/company/list');
};
