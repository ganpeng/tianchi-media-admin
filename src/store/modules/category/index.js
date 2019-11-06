import _ from 'lodash';
import service from '../../../service';

const idPrefix = 'category_';

const defaultState = {
    programmeCategory: [],
    liveChannelCategory: [],
    carouselChannelCategory: [],
    categoryGroupList: []
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
    categoryGroupList(state) {
        return state.categoryGroupList;
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
    },
    //  dev_v2.5新增
    programmeCategoryIsEdit(state) {
        let list = state.programmeCategory.reduce((res, curr) => {
            res.push(curr);
            res = _.concat(res, curr.programmeTypeList);
            return res;
        }, []);
        let index = list.findIndex((item) => item.edit);
        return index >= 0;
    }
};

const mutations = {
    setProgrammeCategory(state, payload) {
        let programmeCategory = payload.programmeCategory.map((item) => {
            item.edit = false;
            item.inputValue = item.name;
            item.programmeTypeList = item.programmeTypeList.map((innerItem) => {
                innerItem.edit = false;
                innerItem.inputValue = innerItem.name;
                return innerItem;
            });
            return item;
        });
        state.programmeCategory = programmeCategory;
        // state.programmeCategory = payload.programmeCategory;
    },
    setLiveChannelCategory(state, payload) {
        state.liveChannelCategory = payload.liveChannelCategory;
    },
    setCarouselChannelCategory(state, payload) {
        state.carouselChannelCategory = payload.carouselChannelCategory;
    },
    setCategoryGroupList(state, payload) {
        state.categoryGroupList = payload.categoryGroupList;
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
    },
    //  类型组的相关操作
    addCategoryGroupToList(state, payload) {
        let {categoryGroup} = payload;
        state.categoryGroupList.push(categoryGroup);
    },
    deleteCategoryGroupByIndex(state, payload) {
        let {index} = payload;
        state.categoryGroupList = state.categoryGroupList.filter((item, _index) => _index !== index);
    },
    updateCategoryGroupList(state, payload) {
        let {index, categoryGroup} = payload;
        state.categoryGroupList[index] = categoryGroup;
    },
    //  v2.5新增内容
    typeInputValueUpdate(state, payload) {
        let {index, type, value} = payload;
        state.programmeCategory[index].programmeTypeList = state.programmeCategory[index].programmeTypeList.map((item) => {
            if (item.id === type.id) {
                item.inputValue = value;
            }
            return item;
        });
    },
    typeNameUpdate(state, payload) {
        let {index, id} = payload;
        state.programmeCategory[index].programmeTypeList = state.programmeCategory[index].programmeTypeList.map((item) => {
            if (item.id === id) {
                item.name = item.inputValue;
                item.edit = false;
            }
            return item;
        });
    },
    toggleTypeEdit(state, payload) {
        let {index, id} = payload;
        state.programmeCategory[index].programmeTypeList = state.programmeCategory[index].programmeTypeList.map((item) => {
            if (item.id === id) {
                item.edit = true;
            }
            return item;
        });
    },
    addNewProgrammeCategory(state, payload) {
        let {programmeCategory} = payload;
        state.programmeCategory.push(programmeCategory);
    },
    deleteProgrammeCategory(state, payload) {
        let {index} = payload;
        state.programmeCategory.splice(index, 1);
    },
    deleteProgrammeCategoryById(state, payload) {
        let {id} = payload;
        state.programmeCategory = state.programmeCategory.filter((item) => item.id !== id);
    },
    toggleCategoryEdit(state, payload) {
        let {index} = payload;
        state.programmeCategory = state.programmeCategory.map((item, _index) => {
            if (_index === index) {
                item.edit = true;
            }
            return item;
        });
    },
    programmeCategoryInputValueUpdate(state, payload) {
        let {value, index} = payload;
        state.programmeCategory = state.programmeCategory.map((item, _index) => {
            if (index === _index) {
                item.inputValue = value;
            }
            return item;
        });
    },
    programmeCategoryNameUpdate(state, payload) {
        let {index} = payload;
        state.programmeCategory = state.programmeCategory.map((item, _index) => {
            if (index === _index) {
                item.name = item.inputValue;
                item.edit = false;
            }
            return item;
        });
    },
    resetAllEdit(state) {
        state.programmeCategory = state.programmeCategory.map((item) => {
            item.edit = false;
            item.programmeTypeList = item.programmeTypeList.map((innerItem) => {
                innerItem.edit = false;
                return innerItem;
            });
            return item;
        });
    },
    //  直播频道
    toggleLiveCategoryEdit(state, payload) {
        let {id} = payload;
        state.liveChannelCategory = state.liveChannelCategory.map((item) => {
            if (item.id === id) {
                item.edit = true;
            }
            return item;
        });
    },
    liveCategoryInputValueUpdate(state, payload) {
        let {value, id} = payload;
        state.liveChannelCategory = state.liveChannelCategory.map((item) => {
            if (item.id === id) {
                item.inputValue = value;
            }
            return item;
        });
    },
    liveCategoryNameUpdate(state, payload) {
        let {id} = payload;
        state.liveChannelCategory = state.liveChannelCategory.map((item) => {
            if (item.id === id) {
                item.name = item.inputValue;
                item.edit = false;
            }
            return item;
        });
    },
    //  轮播相关
    toggleCarouselCategoryEdit(state, payload) {
        let {id} = payload;
        state.carouselChannelCategory = state.carouselChannelCategory.map((item) => {
            if (item.id === id) {
                item.edit = true;
            }
            return item;
        });
    },
    carouselCategoryInputValueUpdate(state, payload) {
        let {value, id} = payload;
        state.carouselChannelCategory = state.carouselChannelCategory.map((item) => {
            if (item.id === id) {
                item.inputValue = value;
            }
            return item;
        });
    },
    carouselCategoryNameUpdate(state, payload) {
        let {id} = payload;
        state.carouselChannelCategory = state.carouselChannelCategory.map((item) => {
            if (item.id === id) {
                item.name = item.inputValue;
                item.edit = false;
            }
            return item;
        });
    }
};

const actions = {
    //  获取所有频道类型
    async getChannelCategory({commit}) {
        try {
            let res = await service.getChannelType({});
            if (res && res.code === 0) {
                let liveChannelCategory = res.data.filter((item) => item.category === 'LIVE')
                                                  .map((item) => {
                                                      item.edit = false;
                                                      item.inputValue = item.name;
                                                      return item;
                                                  });
                let carouselChannelCategory = res.data.filter((item) => item.category === 'CAROUSEL')
                                                      .map((item) => {
                                                          item.edit = false;
                                                          item.inputValue = item.name;
                                                          return item;
                                                      });
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
            let channelTypeList = _.cloneDeep([...liveChannelCategory, ...carouselChannelCategory]).map((category, index) => {
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
                if (/^category_/.test(item.id)) {
                    delete item.id;
                }
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
    },
    async deleteProgrammeCategoryById({commit}, id) {
        try {
            let res = await service.deleteProgrammeCategoryById(id);
            if (res && res.code === 0) {
                commit('deleteProgrammeCategoryById', {id});
            }
        } catch (err) {
            console.log(err);
        }
    },
    //  根据id获取类型组的列表
    async getProgrammeTypeGroupListById({commit}, id) {
        try {
            let res = await service.getProgrammeTypeGroupListById(id);
            if (res && res.code === 0) {
                commit('setCategoryGroupList', {categoryGroupList: res.data});
            }
        } catch (err) {
            console.log(err);
        }
    },
    //  根据id保存类型组的列表
    async postProgrammeTypeGroupListById({commit, state}, id) {
        try {
            let res = await service.postProgrammeTypeGroupListById(id, state.categoryGroupList);
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
