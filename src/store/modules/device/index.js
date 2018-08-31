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
        try {
            let params = Object.assign({}, state.pageSize, state.searchFields);
            let res = await service.getDeviceList(params);
            if (res && res.code === 0) {
                let {list, pageNum, pageSize, total} = res.data;
                commit('setList', {list});
                commit('setPagination', { pageNum, pageSize, total });
            }
        } catch (err) {}
    },
    async addDevice({commit, state}) {
        try {
            let device = _.cloneDeep(state.device);
            let res = await service.addDevice(device);
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
