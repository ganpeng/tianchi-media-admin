/**
 * @fileOverview Define store module of todayRecommend
 */

import wsCache from '@/util/webStorage';

const state = {
    // 当前状态与线上相比是否更改
    modified: false,
    navBarId: '5b03d1c2dd10352f7de61c67',
    // 直播频道
    liveChannelList: [],
    // 节目、人物或者色块推荐布局
    layoutBlockList: []
};

const getters = {
    /**
     * get the current state of this module
     * @param state
     * @return {JSON}
     */
    getCurrentState: state => {
        return state;
    }
};

const mutations = {
    /**
     * 设置直播频道列表
     * @param state
     * @param liveChannelList An array of liveChannelList
     */
    setLiveChannelList(state, liveChannelList) {
        state.liveChannelList = liveChannelList;
        state.modified = true;
        mutations.setCache();
    },
    /**
     * 设置单个推荐位置的节目或者专题
     * @param state
     * @param model The index of layoutBlockList
     * @param row The row of layoutBlockList's two-dimensional array
     * @param index The index of the row
     * @param item An single subject or programme recommended
     */
    setSingleRecommendItem(state, {model, row, index, item}) {
        state.layoutBlockList[model].layoutItemMultiList[row][index] = item;
        state.modified = true;
        mutations.setCache();
    },
    /**
     * 设置色块推荐节目二级分类或者直播频道
     * @param state
     * @param model The index of layoutBlockList
     * @param catalogueModel The catalogue model which is two-dimensional array
     */
    setCatalogue(state, {model, catalogueModel}) {
        state.layoutBlockList[model] = catalogueModel;
        state.modified = true;
        mutations.setCache();
    },
    /**
     * 设置模块推荐位的专题项
     * @param state
     * @param model The index of layoutBlockList
     * @param subjectModel The subject model which is two-dimensional array
     */
    setSubjectLayoutItem(state, {model, subjectModel}) {
        state.layoutBlockList[model] = subjectModel;
        state.modified = true;
        mutations.setCache();
    },
    /**
     * 重新加载缓存的数据
     * @param state
     * @param reloadData The reloaded data
     */
    reloadData(state, reloadData) {
        state.modified = reloadData.modified;
        state.liveChannelList = reloadData.liveChannelList ? reloadData.liveChannelList : [];
        state.layoutBlockList = reloadData.layoutBlockList ? reloadData.layoutBlockList : [];
        mutations.setCache();
    },
    /**
     * 缓存整个state数据到localStorage中
     */
    setCache() {
        wsCache.localStorage.set('todayRecommend', state);
    }
};

const actions = {
    /**
     * 设置直播频道列表
     * @param commit
     * @param liveChannelList An array of liveChannelList
     */
    setLiveChannelList({commit}, liveChannelList) {
        return new Promise((resolve) => {
            commit('setLiveChannelList', liveChannelList);
            resolve('success');
        });
    },
    /**
     * 设置单个推荐位置的节目或者专题
     * @param commit
     * @param model The index of layoutBlockList
     * @param row The row of layoutBlockList's two-dimensional array
     * @param index The index of the row
     * @param item An single subject or programme recommended
     */
    setSingleRecommendItem({commit}, {model, row, index, item}) {
        return new Promise((resolve) => {
            commit('setSingleRecommendItem', {model, row, index, item});
            resolve('success');
        });
    },
    /**
     * 设置色块推荐节目二级分类或者直播频道
     * @param commit
     * @param model The index of layoutBlockList
     * @param catalogueModel The catalogue model which is two-dimensional array
     */
    setCatalogue({commit}, {model, catalogueModel}) {
        return new Promise((resolve) => {
            commit('setCatalogue', {model, catalogueModel});
            resolve('success');
        });
    },
    /**
     * 设置模块推荐位的专题项
     * @param commit
     * @param model The index of layoutBlockList
     * @param subjectModel The subject model which is two-dimensional array
     */
    setSubjectLayoutItem({commit}, {model, subjectModel}) {
        return new Promise(resolve => {
            commit('setSubjectLayoutItem', {model, subjectModel});
            resolve('success');
        });
    },
    /**
     * 刷新的时候从localStorage中赋值给state
     * @param commit
     * @param reloadData The reloaded data
     */
    reloadData({commit}, reloadData) {
        return new Promise(resolve => {
            commit('reloadData', reloadData);
            resolve('success');
        });
    },
    /**
     * 恢复state初始状态，更改设置为false，同步state中的数据到localStorage
     * @param commit
     */
    resumeState({commit}) {
        return new Promise(resolve => {
            commit('reloadData', {modified: false});
            resolve('success');
        });
    },
    /**
     * 缓存整个state数据到localStorage中
     */
    setTodayRecommendCache() {
        wsCache.localStorage.set('todayRecommend', state);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
