import _ from 'lodash';
import service from '../../../service';

// let isLoading = false;

let defaultSearchFields = {
    keyword: '',
    adType: '',
    mediaType: '',
    adVisible: '',
    adStatus: '',
    createdAtStart: '',
    createdAtEnd: '',
    dateRange: []
};

let defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

let defaultAdvertisingOwner = {
    id: '',
    name: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    adMaterialList: []
};

const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
    list: [],
    pagination: _.cloneDeep(defaultPagination),
    advertisingOwner: _.cloneDeep(defaultAdvertisingOwner)
};

const state = _.cloneDeep(defaultState);

const getters = {
    advertisingOwner(state) {
        return state.advertisingOwner;
    },
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
        if (key === 'dateRange') {
            state.searchFields.createdAtStart = state.searchFields.dateRange ? state.searchFields.dateRange[0] : '';
            state.searchFields.createdAtEnd = state.searchFields.dateRange ? state.searchFields.dateRange[1] : '';
        }
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    },
    setAdvertisingOwner(state, payload) {
        state.advertisingOwner = payload.advertisingOwner;
    },
    updateAdvertisingOwner(state, payload) {
        let {key, value} = payload;
        state.advertisingOwner[key] = value;
    },
    addAdMaterial(state, payload) {
        let {adMaterial} = payload;
        state.advertisingOwner.adMaterialList.push(adMaterial);
        state.advertisingOwner.adMaterialList = _.uniqBy(state.advertisingOwner.adMaterialList, 'storageId');
    },
    deleteAdMaterialById(state, payload) {
        let {id} = payload;
        state.advertisingOwner.adMaterialList = state.advertisingOwner.adMaterialList.filter((item) => item.storageId !== id);
    }
};

const actions = {
    /**
     * 新增广告主
     */
    async newAdvertisingOwner({state}) {
        try {
            let {advertisingOwner} = state;
            let reqBody = _.pick(advertisingOwner, ['name', 'description', 'adMaterialList']);
            let res = await service.postAdvertisingOwner(reqBody);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 编辑广告主
     */
    async editAdvertisingOwner({state}, id) {
        try {
            let {advertisingOwner} = state;
            let reqBody = Object.assign({id}, _.pick(advertisingOwner, ['name', 'description', 'adMaterialList']));
            let res = await service.putAdvertisingOwner(reqBody);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 根据id获取广告主
     */
    async getAdvertisingOwnerById({state, commit}, id) {
        try {
            let res = await service.getAdvertisingOwnerById(id);
            if (res && res.code === 0) {
                let advertisingOwner = _.pick(res.data, ['id', 'name', 'description', 'adMaterialList', 'createdAt', 'updatedAt']);
                commit('setAdvertisingOwner', {advertisingOwner});
            }
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async getAdvertisingOwnerList({state, commit}) {
        try {
            let params = Object.assign({}, state.searchFields, state.pagination, {
                pageNum: state.pagination.pageNum - 1
            });
            params = _.omit(params, ['dateRange', 'total']);
            console.log(params);
            let res = await service.getAdvertisingOwnerList(params);
            if (res && res.code === 0) {
                let {list, pageNum, pageSize, total} = res.data;
                commit('setList', {list});
                commit('setPagination', { pageNum: pageNum + 1, pageSize, total });
            }
        } catch (err) {
            console.log(err);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
