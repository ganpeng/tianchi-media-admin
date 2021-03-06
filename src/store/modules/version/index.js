import _ from 'lodash';
import service from '../../../service';
import {getPageSize} from '@/util/formValidate';

let isLoading = false;

const defaultVersion = {
    productType: '', // 客户端类型
    version: '', // 版本号
    versionCode: '', // 版本序列号
    updateLog: '', // 更新日志
    forced: '', // 是否强制升级
    uriPrefix: '', // 域名前缀
    // hardwareType: '', // 硬件类型
    fullPackageUri: '', // 全量升级包地址
    fullPackageMd5: '', // 包的md5
    incrPackageUri: '', // 增量升级包地址
    packageSize: '', // 包的大小
    allCompanyUpdate: false, // 是否全局升级
    districtCodeList: [], // 所属区域
    clientVersionStatsList: [],
    //  dev_v2.5 新增
    updateAccord: '', //  CA 或者 SN
    batchList: []
};

const defaultSearchFields = {
    releaseAtStart: '',
    releaseAtEnd: '',
    allCompanyUpdate: '',
    companyCode: '',
    forced: '', // 强制升级
    keyword: '', // 关键字
    productType: '', // 升级类型
    dateRange: [], // 时间区间
    releaseStatus: '', //  RELEASED 已发布  WITHDRAW 已撤回  PRE_RELEASED 未发布
    sortKey: '',
    sortDirection: ''
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
        if (key === 'allCompanyUpdate') {
            if (value || value === '') {
                state.searchFields.companyCode = '';
            }
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
        if (key === 'updateAccord' && value === '') {
            state.version.districtCodeList = [];
        }
    },
    resetVersion(state) {
        state.version = _.cloneDeep(defaultVersion);
    },
    //  增加公司到列表
    addCompanyToList(state, payload) {
        let {company} = payload;
        if (_.isNull(state.version.districtCodeList)) {
            state.version.districtCodeList = [];
        }
        let {name} = company;
        if (name === '全部') {
            state.version.districtCodeList = _.cloneDeep(state.filialeList);
        } else {
            state.version.districtCodeList.push(company);
        }
        state.version.districtCodeList = _.uniqBy(state.version.districtCodeList, 'id');
        let flag = checkCompanyListIsAll(state.version.districtCodeList, state.filialeList);
        state.version.allCompanyUpdate = flag;
    },
    //  从列表中删除公司
    deleteCompanyFromList(state, payload) {
        let {company} = payload;
        state.version.districtCodeList = state.version.districtCodeList.filter((_company) => {
            return _company.id !== company.id;
        });
        let flag = checkCompanyListIsAll(state.version.districtCodeList, state.filialeList);
        state.version.allCompanyUpdate = flag;
    },
    //  dev_v2.5 新增逻辑
    addBatch(state, payload) {
        let {codeList} = payload;
        state.version.batchList.push({codeList});
    },
    replaceBatch(state, payload) {
        let {index, codeList} = payload;
        _.set(state.version.batchList, `${index}`, {codeList});
    }
};

function checkCompanyListIsAll(source, target) {
    let sortedSource = _.chain(_.cloneDeep(source)).sortBy('id').value();
    let sortedTarget = _.chain(_.cloneDeep(target)).sortBy('id').value();
    let flag = _.isEqual(sortedSource, sortedTarget);
    return flag;
}

function formatVersion(version) {
    let versionCopy = _.cloneDeep(version);

    if (!versionCopy.updateAccord) {
        delete versionCopy.updateAccord;
        delete versionCopy.batchList;
    }

    if (!versionCopy.hardwareType) {
        delete versionCopy.hardwareType;
    }

    return Object.assign({}, versionCopy, {
        forced: version.forced === 1
    });
}

function filterVersion(version) {
    return Object.assign({}, version, {
        forced: version.forced ? 1 : 0
    });
}

const actions = {
    async postVersion({commit, state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let version = _.cloneDeep(formatVersion(state.version));
                // if (version.allCompanyUpdate) {
                //     delete version.districtCodeList;
                // } else {
                //     version.districtCodeList = version.districtCodeList.map((item) => item.code);
                // }
                if (version.productType === 'TV_LAUNCHER') {
                    delete version.hardwareType;
                }
                let res = await service.postVersion(version);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async newPostVersion({commit, state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let version = _.cloneDeep(formatVersion(state.version));
                if (version.productType === 'TV_LAUNCHER') {
                    delete version.hardwareType;
                }
                console.log(version);
                let res = await service.newPostVersion(version);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    async getVersionList({commit, state}) {
        try {
            let {searchFields} = state;
            let params = {
                releaseStatus: searchFields.releaseStatus,
                releaseAtStart: searchFields.releaseAtStart,
                releaseAtEnd: searchFields.releaseAtEnd,
                forced: searchFields.forced !== '' ? searchFields.forced === 1 : searchFields.forced,
                keyword: searchFields.keyword,
                productType: searchFields.productType,
                pageNum: state.pagination.pageNum > 0 ? state.pagination.pageNum - 1 : 0,
                pageSize: state.pagination.pageSize,
                allCompanyUpdate: searchFields.allCompanyUpdate,
                companyCode: searchFields.companyCode,
                sortKey: searchFields.sortKey,
                sortDirection: searchFields.sortDirection
            };
            let res = await service.getVersionList(params);
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('setList', {list});
                commit('setPagination', {pageNum: pageNum + 1, pageSize, total});
            }
        } catch (err) {}
    },
    async getVersionById({commit, state}, id) {
        try {
            let res = await service.getVersionById(id);
            if (res && res.code === 0) {
                commit('setVersion', {
                    version: Object.assign({
                        districtCodeList: [],
                        clientVersionStatsList: []
                    }, filterVersion(res.data))});
            }
        } catch (err) {
            console.log(err);
        }
    },
    async editVersionById({commit, state}, id) {
        try {
            let version = _.cloneDeep(formatVersion(state.version));
            let res = await service.editVersionById(Object.assign({}, version, {id}));
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteVersionById({commit, state}, id) {
        try {
            let res = await service.deleteVersionById(id);
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
