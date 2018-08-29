import _ from 'lodash';
// let isLoading = false; // 解决重复调用列表接口的问题
const defaultSearchFields = {
    keyword: '',
    deviceType: '',
    status: ''
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const state = {
    searchFields: _.cloneDeep(defaultSearchFields),
    pagination: _.cloneDeep(defaultPagination),
    list: []
};

const getters = {
    state(state) {
        return state;
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
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    }
};

const actions = {
    async getDeviceList({commit, state}) {
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
