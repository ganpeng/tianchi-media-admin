import { checkImageExist } from '@/util/formValidate';
import _ from 'lodash';
import service from '../../../service';
import role from '@/util/config/role';
const defaultPerson = {
    area: '',
    birthday: '',
    description: '',
    height: '',
    mainRoleList: [],
    name: '',
    namePinYin: '',
    namePy: '',
    posterImageList: [],
    programmeList: [],
    updatedAt: '',
    weight: '',
    avatarImage: {}
};

const defaultSearchFields = {
    name: '',
    area: ''
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const defaultRecommend = {
    isRecommend: 1,
    recommendList: []
};

const state = {
    recommend: _.cloneDeep(defaultRecommend),
    searchFields: _.cloneDeep(defaultSearchFields),
    currentPerson: _.cloneDeep(defaultPerson),
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const getters = {
    list(state) {
        return state.list;
    },
    pagination(state) {
        return state.pagination;
    },
    searchFields(state) {
        return state.searchFields;
    },
    currentPerson(state) {
        return state.currentPerson;
    },
    recommend(state) {
        return state.recommend;
    },
    posterImageList(state) {
        return state.currentPerson && state.currentPerson.posterImageList;
    },
    mainRoleLabel(state) {
        return (mainRoleList) => {
            return mainRoleList.map((item) => {
                return role.MAIN_ROLE_OPTIONS.find((mainRoleItem) => mainRoleItem.value === item).label;
            });
        };
    }
};

const mutations = {
    resetState(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
        state.currentPerson = _.cloneDeep(defaultPerson);
        state.list = [];
        state.pagination = _.cloneDeep(defaultPagination);
    },
    setPersonList(state, payload) {
        state.list = payload.list;
    },
    setPagination(state, payload) {
        state.pagination.pageSize = payload.pageSize;
        state.pagination.pageNum = payload.pageNum;
        state.pagination.total = payload.total;
    },
    updatePagination(state, payload) {
        let {key, value} = payload;
        state.pagination[key] = value;
    },
    setCurrentPerson(state, payload) {
        state.currentPerson = payload.currentPerson;
        let { posterImageList } = state.currentPerson;
        if (!Array.isArray(posterImageList)) {
            state.currentPerson.posterImageList = [];
        }
    },
    updateCurrentPerson(state, payload) {
        state.currentPerson[payload.key] = payload.value;
    },
    setRecommend(state, payload) {
        state.recommend = payload.recommend;
    },
    updateRecommend(state, payload) {
        let {key, value} = payload;
        state.recommend[key] = value;
    },
    updateSearchFields(state, payload) {
        let {key, value} = payload;
        state.searchFields[key] = value;
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    },
    resetPerson(state) {
        state.currentPerson = _.cloneDeep(defaultPerson);
    },
    addPosterImage(state, payload) {
        if (!state.currentPerson.posterImageList) {
            state.currentPerson.posterImageList = [];
        }
        if (!checkImageExist(state.currentPerson.posterImageList, payload.posterImage)) {
            state.currentPerson.posterImageList.push(payload.posterImage);
        }
    },
    deletePosterImage(state, payload) {
        let {posterImageList} = state.currentPerson;
        state.currentPerson.posterImageList = posterImageList.filter((image) => {
            return image.id !== payload.id;
        });
    },
    setAvatarImage(state) {
        state.currentPerson.avatarImage = state.currentPerson.posterImageList.find((img) => {
            return parseInt(img.width) === 200 && parseInt(img.height) === 200;
        });
    },
    setBackgroundImage(state) {
        state.currentPerson.backgroundImage = state.currentPerson.posterImageList.find((img) => {
            return parseInt(img.width) === 1920 && parseInt(img.height) === 1080;
        });
    }
};

const actions = {
    async getPersonList({commit, state}, {isProgramme, name}) {
        try {
            let searchName = !name ? state.searchFields.name : name;
            let {pageNum, pageSize} = state.pagination;
            let {area} = state.searchFields;
            let res = await service.getPersonList({ pageNum: pageNum - 1, pageSize, name: searchName, area });
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                if (!isProgramme) {
                    commit('setPersonList', {list});
                    commit('setPagination', {pageSize, pageNum: pageNum + 1, total});
                } else {
                    return res;
                }
            }
        } catch (err) {
        }
    },

    async getPersonById({commit, state}, id) {
        try {
            let res = await service.getPersonById(id);
            if (res && res.code === 0) {
                commit('setCurrentPerson', {currentPerson: res.data});
            }
        } catch (err) {
        }
    },

    async createPerson({commit, state}) {
        try {
            let person = _.cloneDeep(state.currentPerson);
            delete person.createdAt;
            let res = await service.createPerson(person);
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) {
        }
    },
    async updatePersonById({commit, state}) {
        try {
            let person = _.cloneDeep(state.currentPerson);
            delete person.createdAt;
            let res = service.updatePersonById(person.id, person);
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) {
        }
    },
    async searchPerson({commit, state}, name) {
        try {
            if (name) {
                let res = await service.getPersonList({ pageNum: 0, pageSize: 50, name });
                if (res && res.code === 0) {
                    return res;
                }
            }
        } catch (err) {}
    },
    async putHotPerson({commit, state}, figureId) {
        try {
            let hotFigureList = state.recommend.recommendList.map((item) => {
                let hotObj = role.RECOMMEND_OPTIONS.find((obj) => obj.value === item);
                let obj = Object.assign({}, {
                    hotCode: item,
                    hotName: hotObj ? hotObj.name : ''
                });
                return obj;
            });
            let res = await service.putHotPerson(figureId, hotFigureList);
            return res;
        } catch (err) { }
    },
    async getHotPerson({commit, state}, figureId) {
        try {
            let res = await service.getHotPerson(figureId);
            if (res && res.code === 0) {
                commit('setRecommend', {
                    recommend: {
                        isRecommend: res.data.length > 0 ? 0 : 1,
                        recommendList: res.data.map((item) => item.hotCode)
                    }
                });
            }
        } catch (err) {}
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
