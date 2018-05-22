/**
 * @fileOverview Define the API functions of live channel layout manage
 */

import service from '../config';
import util from '@/util/extend';

/**
 * 获取直播频道布局列表
 * @param navBarId 导航栏 Id
 * @param releaseStatus 含有三个状态：DRAFT (草稿)、PRE-RELEASED(预发布状态)、RELEASED(发布状态)。第一期中只存在发布状态
 * @param pageNum 分页的页数
 * @param pageSize 每一页的数据量
 */
export let getLiveChannelLayoutList = ({navBarId, releaseStatus, pageNum, pageSize}) => {
    return service.get(util.format('/v1/ad/live-channel-layout/page?navBarId={0}&releaseStatus={1}&pageNum={2}&pageSize={3}', navBarId, releaseStatus, pageNum, pageSize));
};

/**
 * 设置直播频道布局
 * @param liveChannelArray An array of live channels
 * @example liveChannelArray:  [{
 *      liveChannelType: "LIVE_CHANNEL",
 *      liveChannelVo: {
 *              id: "0",
 *              name: "CCTV1",
 *              no: "001"
 *      },
 *      navBarId: "0",
 *      priority: 1,
 *      releaseStatus: "RELEASE"
 *    }]
 */
export let setLiveChannelLayout = (liveChannelArray) => {
    return service.put('/v1/ad/live-channel-layout', liveChannelArray);
};
