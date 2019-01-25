import _ from 'lodash';
import service from '../../../service';
// let isLoading = false; // 解决重复调用列表接口的问题
const defaultSearchFields = {
    no: '',
    hardWareId: '',
    status: '',
    registeredAtStart: '',
    registeredAtEnd: '',
    registeredAt: []
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const defaultDevice = {
    caNo: '',
    no: '',
    hardWareId: '',
    status: 'NORMAL'
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
        if (key === 'registeredAt') {
            state.searchFields.registeredAtStart = state.searchFields.registeredAt ? state.searchFields.registeredAt[0] : '';
            state.searchFields.registeredAtEnd = state.searchFields.registeredAt ? state.searchFields.registeredAt[1] : '';
        }
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
            let {no, hardWareId, status, registeredAtStart, registeredAtEnd} = state.searchFields;
            let params = Object.assign({},
                {pageNum: pageNum - 1, pageSize}, {
                    no, hardWareId, status, registeredAtStart, registeredAtEnd
                });
            let res = await service.getDeviceList(params);
            if (res && res.code === 0) {
                let {list, pageNum, pageSize, total} = res.data;
                commit('setList', {list});
                commit('setPagination', { pageNum: pageNum + 1, pageSize, total });
            }
        } catch (err) {
            console.log(err);
        }
    },
    async addDevice({commit, state}) {
        try {
            let device = _.cloneDeep(state.device);
            let res = await service.addDevice(device);
            return res;
        } catch (err) { }
    },
    async getDeviceById({commit, state}, id) {
        try {
            let res = await service.getDeviceById(id);
            if (res && res.code === 0) {
                commit('setDevice', {device: res.data});
            }
        } catch (err) {
            console.log(err);
        }
    },
    async updateDeviceById({commit, state}) {
        try {
            let device = state.device;
            let id = state.currentId;
            let res = await service.updateDeviceById(id, device);
            return res;
        } catch (err) {}
    },
    async deleteDeviceById({commit, state}, id) {
        try {
            let res = await service.deleteDeviceById(id);
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
