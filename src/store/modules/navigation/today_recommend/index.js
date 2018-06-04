// 今日推荐页面信息
import wsCache from '@/util/webStorage';

const state = {
    navBarId: 1,
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
    // 设置模块的专题项
    setSubjectLayoutItem(state, {row, item}) {
        state.subjectLayoutList[row] = item;
    },
    // 重新加载缓存的数据
    reloadData(state, reloadData) {
        state.liveChannelList = reloadData.liveChannelList ? reloadData.liveChannelList : [];
        state.recommendLayoutList = reloadData.recommendLayoutList ? reloadData.recommendLayoutList : [{
            layoutTemplate: 'LT_3',
            renderType: 'RECOMMEND_ITEM',
            title: '',
            recommendLayoutItemList: []
        }, {
            layoutTemplate: 'LT_2',
            renderType: 'RECOMMEND_ITEM',
            title: '',
            recommendLayoutItemList: []
        }];
        state.subjectLayoutList = reloadData.subjectLayoutList ? reloadData.subjectLayoutList : [];
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
    // 设置推荐节目或者专题
    setSubjectLayoutItem({commit}, {row, item}) {
        return new Promise((resolve) => {
            commit('setSubjectLayoutItem', {row, item});
            resolve('success');
        });
    },
    // 缓存整个state数据到localStorage中
    setTodayRecommendCache() {
        wsCache.localStorage.set('todayRecommend', state);
    },
    // 刷新的时候从localStorage中赋值给state
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
