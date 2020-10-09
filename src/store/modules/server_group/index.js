import {getPageSize} from '@/util/formValidate';
import _ from 'lodash';
import service from '../../../service';

let isLoading = false;

const defaultServerGroup = {
    name: '', // 组名称
    ip: '', // 组ip
    type: '', // 组类型
    no: '' // 频道数
};

const defaultSearchFields = {
    keyword: '', // 关键字
    type: '' // 组类型
};

const defaultPagination = {
    pageNum: 1,
    pageSize: getPageSize('serverGroupPageSize'),
    total: 0
};
const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
    currentServerGroup: _.cloneDeep(defaultServerGroup),
    list: [],
    pagination: _.cloneDeep(defaultPagination)
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
    currentServerGroup(state) {
        return state.currentServerGroup;
    }
};

const mutations = {
    resetState(state) {
        state = _.cloneDeep(defaultState);
    },
    setList(state, payload) {
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
    setCurrentServerGroup(state, payload) {
        state.currentServerGroup = payload.currentServerGroup;
    },
    updateCurrentServerGroup(state, payload) {
        let {key, value} = payload;
        state.currentServerGroup[key] = value;
    },
    updateSearchFields(state, payload) {
        let {key, value} = payload;
        state.searchFields[key] = value;
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    },
    resetServerGroup(state) {
        state.currentServerGroup = _.cloneDeep(defaultServerGroup);
    }
};

const actions = {
    async createServerGroup({state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let serverGroup = _.cloneDeep(state.currentServerGroup);
                let res = await service.createServerGroup(serverGroup);
                isLoading = false;
                if (res && res.code === 0) {
                    return res;
                }
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async updateServerGroupById({state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let serverGroup = Object.assign({}, state.currentServerGroup, {id});
                let res = service.updatePersonById(serverGroup);
                isLoading = false;
                if (res && res.code === 0) {
                    return res;
                }
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async getServerGroupList() {
        try {
            let res = await service.getServerGroupList();
            if (res && res.code === 0) {
                return res;
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
