// 今日推荐页面信息
import wsCache from '@/util/webStorage';

const state = {
    // 直播频道
    liveChannelList: []
};

const getters = {};

const mutations = {
    // state的全量更新
    setStateForAll(state, data) {
        state.liveChannelList = data;
    },
    // 设置直播频道列表
    setLiveChannelList(state, data) {
        state.liveChannelList = data;
    }
};

const actions = {
    // state的全量更新
    setStateForAll({commit}, todayRecommendData) {
        commit('setStateForAll', todayRecommendData);
    },
    // 设置直播频道
    setLiveChannels({commit}, liveChannelList) {
        return new Promise((resolve) => {
            commit('setLiveChannelList', liveChannelList);
            // 保存信息到sessionStorage中
            wsCache.sessionStorage.set('todayRecommend', {liveChannelList: liveChannelList});
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
