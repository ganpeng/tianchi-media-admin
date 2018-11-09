import _ from 'lodash';
import service from '../../../service';

const idPrefix = 'category_';

const defaultState = {
    programmeCategory: [],
    liveChannelCategory: [],
    carouselChannelCategory: []
};

const state = _.cloneDeep(defaultState);

function isCustomId(id) {
    return _.startsWith(id, idPrefix);
}

const getters = {
    programmeCategory(state) {
        return state.programmeCategory;
    },
    liveChannelCategory(state) {
        return state.liveChannelCategory;
    },
    carouselChannelCategory(state) {
        return state.carouselChannelCategory;
    },
    isCustomId() {
        return isCustomId;
    },
    checkProgrammeCategoryIsExist(state) {
        return (name, index) => {
            let hasIndex = state.programmeCategory[index].programmeTypeList.findIndex((type) => type.name === name);
            return hasIndex > -1;
        };
    },
    checkLiveCategoryIsExist(state) {
        return (name) => {
            let hasIndex = state.liveChannelCategory.findIndex((type) => type.name === name);
            return hasIndex > -1;
        };
    },
    checkCarouselCategoryIsExist(state) {
        return (name) => {
            let hasIndex = state.carouselChannelCategory.findIndex((type) => type.name === name);
            return hasIndex > -1;
        };
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
    },
    updateCategory(state, payload) {
        let {key, value} = payload;
        state[key] = value;
    },
    updateProgrammeCategoryByIndex(state, payload) {
        let {index, value} = payload;
        state.programmeCategory[index].programmeTypeList = value;
    },
    deleteProgrammeTypeByIndexAndTypeId(state, payload) {
        let {id, index} = payload;
        state.programmeCategory[index].programmeTypeList = state.programmeCategory[index].programmeTypeList.filter((type) => type.id !== id);
    },
    addProgrammeTypeByIndex(state, payload) {
        let {name, index} = payload;
        let typeObj = {
            name,
            id: _.uniqueId(idPrefix),
            visible: true
        };
        state.programmeCategory[index].programmeTypeList.push(typeObj);
    },
    addLiveCategory(state, payload) {
        let {name} = payload;
        let typeObj = {
            id: _.uniqueId(idPrefix),
            name,
            category: 'LIVE',
            status: 'NORMAL',
            visible: true
        };
        state.liveChannelCategory.push(typeObj);
    },
    deleteLiveCategory(state, payload) {
        let {id} = payload;
        state.liveChannelCategory = state.liveChannelCategory.filter((category) => category.id !== id);
    },
    addCarouselCategory(state, payload) {
        let {name} = payload;
        let typeObj = {
            id: _.uniqueId(idPrefix),
            name,
            category: 'CAROUSEL',
            status: 'NORMAL',
            visible: true
        };
        state.carouselChannelCategory.push(typeObj);
    },
    deleteCarouselCategory(state, payload) {
        let {id} = payload;
        state.carouselChannelCategory = state.carouselChannelCategory.filter((category) => category.id !== id);
    }
};

const actions = {
    //  获取所有频道类型
    async getChannelCategory({commit}) {
        try {
            let res = await service.getChannelType({});
            if (res && res.code === 0) {
                let liveChannelCategory = res.data.filter((item) => item.category === 'LIVE');
                let carouselChannelCategory = res.data.filter((item) => item.category === 'CAROUSEL');
                commit('setLiveChannelCategory', {liveChannelCategory});
                commit('setCarouselChannelCategory', {carouselChannelCategory});
            }
        } catch (err) {
            console.log(err);
        }
    },
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
    },
    //  保存频道类型
    async saveChannelCategory({commit}) {
        try {
            let {liveChannelCategory, carouselChannelCategory} = state;
            let channelTypeList = [...liveChannelCategory, ...carouselChannelCategory].map((category, index) => {
                if (isCustomId(category.id)) {
                    delete category.id;
                }
                category.sort = index;
                return category;
            });
            let res = await service.putChannelType(channelTypeList);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //  保存节目类型
    async saveProgrammeCategory({commit}) {
        try {
            let categoryList = _.cloneDeep(state.programmeCategory);
            categoryList.forEach((item) => {
                item.programmeTypeList.forEach((innerItem) => {
                    if (/^category_/.test(innerItem.id)) {
                        delete innerItem.id;
                    }
                });
            });
            let res = await service.updateProgrammeCategory({categoryList});
            return res;
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
