import _ from 'lodash';
// import service from '../../../service';

// let isLoading = false;

let defaultSearchFields = {};

let defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

let defaultAdvertisingOwner = {
};

const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
    list: [],
    pagination: _.cloneDeep(defaultPagination),
    advertisingOwner: _.cloneDeep(defaultAdvertisingOwner)
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
    }
};

const mutations = {
    setList(state, payload) {
        state.list = payload.list;
    },
    resetState(state) {
        state = _.clone(defaultState);
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
    // 搜索
    updateSearchFields(state, payload) {
        let {key, value} = payload;
        state.searchFields[key] = value;
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    }
};

const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
