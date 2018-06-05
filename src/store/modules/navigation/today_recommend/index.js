// 今日推荐页面信息
import wsCache from '@/util/webStorage';

const state = {
    // 当前状态与线上相比是否更改
    modified: false,
    navBarId: '5b03d1c2dd10352f7de61c67',
    // 直播频道
    liveChannelList: [],
    recommendLayoutList: [{
        layoutTemplate: 'LT_3',
        renderType: 'RECOMMEND_ITEM',
        title: '',
        recommendLayoutItemMultiList: [[{}, {}, {}]]
    }, {
        layoutTemplate: 'LT_2',
        renderType: 'RECOMMEND_ITEM',
        title: '',
        recommendLayoutItemMultiList: [[{}, {}]]
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
        state.modified = true;
    },
    // 设置推荐位置的节目或者专题
    setRecommendItem(state, {block, row, index, item}) {
        state.recommendLayoutList[block].recommendLayoutItemMultiList[row][index] = item;
        state.modified = true;
    },
    // 设置模块的专题项
    setSubjectLayoutItem(state, {row, item}) {
        state.subjectLayoutList[row] = item;
        state.modified = true;
    },
    // 重新加载缓存的数据
    reloadData(state, reloadData) {
        state.modified = true;
        state.liveChannelList = reloadData.liveChannelList ? reloadData.liveChannelList : [];
        state.recommendLayoutList = reloadData.recommendLayoutList ? reloadData.recommendLayoutList : [{
            layoutTemplate: 'LT_3',
            renderType: 'RECOMMEND_ITEM',
            title: '',
            recommendLayoutItemMultiList: [[{}, {}, {}]]
        }, {
            layoutTemplate: 'LT_2',
            renderType: 'RECOMMEND_ITEM',
            title: '',
            recommendLayoutItemMultiList: [[{}, {}]]
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
    setRecommendItem({commit}, {block, row, index, item}) {
        return new Promise((resolve) => {
            commit('setRecommendItem', {block, row, index, item});
            resolve('success');
        });
    },
    // 设置推荐模块专题
    setSubjectLayoutItem({commit}, {row, item}) {
        return new Promise(resolve => {
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
    },
    // 恢复state初始状态，删除localStorage中相应的数据
    resumeState({commit}) {
        return new Promise(resolve => {
            commit('reloadData', {});
            wsCache.localStorage.remove('todayRecommend');
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
