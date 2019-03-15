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
    hardwareType: '', // 硬件类型
    fullPackageUri: '', // 全量升级包地址
    fullPackageMd5: '', // 包的md5
    incrPackageUri: '', // 增量升级包地址
    common: false, // 是否全局升级
    companyList: [] // 所属区域
};

const defaultSearchFields = {
    releaseAtStart: '',
    releaseAtEnd: '',
    common: '',
    companyCode: '',
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
        if (key === 'dateRange') {
            state.searchFields.releaseAtStart = state.searchFields.dateRange ? state.searchFields.dateRange[0] : '';
            state.searchFields.releaseAtEnd = state.searchFields.dateRange ? state.searchFields.dateRange[1] : '';
        }
        if (key === 'common') {
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
    },
    resetVersion(state) {
        state.version = _.cloneDeep(defaultVersion);
    },
    //  增加公司到列表
    addCompanyToList(state, payload) {
        let {company} = payload;
        if (_.isNull(state.version.companyList)) {
            state.version.companyList = [];
        }
        let {name} = company;
        if (name === '全部') {
            state.version.companyList = _.cloneDeep(state.filialeList);
        } else {
            state.version.companyList.push(company);
        }
        state.version.companyList = _.uniqBy(state.version.companyList, 'id');
        let flag = checkCompanyListIsAll(state.version.companyList, state.filialeList);
        state.version.common = flag;
    },
    //  从列表中删除公司
    deleteCompanyFromList(state, payload) {
        let {company} = payload;
        state.version.companyList = state.version.companyList.filter((_company) => {
            return _company.id !== company.id;
        });
        let flag = checkCompanyListIsAll(state.version.companyList, state.filialeList);
        state.version.common = flag;
    }
};

function checkCompanyListIsAll(source, target) {
    let sortedSource = _.chain(_.cloneDeep(source)).sortBy('id').value();
    let sortedTarget = _.chain(_.cloneDeep(target)).sortBy('id').value();
    let flag = _.isEqual(sortedSource, sortedTarget);
    return flag;
}

function formatVersion(version) {
    return Object.assign({}, version, {
        forced: version.forced === 1
    });
}

const actions = {
    async postVersion({commit, state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let version = _.cloneDeep(formatVersion(state.version));
                if (version.common) {
                    delete version.companyList;
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
    },
    async getVersionById({commit, state}, id) {
        try {
            let res = await service.getVersionById(id);
            if (res && res.code === 0) {
                commit('setVersion', {version: Object.assign({companyList: []}, res.data)});
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
