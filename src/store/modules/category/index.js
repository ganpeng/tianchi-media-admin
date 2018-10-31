import _ from 'lodash';
import service from '../../../service';

const defaultState = {
    programmeCategory: [],
    liveChannelCategory: [],
    carouselChannelCategory: []
};

const state = _.cloneDeep(defaultState);

const getters = {
    programmeCategory(state) {
        return state.programmeCategory;
    },
    liveChannelCategory(state) {
        return state.liveChannelCategory;
    },
    carouselChannelCategory(state) {
        return state.carouselChannelCategory;
    }
};

const mutations = {
    setProgrammeCategory(state, payload) {
        state.programmeCategory = payload.programmeCategory;
    },
    setLiveChannelCategory(state, payload) {
        state.liveChannelCategory = payload.liveChannelCategory;
    },
    setCarouselChannelCategory(state, payload) {
        state.carouselChannelCategory = payload.carouselChannelCategory;
    }
};

const actions = {
    // 获取直播频道分类
    async getLiveChannelCategory({commit}) {
        try {
            let res = await service.getChannelType({category: 'LIVE'});
            if (res && res.code === 0) {
                commit('setLiveChannelCategory', {liveChannelCategory: res.data});
            }
        } catch (err) {
            console.log(err);
        }
    },
    // 获取轮播频道分类
    async getCarouselChannelCategory({commit}) {
        try {
            let res = await service.getChannelType({category: 'CAROUSEL'});
            if (res && res.code === 0) {
                commit('setCarouselChannelCategory', {carouselChannelCategory: res.data});
            }
        } catch (err) {
            console.log(err);
        }
    },
    // 获取节目类型
    async getProgrammeCategory({commit}) {
        try {
            let res = await service.getProgrammeCategory();
            if (res && res.code === 0) {
                commit('setProgrammeCategory', {programmeCategory: res.data});
            }
        } catch (err) {
            console.log(err);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
