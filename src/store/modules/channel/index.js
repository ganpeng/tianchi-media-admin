import _ from 'lodash';
import service from '../../../service';
import {getPageSize} from '@/util/formValidate';

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
    record: undefined,
    category: 'LIVE'
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
    releaseStatus: '', // 直播频道的发布状态
    status: '', // 直播频道状态`
    record: '', // 是否支持直播回看
    audioPid: '',
    videoPid: '',
    //  直播频道的类型列表
    typeList: [],
    visible: false // 是否上下架
};

const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
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
        let channelCategory = { name, category, id: _.uniqueId('category_') };
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
    }
};

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
        } catch (err) { }
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
        } catch (err) { }
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
        } catch (err) {}
    },
    /**
     * 批量新增直播频道
     */
    async createChannels() {
        try {
            let liveChannel = _.cloneDeep(state.liveChannel);
            delete liveChannel.releaseStatus;
            delete liveChannel.status;
            delete liveChannel.id;
            delete liveChannel.visible;
            let res = await service.createChannels(liveChannel);
            return res;
        } catch (err) { }
    },
    /**
     *  根据频道的id获取频道信息
     */
    async getLiveChannelById({commit, state}, id) {
        try {
            let res = await service.getChannelDetail(id);
            if (res && res.code === 0) {
                commit('setLiveChannel', {liveChannel: Object.assign({record: null}, res.data)});
                return res;
            }
        } catch (err) {}
    },
    /**
     * 根据id修改直播频道
     */
    async updateChannelById({commit, state}, id) {
        try {
            let liveChannel = _.cloneDeep(state.liveChannel);
            let res = await service.updateChannelById(id, liveChannel);
            return res;
        } catch (err) { }
    },
    /**
     * 根据id删除直播频道
     */
    async deleteChannelById({commit, state}, id) {
        try {
            let res = await service.deleteChannelById(id);
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) { }
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
        } catch (err) { }
    },
    /**
     * 获取节目单
     */
    async getChannelPageById({commit, state}, id) {
        try {
            let res = await service.getChannelPageById(id);
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
