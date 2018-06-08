const state = {
    list: [
        {
            id: 1,
            name: '视频1',
            link: 'http://vjs.zencdn.net/v/oceans.mp4',
            duration: '1:20:30',
            createdAt: new Date()
        },
        {
            id: 2,
            name: '视频2',
            link: 'http://vjs.zencdn.net/v/oceans.mp4',
            duration: '2:30:10',
            createdAt: new Date()
        }
    ],
    pageSize: 5,
    pageNum: 1,
    total: 8
};

const getters = {
    videoObj(state) {
        return state;
    }
};

const mutations = {
    setVideo(state, payload) {
        state.videoList = payload.list;
        state.pageSize = payload.pageSize;
        state.pageNum = payload.pageNum;
        state.total = payload.total;
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
