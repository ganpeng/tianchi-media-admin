import _ from 'lodash';
import service from '../../../service';
let isLoading = false; // 解决重复调用列表接口的问题
const defaultSearchFields = {
    no: '',
    hardWareId: '',
    status: '',
    code: '',
    registeredAtStart: '',
    registeredAtEnd: '',
    registeredAt: [],
    sortKey: '',
    sortDirection: ''
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
            let {sortKey, sortDirection} = state.searchFields;
            let order = '';
            if (sortKey && sortDirection) {
                order = `${sortKey}_${sortDirection}`;
            }
            let params = Object.assign({},
                {pageNum: pageNum - 1, pageSize, order}, state.searchFields);
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
            if (!isLoading) {
                isLoading = true;
                let device = _.cloneDeep(state.device);
                let res = await service.addDevice(device);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
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
    async updateDeviceById({commit, state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let device = state.device;
                let res = await service.updateDeviceById(id, device);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
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
