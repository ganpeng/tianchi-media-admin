// 今日推荐页面信息
import wsCache from '@/util/webStorage';

const state = {
    // 直播频道
    liveChannelList: []
};

const getters = {};

const mutations = {
    // 设置直播频道列表
    setLiveChannelList(state, data) {
        state.liveChannelList = data;
    }
};

const actions = {
    // 设置直播频道
    setLiveChannelList({commit}, liveChannelList) {
        return new Promise((resolve) => {
            commit('setLiveChannelList', liveChannelList);
            // 保存信息到sessionStorage中
            wsCache.localStorage.set('todayRecommend', {liveChannelList: liveChannelList});
            resolve('success');
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
