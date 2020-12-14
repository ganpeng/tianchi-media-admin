import _ from 'lodash';
import service from '../../../service';
let isLoading = false; // 解决重复调用列表接口的问题
const defaultSearchFields = {
    keyword: '',
    createdAtStart: '',
    createdAtEnd: '',
    expiredAtStart: '',
    expiredAtEnd: '',
    updatedAtStart: '',
    updatedAtEnd: '',
    createdAt: [],
    expiredAt: [],
    updatedAt: []
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const defaultBoss = {
    stbNo: '',
    expiredAt: ''
};

const state = {
    searchFields: _.cloneDeep(defaultSearchFields),
    pagination: _.cloneDeep(defaultPagination),
    list: [],
    boss: _.cloneDeep(defaultBoss)
};

const getters = {
    state(state) {
        return state;
    },
    boss(state) {
        return state.boss;
    },
    pagination(state) {
        return state.pagination;
    },
    searchFields(state) {
        return state.searchFields;
    },
    list(state) {
        return state.list;
    }
};

const mutations = {
    setList(state, payload) {
        state.list = payload.list;
    },
    setPagination(state, payload) {
        state.pagination.pageSize = payload.pageSize;
        state.pagination.pageNum = payload.pageNum;
        state.pagination.total = payload.total;
    },
    resetPagination(state) {
        state.pagination = _.cloneDeep(defaultPagination);
    },
    updatePagination(state, payload) {
        let {key, value} = payload;
        state.pagination[key] = value;
    },
    updateSearchFields(state, payload) {
        let {key, value} = payload;
        state.searchFields[key] = value;
        if (key === 'createdAt') {
            state.searchFields.createdAtStart = state.searchFields.createdAt ? state.searchFields.createdAt[0] : '';
            state.searchFields.createdAtEnd = state.searchFields.createdAt ? state.searchFields.createdAt[1] : '';
        }
        if (key === 'expiredAt') {
            state.searchFields.expiredAtStart = state.searchFields.expiredAt ? state.searchFields.expiredAt[0] : '';
            state.searchFields.expiredAtEnd = state.searchFields.expiredAt ? state.searchFields.expiredAt[1] : '';
        }
        if (key === 'updatedAt') {
            state.searchFields.updatedAtStart = state.searchFields.updatedAt ? state.searchFields.updatedAt[0] : '';
            state.searchFields.updatedAtEnd = state.searchFields.updatedAt ? state.searchFields.updatedAt[1] : '';
        }
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    },
    setBoss(state, payload) {
        state.boss = _.cloneDeep(payload.boss);
    },
    updateBoss(state, payload) {
        let {key, value} = payload;
        state.boss[key] = value;
    },
    resetBoss(state) {
        state.boss = _.cloneDeep(defaultBoss);
    },
    resetState(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
        state.pagination = _.cloneDeep(defaultPagination);
        state.list = [];
        state.boss = _.cloneDeep(defaultBoss);
    }
};

const actions = {
    async getBossList({commit, state}) {
        try {
            let {pageNum, pageSize} = state.pagination;
            let params = Object.assign({},
                {pageNum: pageNum - 1, pageSize}, state.searchFields);
            let res = await service.getBossList(params);
            if (res && res.code === 0) {
                let {list, pageNum, pageSize, total} = res.data;
                commit('setList', {list});
                commit('setPagination', { pageNum: pageNum + 1, pageSize, total });
            }
        } catch (err) {
            console.log(err);
        }
    },
    async addBoss({state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let boss = _.cloneDeep(state.boss);
                let res = await service.addBoss(boss);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async getBossById({commit}, id) {
        try {
            let res = await service.getBossById(id);
            if (res && res.code === 0) {
                commit('setBoss', {boss: res.data});
            }
        } catch (err) {
            console.log(err);
        }
    },
    async updateBossById({state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let boss = Object.assign({}, state.boss, {id});
                let res = await service.updateBossById(boss);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async deleteBossByIdList({commit}, idList) {
        try {
            let res = await service.deleteBossByIdList(idList);
            return res;
        } catch (err) { }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
