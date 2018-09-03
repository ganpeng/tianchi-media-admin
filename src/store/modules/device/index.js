import _ from 'lodash';
import service from '../../../service';
// let isLoading = false; // 解决重复调用列表接口的问题
const defaultSearchFields = {
    no: '',
    hardWareId: '',
    status: ''
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const defaultDevice = {
    no: '',
    hardWareId: ''
};

const state = {
    searchFields: _.cloneDeep(defaultSearchFields),
    pagination: _.cloneDeep(defaultPagination),
    list: [],
    device: _.cloneDeep(defaultDevice),
    currentId: null
};

const getters = {
    state(state) {
        return state;
    },
    currentId() {
        return state.currentId;
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
    setCurrentId(state, payload) {
        state.currentId = payload.id;
    },
    setDevice(state, payload) {
        state.device = _.cloneDeep(payload.device);
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
        state.currentId = null;
    }
};

const actions = {
    async getDeviceList({commit, state}) {
        try {
            let {pageNum, pageSize} = state.pagination;
            let params = Object.assign({}, state.searchFields, {pageNum: pageNum - 1, pageSize});
            let res = await service.getDeviceList(params);
            if (res && res.code === 0) {
                let {list, pageNum, pageSize, total} = res.data;
                commit('setList', {list});
                commit('setPagination', { pageNum: pageNum + 1, pageSize, total });
            }
        } catch (err) {}
    },
    async addDevice({commit, state}) {
        try {
            let device = _.cloneDeep(state.device);
            let res = await service.addDevice(device);
            return res;
        } catch (err) { }
    },
    async updateDeviceById({commit, state}) {
        try {
            let device = state.device;
            let id = state.currentId;
            let res = await service.updateDeviceById(id, device);
            return res;
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
