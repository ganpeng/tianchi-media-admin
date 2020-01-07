import _ from 'lodash';
import service from '../../../service';
import {getPageSize} from '@/util/formValidate';

let isLoading = false;

const defaultVersion = {
    version: '', // 版本号
    versionCode: '', // 版本序列号
    updateLog: '', // 更新日志
    forced: '', // 是否强制升级
    uriPrefix: '', // 域名前缀
    fullPackageUri: '', // 全量升级包地址
    fullPackageMd5: '', // 包的md5
    incrPackageUri: '', // 增量升级包地址
    packageSize: '', // 包的大小
    clientVersionStatsList: [],
    districtCodeList: [],
    batchList: []
};

const defaultSearchFields = {
    releaseAtStart: '',
    releaseAtEnd: '',
    forced: '', // 强制升级
    keyword: '', // 关键字
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
    filialeList: [],
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
    },
    filialeList(state) {
        return state.filialeList;
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
    setFilialeList(state, payload) {
        state.filialeList = payload.filialeList;
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
        if (key === 'dateRange') {
            state.searchFields.releaseAtStart = state.searchFields.dateRange ? state.searchFields.dateRange[0] : '';
            state.searchFields.releaseAtEnd = state.searchFields.dateRange ? state.searchFields.dateRange[1] : '';
        }
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

function filterVersion(version) {
    return Object.assign({}, version, {
        forced: version.forced ? 1 : 0
    });
}

const actions = {
    async postAppVersion({commit, state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let version = _.cloneDeep(formatVersion(state.version));
                if (version.productType === 'TV_LAUNCHER') {
                    delete version.hardwareType;
                }
                let res = await service.postAppVersion(version);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async newAppPostVersion({commit, state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let version = _.cloneDeep(formatVersion(state.version));
                if (version.productType === 'TV_LAUNCHER') {
                    delete version.hardwareType;
                }
                let res = await service.newAppPostVersion(version);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async getAppVersionList({commit, state}) {
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
            let res = await service.getAppVersionList(params);
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('setList', {list});
                commit('setPagination', {pageNum: pageNum + 1, pageSize, total});
            }
        } catch (err) {}
    },
    async getAppVersionById({commit, state}, id) {
        try {
            let res = await service.getAppVersionById(id);
            if (res && res.code === 0) {
                commit('setVersion', {
                    version: Object.assign({ }, filterVersion(res.data))});
            }
        } catch (err) {
            console.log(err);
        }
    },
    async editAppVersionById({commit, state}, id) {
        try {
            let version = _.cloneDeep(formatVersion(state.version));
            let res = await service.editAppVersionById(Object.assign({}, version, {id}));
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteAppVersionById({commit, state}, id) {
        try {
            let res = await service.deleteAppVersionById(id);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 获取区域列表
     */
    async getFilialeList({commit}) {
        try {
            let res = await service.getFilialeList();
            if (res && res.code === 0) {
                commit('setFilialeList', {filialeList: res.data});
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
