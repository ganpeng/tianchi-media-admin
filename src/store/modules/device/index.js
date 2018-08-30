import _ from 'lodash';
// let isLoading = false; // 解决重复调用列表接口的问题
const defaultSearchFields = {
    keyword: '',
    hardwareType: '',
    visible: ''
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const defaultDevice = {
    caNo: '',
    hardwareType: '',
    visible: true
};

const state = {
    searchFields: _.cloneDeep(defaultSearchFields),
    pagination: _.cloneDeep(defaultPagination),
    list: [],
    device: _.cloneDeep(defaultDevice)
};

const getters = {
    state(state) {
        return state;
    },
    device(state) {
        return state.device;
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
    },
    updateDevice(state, payload) {
        let {key, value} = payload;
        state.device[key] = value;
    },
    resetDevice(state) {
        state.device = _.cloneDeep(defaultDevice);
    },
    resetState(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
        state.pagination = _.cloneDeep(defaultPagination);
        state.list = [];
        state.device = _.cloneDeep(defaultDevice);
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
