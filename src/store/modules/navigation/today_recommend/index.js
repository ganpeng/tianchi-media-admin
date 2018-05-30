// 今日推荐页面信息
import wsCache from '@/util/webStorage';

const state = {
    // 直播频道
    liveChannelList: [],
    recommendLayoutList: [{
        layoutTemplate: 'LT_3',
        renderType: 'RECOMMEND_ITEM',
        title: '',
        recommendLayoutItemList: []
    }, {
        layoutTemplate: 'LT_2',
        renderType: 'RECOMMEND_ITEM',
        title: '',
        recommendLayoutItemList: []
    }],
    subjectLayoutList: []
};

const getters = {
    getCurrentState: state => {
        return state;
    }
};

const mutations = {
    // 设置直播频道列表
    setLiveChannelList(state, data) {
        state.liveChannelList = data;
    },
    // 设置推荐位置的节目或者专题
    setRecommendItem(state, {row, index, item}) {
        state.recommendLayoutList[row].recommendLayoutItemList[index] = item;
    },
    // 重新加载缓存的数据
    reloadData(state, reloadData) {
        state.liveChannelList = reloadData.liveChannelList;
        state.recommendLayoutList = reloadData.recommendLayoutList;
        state.subjectLayoutList = reloadData.subjectLayoutList;
    }
};

const actions = {
    // 设置直播频道
    setLiveChannelList({commit}, liveChannelList) {
        return new Promise((resolve) => {
            commit('setLiveChannelList', liveChannelList);
            resolve('success');
        });
    },
    // 设置推荐节目或者专题
    setRecommendItem({commit}, {row, index, item}) {
        return new Promise((resolve) => {
            commit('setRecommendItem', {row, index, item});
            resolve('success');
        });
    },
    setTodayRecommendCache() {
        wsCache.localStorage.set('todayRecommend', state);
    },
    reloadData({commit}, reloadData) {
        commit('reloadData', reloadData);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
