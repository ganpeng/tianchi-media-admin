import _ from 'lodash';
import service from '../../../service';
import {getPageSize} from '@/util/formValidate';

let isLoading = false;

let defaultChannelTypeList = [
    {
        name: '直播频道',
        category: 'LIVE',
        id: 1
    },
    {
        name: '轮播频道',
        category: 'CAROUSEL',
        id: 2
    }
];

let defaultSearchFields = {
    keyword: '',
    typeIdList: '',
    companyCode: undefined,
    record: undefined,
    category: 'LIVE',
    common: undefined,
    visible: '',
    protocolList: [],
    refCount: '', // 关联
    paymentType: '',
    // dev_v2.6 新增
    applicableClientList: []
};

let defaultPagination = {
    pageNum: 1,
    pageSize: getPageSize('channelPageSize'),
    total: 0
};

let defaultLiveChannel = {
    code: '', // 直播频道的编号, 不可修改
    id: '', // 频道id
    name: '', // 直播频道名称
    no: '', // 直播频道展示编号
    category: 'LIVE', // 是直播还是轮播 "LIVE" 表示直播
    free: false, // 是否收费
    innerName: '', // 直播频道展示名
    logoUri: '',
    multicastIp: '', // ip地址
    multicastPort: '', // 端口
    pushServer: '', // 所属服务器
    serverGroup: '', // 服务器组
    releaseStatus: '', // 直播频道的发布状态
    status: '', // 直播频道状态`
    record: '', // 是否支持直播回看
    recordIp: '', // 回看Ip
    recordPort: '', // 回看端口
    audioPid: '',
    videoPid: '',
    //  直播频道的类型列表
    typeList: [],
    companyList: [],
    protocolList: [],
    visible: false, // 是否上下架
    paymentType: 'FREE',
    //  dev_v2.6 新增
    applicableClientList: ['TV'],
    // 年后新增的字段
    cdnPush: false,
    pushAddress: '',
    pullAddress: ''
};

const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
    filialeList: [],
    list: [],
    pagination: _.cloneDeep(defaultPagination),
    liveChannel: _.cloneDeep(defaultLiveChannel),
    liveChannelTypeList: [],
    carouselChannelTypeList: [],
    channelTypeList: []
};

const state = _.cloneDeep(defaultState);

const getters = {
    channelState(state) {
        return state;
    },
    list(state) {
        return state.list;
    },
    filialeList(state) {
        return state.filialeList;
    },
    pagination(state) {
        return state.pagination;
    },
    searchFields(state) {
        return state.searchFields;
    },
    liveChannel(state) {
        return state.liveChannel;
    },
    liveChannelTypeList(state) {
        return state.channelTypeList.filter((type) => type.category === 'LIVE');
    },
    channelTypeList(state) {
        return state.channelTypeList;
    },
    typeIdList(state) {
        return state.liveChannel.typeList.map((type) => type.id);
    },
    typeName(state) {
        return (id) => {
            let channel = state.list.find((channel) => channel.id === id);
            return channel ? channel.typeList.map((type) => type.name).join(', ') : '';
        };
    },
    serializeChannelTypeList(state) {
        let res = defaultChannelTypeList.map((item) => {
            item.list = state.channelTypeList.filter((type) => type.category === item.category);
            return item;
        });
        return res;
    }
};

const mutations = {
    setList(state, payload) {
        state.list = payload.list;
    },
    resetState(state) {
        state = _.clone(defaultState);
    },
    setFilialeList(state, payload) {
        state.filialeList = payload.filialeList;
    },
    // 频道分页
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
        if (key === 'common') {
            if (value || value === '') {
                state.searchFields.companyCode = '';
            }
        }
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    },
    setLiveChannel(state, payload) {
        state.liveChannel = payload.liveChannel;
    },
    updateLiveChannel(state, payload) {
        let {key, value} = payload;
        state.liveChannel[key] = value;
        if (key === 'cdnPush') {
            if (value) {
                state.liveChannel.protocolList = state.liveChannel.protocolList.filter((item) => item !== 'UDP');
            } else {
                state.liveChannel.pullAddress = '';
                state.liveChannel.pushAddress = '';
            }
        }
    },
    resetLiveChannel(state) {
        state.liveChannel = _.cloneDeep(defaultLiveChannel);
    },
    setChannelTypeList(state, payload) {
        state.channelTypeList = payload.list;
    },
    setLiveChannelTypeList(state, payload) {
        state.liveChannelTypeList = payload.list;
    },
    setCarouselChannelTypeList(state, payload) {
        state.carouselChannelTypeList = payload.list;
    },
    addChannelCategory(state, payload) {
        let {name, data: {category}} = payload;
        let channelCategory = {name, category, id: _.uniqueId('category_')};
        if (category === 'LIVE') {
            state.liveChannelTypeList.push(channelCategory);
        } else {
            state.carouselChannelTypeList.push(channelCategory);
        }
    },
    deleteChannelCategory(state, payload) {
        let {data: {id, category}} = payload;
        if (category === 'LIVE') {
            state.liveChannelTypeList = state.liveChannelTypeList.filter((type) => type.id !== id);
        } else {
            state.carouselChannelTypeList = state.carouselChannelTypeList.filter((type) => type.id !== id);
        }
    },
    //  新增频道类型到当前频道的typeList
    addLiveCategoryToList(state, payload) {
        let {liveCategory} = payload;
        state.liveChannel.typeList.push(liveCategory);
        state.liveChannel.typeList = _.uniqBy(state.liveChannel.typeList, 'id');
    },
    //  从当前频道的typeList中删除频道类型
    deleteLiveCategoryById(state, payload) {
        let {id} = payload;
        state.liveChannel.typeList = state.liveChannel.typeList.filter((item) => item.id !== id);
    },
    //  增加公司到列表
    addCompanyToList(state, payload) {
        let {company} = payload;
        if (_.isNull(state.liveChannel.companyList)) {
            state.liveChannel.companyList = [];
        }
        let {name} = company;
        if (name === '全部') {
            state.liveChannel.companyList = _.cloneDeep(state.filialeList);
        } else {
            state.liveChannel.companyList.push(company);
        }
        state.liveChannel.companyList = _.uniqBy(state.liveChannel.companyList, 'id');
        let flag = checkCompanyListIsAll(state.liveChannel.companyList, state.filialeList);
        state.liveChannel.common = flag;
    },
    //  从列表中删除公司
    deleteCompanyFromList(state, payload) {
        let {company} = payload;
        state.liveChannel.companyList = state.liveChannel.companyList.filter((_company) => {
            return _company.id !== company.id;
        });
        let flag = checkCompanyListIsAll(state.liveChannel.companyList, state.filialeList);
        state.liveChannel.common = flag;
    }
};

function checkCompanyListIsAll(source, target) {
    let sortedSource = _.chain(_.cloneDeep(source)).sortBy('id').value();
    let sortedTarget = _.chain(_.cloneDeep(target)).sortBy('id').value();
    let flag = _.isEqual(sortedSource, sortedTarget);
    return flag;
}

const actions = {
    /**
     * 获取频道分类
     */
    async getChannelType({commit}) {
        try {
            let res = await service.getChannelType({});
            if (res && res.code === 0) {
                let liveChannelTypeList = res.data.filter((item) => item.category === 'LIVE');
                let carouselChannelTypeList = res.data.filter((item) => item.category !== 'LIVE');
                commit('setChannelTypeList', {list: res.data});
                commit('setLiveChannelTypeList', {list: liveChannelTypeList});
                commit('setCarouselChannelTypeList', {list: carouselChannelTypeList});
            }
        } catch (err) {
        }
    },
    /**
     * 保存频道分类
     */
    async putChannelType({commit, state}, list) {
        try {
            let channelTypeList = _.cloneDeep(list);
            channelTypeList.forEach((item) => {
                if (/^category_/.test(item.id)) {
                    delete item.id;
                }
            });
            let res = await service.putChannelType(channelTypeList);
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) {
        }
    },
    /**
     *  查看某中类别下频道的计数
     */
    async getChannelCount({commit}, id) {
        try {
            let res = await service.getChannelCount(id);
            if (res && res.code === 0) {
                return res.data === 0;
            }
        } catch (err) {
        }
    },
    /**
     * 批量新增直播频道
     */
    async createChannels() {
        try {
            if (!isLoading) {
                isLoading = true;
                let liveChannel = _.cloneDeep(state.liveChannel);
                delete liveChannel.releaseStatus;
                delete liveChannel.status;
                delete liveChannel.id;
                delete liveChannel.visible;
                if (liveChannel.common) {
                    delete liveChannel.companyList;
                }
                let res = await service.createChannels(liveChannel);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    /**
     *  根据频道的id获取频道信息
     */
    async getLiveChannelById({commit, state}, id) {
        try {
            let res = await service.getChannelDetail(id);
            if (res && res.code === 0) {
                if (_.isNull(res.data.companyList)) {
                    res.data.companyList = [];
                }
                if (_.isNull(res.data.protocolList)) {
                    res.data.protocolList = [];
                }
                commit('setLiveChannel', {liveChannel: Object.assign({},
                    state.liveChannel, {
                        record: null,
                        protocolList: [],
                        companyList: [],
                        applicableClientList: ['TV'],
                        cdnPush: false,
                        pullAddress: '',
                        pushAddress: ''
                    }, res.data)});
                return res;
            }
        } catch (err) {
        }
    },
    /**
     * 根据id修改直播频道
     */
    async updateChannelById({commit, state}, id) {
        try {
            if (!isLoading) {
                isLoading = true;
                let liveChannel = _.cloneDeep(state.liveChannel);
                if (liveChannel.common) {
                    delete liveChannel.companyList;
                }
                let res = await service.updateChannelById(id, liveChannel);
                isLoading = false;
                return res;
            }
        } catch (err) {
            console.log(err);
            isLoading = false;
        }
    },
    /**
     * 根据id删除直播频道
     */
    async deleteChannelById({commit, state}, id) {
        try {
            let res = await service.deleteChannelById(id);
            return res;
        } catch (err) {}
    },
    /**
     * 获取频道的列表
     */
    async getChannelList({commit, state}) {
        try {
            let searchFields = Object.assign({}, state.searchFields, {
                typeIdList: [state.searchFields.typeIdList]
            });
            let params = Object.assign({}, searchFields, state.pagination, {pageNum: state.pagination.pageNum - 1});
            let res = await service.getChannelList(params);
            if (res && res.code === 0) {
                let {pageSize, pageNum, total, list} = res.data;
                commit('setList', {list});
                commit('setPagination', {pageNum: pageNum + 1, pageSize, total});
            }
        } catch (err) {
        }
    },
    /**
     * 获取节目单
     */
    async getChannelPageById({commit, state}, id) {
        try {
            let res = await service.getChannelPageById(id);
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
