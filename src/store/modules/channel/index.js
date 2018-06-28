import _ from 'lodash';
import service from '../../../service';

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
    name: '', // 直播频道展示名
    no: '' // 直播频道展示编号
};

const defaultState = {
    searchFields: _.cloneDeep(defaultSearchFields),
    list: [],
    pagination: _.cloneDeep(defaultPagination),
    liveChannel: _.cloneDeep(defaultLiveChannel),
    channelTypeList: [
        {
            id: 4,
            category: 'LIVE',
            name: '直播',
            status: 'NORMAL',
            visible: false
        },
        {
            id: 5,
            category: 'CAROUSEL',
            name: '轮播',
            status: 'NORMAL',
            visible: false
        }
    ]
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
    addChannelCategory(state, payload) {
    }
};

const actions = {
    /**
     * 获取频道分类
     */
    async getChannelType() {
        try {
            let res = await service.getChannelType();
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 保存频道分类
     */
    async putChannelType(channelType) {
        try {
            let res = await service.putChannelType(channelType);
            console.log(res);
        } catch (err) {
            console(err);
        }
    },
    /**
     *  查看某中类别下频道的计数
     */
    async getChannelCount(id) {
        try {
            let res = await service.getChannelCount(id);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 批量新增直播频道
     */
    async createChannels(channelList) {
        try {
            let res = await service.createChannels(channelList);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 根据id修改直播频道
     */
    async updateChannelById(channel) {
        try {
            let res = await service.updateChannelById(channel);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 根据id删除直播频道
     */
    async deleteChannelById(id) {
        try {
            let res = await service.deleteChannelById(id);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 获取频道的列表
     */
    async getChannelList({pageNum, pageSize, releaseStatus}) {
        try {
            let res = await service.getChannelList({pageNum, pageSize, releaseStatus});
            console.log(res);
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
