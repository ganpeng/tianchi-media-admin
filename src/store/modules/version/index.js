import _ from 'lodash';
import service from '../../../service';
import {getPageSize} from '@/util/formValidate';

const defaultVersion = {
    productType: '', // 客户端类型
    version: '', // 版本号
    versionCode: '', // 版本序列号
    updateLog: '', // 更新日志
    forced: '', // 是否强制升级
    uriPrefix: '', // 域名前缀
    hardwareType: '', // 硬件类型
    fullPackageUri: '', // 全量升级包地址
    fullPackageMd5: '', // 包的md5
    incrPackageUri: '' // 增量升级包地址
};

const defaultSearchFields = {
    releaseAtStart: '',
    releaseAtEnd: '',
    forced: '', // 强制升级
    keyword: '', // 关键字
    productType: '', // 升级类型
    dateRange: [] // 时间区间
};

const defaultPagination = {
    pageNum: 0,
    pageSize: getPageSize('versionPageSize'),
    total: 0
};

const state = {
    searchFields: _.cloneDeep(defaultSearchFields),
    version: _.cloneDeep(defaultVersion),
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const getters = {
    list(state) {
        return state.list;
    },
    version(state) {
        return state.version;
    },
    pagination(state) {
        return state.pagination;
    },
    searchFields(state) {
        return state.searchFields;
    }
};

const mutations = {
    resetState(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
        state.version = _.cloneDeep(defaultVersion);
        state.list = [];
        state.pagination = _.cloneDeep(defaultPagination);
    },
    setList(state, payload) {
        state.list = payload.list;
    },
    setPagination(state, payload) {
        state.pagination.pageSize = payload.pageSize;
        state.pagination.pageNum = payload.pageNum;
        state.pagination.total = payload.total;
    },
    resetPagination(state, payload) {
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
    setVersion(state, payload) {
        state.version = payload.version;
    },
    updateVersion(state, payload) {
        let {key, value} = payload;
        state.version[key] = value;
    },
    resetVersion(state) {
        state.version = _.cloneDeep(defaultVersion);
    }
};

function formatVersion(version) {
    return Object.assign({}, version, {
        forced: version.forced === 1
    });
}

const actions = {
    async postVersion({commit, state}) {
        try {
            let version = formatVersion(state.version);
            let res = await service.postVersion(version);
            return res;
        } catch (err) {}
    },
    async getVersionList({commit, state}) {
        try {
            let {searchFields} = state;
            let params = {
                releaseAtStart: searchFields.releaseAtStart,
                releaseAtEnd: searchFields.releaseAtEnd,
                forced: searchFields.forced !== '' ? searchFields.forced === 1 : searchFields.forced,
                keyword: searchFields.keyword,
                productType: searchFields.productType,
                pageNum: state.pagination.pageNum > 0 ? state.pagination.pageNum - 1 : 0,
                pageSize: state.pagination.pageSize
            };
            let res = await service.getVersionList(params);
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('setList', {list});
                commit('setPagination', {pageNum: pageNum + 1, pageSize, total});
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
