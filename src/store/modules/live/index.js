// import service from '../../../service';

// 序号 直播频道编号 直播频道展示编号 直播频道名称 直播频道展示名 频道类别 频道IP 频道端口
let list = [
    {
        id: 1,
        showId: '001',
        name: 'CCTV1',
        showName: 'CCTV1综合',
        type: '央视/高清',
        ip: '123.31413.3213.4214',
        port: '8080'
    }
];

const state = {
    searchStr: '',
    list,
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const getters = {
    list(state) {
        return Array.from(state.list).sort((prev, curr) => curr.updatedAt - prev.updatedAt);
    },
    pagination(state) {
        return {
            pageSize: state.pageSize,
            total: state.total,
            pageNum: state.pageNum
        };
    }
};

const mutations = {
    setLiveList(state, payload) {
        state.list = payload.list;
    },
    setPagination(state, payload) {
        if (payload.pageSize) {
            state.pageSize = payload.pageSize;
        }
        if (payload.pageNum) {
            state.pageNum = payload.pageNum;
        }
        if (payload.total) {
            state.total = payload.total;
        }
    }
};

const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
