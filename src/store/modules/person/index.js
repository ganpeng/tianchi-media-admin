import {checkImageExist, getPageSize} from '@/util/formValidate';
import _ from 'lodash';
import service from '../../../service';
import role from '@/util/config/role';

const defaultPerson = {
    alias: '',
    englishName: '',
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
    avatarImage: null
};

const defaultSearchFields = {
    name: '',
    area: ''
};

const defaultPagination = {
    pageNum: 1,
    pageSize: getPageSize('personPageSize'),
    total: 0
};

const defaultHotPerson = {
    persons: [],
    personsResult: [],
    hotCode: '',
    personId: '',
    hotPerson: role.RECOMMEND_OPTIONS.reduce((prev, curr) => {
        prev[curr.value] = [];
        return prev;
    }, {})
};

const defaultDuplicate = {
    searchFields: _.cloneDeep(defaultSearchFields),
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const defaultState = {
    hotPerson: _.cloneDeep(defaultHotPerson),
    searchFields: _.cloneDeep(defaultSearchFields),
    currentPerson: _.cloneDeep(defaultPerson),
    list: [],
    pagination: _.cloneDeep(defaultPagination),
    duplicate: _.cloneDeep(defaultDuplicate)
};

const state = _.cloneDeep(defaultState);

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
    duplicate(state) {
        return state.duplicate;
    },
    // 热门人物部分
    hotPerson(state) {
        return state.hotPerson;
    },
    getHotName(state) {
        return (hotCode) => {
            let type = role.RECOMMEND_OPTIONS.find((item) => item.value === hotCode);
            return type ? type.name : '';
        };
    },
    getHotPersonList(state) {
        return (hotCode) => {
            let list = state.hotPerson.hotPerson[hotCode];
            return list || [];
        };
    },
    getPersonDesc(state) {
        let {personsResult} = state.hotPerson;
        let person = personsResult.find((person) => {
            return person.id === state.hotPerson.personId;
        });
        return person ? person.description : '';
    },
    posterImageList(state) {
        return state.currentPerson && state.currentPerson.posterImageList;
    },
    mainRoleLabel(state) {
        return (mainRoleList) => {
            return mainRoleList.map((item) => {
                let obj = role.MAIN_ROLE_OPTIONS.find((mainRoleItem) => mainRoleItem.value === item);
                return obj && obj.label ? obj.label : '';
            });
        };
    }
};

const mutations = {
    resetState(state) {
        state.currentPerson = _.cloneDeep(defaultPerson);
        state.list = [];
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
    resetPagination(state) {
        state.pagination = _.cloneDeep(defaultPagination);
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
    // 热门人物管理
    updatePersonResult(state, payload) {
        let {key, value} = payload;
        let personKey = key.split('Result')[0];
        let prevPersonList = state.hotPerson[key].filter((person) => {
            let index = state.hotPerson[personKey].findIndex((item) => item.id === person.id);
            if (index >= 0) {
                return person;
            }
        });
        let result = value.concat(prevPersonList);
        state.hotPerson[key] = _.uniqBy(result, 'id');
    },
    updatePerson(state, payload) {
        let {key, idList} = payload;
        let personList = idList.map((id) => {
            let resultKey = `${key}Result`;
            return state.hotPerson[resultKey].find((item) => {
                return item.id === id;
            });
        });
        state.hotPerson[key] = personList;
    },
    updateHotPerson(state, payload) {
        let {key, value} = payload;
        state.hotPerson[key] = value;
    },
    setHotCode(state, payload) {
        state.hotPerson.hotCode = payload.hotCode;
    },
    // 热门人物结束
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
            return parseInt(img.width) === 260 && parseInt(img.height) === 260;
        });
    },
    setBackgroundImage(state) {
        state.currentPerson.backgroundImage = state.currentPerson.posterImageList.find((img) => {
            return parseInt(img.width) === 1920 && parseInt(img.height) === 1080;
        });
    },
    //  人物去重部分
    setDuplicateList(state, payload) {
        state.duplicate.list = payload.list;
    },
    setDuplicatePagination(state, payload) {
        state.duplicate.pagination.pageSize = payload.pageSize;
        state.duplicate.pagination.pageNum = payload.pageNum;
        state.duplicate.pagination.total = payload.total;
    },
    updateDuplicatePagination(state, payload) {
        let {key, value} = payload;
        state.duplicate.pagination[key] = value;
    },
    updateDuplicateSearchFields(state, payload) {
        let {key, value} = payload;
        state.duplicate.searchFields[key] = value;
    },
    //  人物角色的搜索以及增删改查开始
    addMainRoleToList(state, payload) {
        let {mainRole} = payload;
        let value = _.get(mainRole, 'value');
        state.currentPerson.mainRoleList.push(value);
        state.currentPerson.mainRoleList = _.uniq(state.currentPerson.mainRoleList);
    },
    deleteMainRoleByValue(state, payload) {
        let {value} = payload;
        state.currentPerson.mainRoleList = state.currentPerson.mainRoleList.filter((item) => item !== value);
    }
    //  人物角色的搜索以及增删改查结束
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
            return res;
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
    async putHotPerson({commit, state}, {hotCategory, hotFigureList}) {
        try {
            let res = await service.putHotPerson(hotCategory, hotFigureList);
            return res;
        } catch (err) { }
    },
    async getHotPerson({commit, state}) {
        try {
            let res = await service.getHotPerson();
            if (res && res.code === 0) {
                commit('updateHotPerson', {key: 'hotPerson', value: groupHotPerson(res.data)});
            }
        } catch (err) {}
    },
    async lowerFramePerson({commit, state}, id) {
        try {
            let res = await service.lowerFramePerson(id);
            return res;
        } catch (err) {}
    },
    async deletePerson({commit, state}, id) {
        try {
            let res = await service.deletePerson(id);
            return res;
        } catch (err) { }
    },
    async getDuplicateList({commit, state}) {
        try {
            let {name} = state.duplicate.searchFields;
            let {pageNum, pageSize} = state.duplicate.pagination;
            let res = await service.getDuplicateList({pageNum: pageNum - 1, pageSize, name});
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                let newList = list.reduce((result, curr) => {
                    result = result.concat(curr.figureList);
                    return result;
                }, []);
                commit('setDuplicateList', {list: newList});
                commit('setDuplicatePagination', {pageSize, pageNum: pageNum + 1, total});
            }
        } catch (err) {
            console.log(err);
        }
    },
    async checkAliasIsExist({commit, state}) {
        try {
            let {alias} = state.currentPerson;
            let res = await service.checkAliasIsExist(alias);
            return res;
        } catch (err) {
            console.log(err);
        }
    }
};

function groupHotPerson(list) {
    return role.RECOMMEND_OPTIONS.reduce((prev, curr) => {
        let key = curr.value;
        let hotPersonList = list.filter((ele) => ele.hotCategory === curr.value);
        hotPersonList.sort((a, b) => a.sort - b.sort);
        prev[key] = hotPersonList;
        return prev;
    }, {});
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
