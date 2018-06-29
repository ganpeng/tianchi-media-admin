import _ from 'lodash';
import service from '../../../service';

const postFields = [
    'name',
    'no',
    'category',
    'innerName',
    'logoUri',
    'multicastIp',
    'multicastPort',
    'typeList'
];

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
    channelTypeId: ''
};

let defaultPagination = {
    pageNum: 1,
    pageSize: 5,
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
    releaseStatus: '', // 直播频道的发布状态
    status: '', // 直播频道状态`
    //  直播频道的类型列表
    typeList: [],
    visible: false // 是否上下架
};

const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
    list: [],
    pagination: _.cloneDeep(defaultPagination),
    liveChannel: _.cloneDeep(defaultLiveChannel),
    channelTypeList: []
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
    liveChannel(state) {
        return state.liveChannel;
    },
    liveChannelTypeList(state) {
        return state.channelTypeList.filter((type) => type.category === 'LIVE');
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
        if (key === 'typeList') {
            state.liveChannel[key] = state.channelTypeList.filter((type) => {
                let index = value.findIndex((id) => { return id === type.id; });
                return index > -1;
            });
        } else {
            state.liveChannel[key] = value;
        }
    },
    resetLiveChannel(state) {
        state.liveChannel = _.cloneDeep(defaultLiveChannel);
    },
    setChannelTypeList(state, payload) {
        state.channelTypeList = payload.list;
    },
    addChannelCategory(state, payload) {
        let {name, data: {category}} = payload;
        let channelCategory = { name, category, id: _.uniqueId('category_') };
        state.channelTypeList.push(channelCategory);
    },
    deleteChannelCategory(state, payload) {
        let {data: {id}} = payload;
        state.channelTypeList = state.channelTypeList.filter((type) => type.id !== id);
    }
};

const actions = {
    /**
     * 获取频道分类
     */
    async getChannelType({commit}) {
        try {
            let res = await service.getChannelType();
            if (res && res.code === 0) {
                commit('setChannelTypeList', {list: res.data});
            }
        } catch (err) { }
    },
    /**
     * 保存频道分类
     */
    async putChannelType() {
        try {
            let channelTypeList = _.cloneDeep(state.channelTypeList);
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
            let liveChannel = _.pick(state.liveChannel, postFields);
            let res = await service.createChannels(liveChannel);
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) { }
    },
    /**
     * 根据id修改直播频道
     */
    async updateChannelById() {
        try {
            let {id} = state.liveChannel;
            let liveChannel = _.pick(state.liveChannel, postFields);
            let res = await service.updateChannelById(id, liveChannel);
            if (res && res.code === 0) {
                return res;
            }
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
            let params = Object.assign({}, state.pagination, {pageNum: state.pagination.pageNum - 1});
            let res = await service.getChannelList(params);
            if (res && res.code === 0) {
                let {pageSize, pageNum, total, list} = res.data;
                commit('setList', {list});
                commit('setPagination', {pageNum: pageNum + 1, pageSize, total});
            }
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
