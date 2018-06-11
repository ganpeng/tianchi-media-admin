const state = {
    selectedVideoId: '',
    list: [
        {
            id: 1,
            name: '视频1',
            playUrl: 'http://cdn.can.cibntv.net/12/201702161000/rexuechangan01/rexuechangan01.m3u8',
            takeTimeInSec: '6000000',
            createdAt: new Date()
        },
        {
            id: 2,
            name: '视频2',
            playUrl: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
            takeTimeInSec: '8000000',
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
    },

    setSelectedVideoId(state, payload) {
        state.selectedVideoId = payload.id;
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
