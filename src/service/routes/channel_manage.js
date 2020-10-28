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
 * 获取频道详情
 */
export const getCarouselProgrammeList = (channelId) => {
    return service.get('/v1/live/carousel-video/programme/list?channelId=' + channelId);
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
 *  获取直播、轮播、回看服务器组的列表
 */
export const getChannelServerGroupList = ({type}) => {
    return service.get(`/v1/sys/system-config/server-group/list?type=` + type);
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
export const getChannelList = ({pageNum, pageSize, hasChannelProgramme, record, keyword, typeIdList, visible, category, common, companyCode, protocolList, refCount, paymentType, applicableClientList, cdnPush}) => {
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
        refCount,
        paymentType,
        applicableClientList,
        cdnPush,
        hasChannelProgramme
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
 * 根据关键字搜索频道
 */
export const searchChannelList = (keyword) => {
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&applicableClientList=TV&visible=true`);
};

/**
 * 根据关键字搜索直播频道
 */
export const searchLiveChannelList = (keyword) => {
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&applicableClientList=TV&category=LIVE&visible=true`);
};

/**
 * 根据关键字搜索轮播频道
 */
export const searchCarouselChannelList = (keyword) => {
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&applicableClientList=TV&category=CAROUSEL&visible=true`);
};

/**
 * 根据关键字搜索APP频道
 */
export const searchAppChannelList = (keyword) => {
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&applicableClientList=APP&visible=true`);
};

/**
 * 根据关键字搜索APP轮播频道
 */
export const searchAppLiveChannelList = (keyword) => {
    return service.get(`/v1/live/channel/page?keyword=${keyword}&pageNum=0&pageSize=999&category=LIVE&applicableClientList=APP&visible=true`);
};

/**
 * 获取频道区域列表
 */
export const getFilialeList = () => {
    return service.get('/v1/company/list');
};

/**
 * 导出全部频道列表的EXCEL
 */
export const exportAllChannelListExcel = ({channelCategory}) => {
    return service.post('/v1/live/channel/export?channelCategory=' + channelCategory, 0, {
        responseType: 'blob'
    });
};

/**
 * 获取直播缩略图开关状态
 */
export const getThumbnailStatus = () => {
    return service.get('/v1/sys/system-config/thumbnail-status');
};

/**
 * 获取直播缩略图开关状态
 */
export const updateThumbnailStatus = (params) => {
    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.patch(`/v1/sys/system-config/thumbnail-status?${paramsStr}`);
};

/***
 * 节目统计
 */
export const getProgrammeStatistics = () => {
    return service.get(`/v1/statistics/programme`);
};

/**
 * 视频统计
 */
export const getVideoStatistics = () => {
    return service.get(`/v1/statistics/video`);
};

/**
 * 轮播频道统计
 */
export const getCarouselStatistics = () => {
    return service.get(`/v1/statistics/carousel`);
};

/**
 * 直播频道统计
 */
export const getLiveStatistics = () => {
    return service.get(`/v1/statistics/live`);
}

/**
 * 根据id的开启或关闭直播回看
 */
export const switchLiveChannelLookbBack = ({id, enable}) => {
    const params = {
        id,
        enable
    };

    let paramsStr = qs.stringify(_.pickBy(params, (item) => {
        return item !== '' && item !== undefined;
    }));
    return service.patch(`/v1/live/channel-programme/enable-lookback?${paramsStr}`);
}
