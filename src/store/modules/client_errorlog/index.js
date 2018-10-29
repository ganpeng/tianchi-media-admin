import _ from 'lodash';
import service from '../../../service';
const defaultSearchFields = {
    keyword: '',
    errorType: '',
    apkVersion: '',
    startedAt: undefined,
    endedAt: undefined
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
    },
    resetState(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
        state.pagination = _.cloneDeep(defaultPagination);
        state.list = [];
    }
};

const actions = {
    async getClientErrorLogList({commit, state}) {
        try {
            let params = Object.assign({}, state.searchFields, state.pagination, {
                pageNum: state.pagination.pageNum - 1
            });
            let res = await service.getClientErrorLogList(params);
            if (res && res.code === 0) {
                let {list, pageNum, pageSize, total} = res.data;
                commit('setList', {list});
                commit('setPagination', { pageNum: pageNum + 1, pageSize, total });
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
