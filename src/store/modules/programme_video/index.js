import service from '../../../service';
import _ from 'lodash';

const defaultProgrammeVideo = {
    commonId: '',
    description: '',
    displayDeadlineAt: '',
    displayStartAt: '',
    free: true,
    name: '',
    parentId: '',
    playUrl: '',
    poStatus: '',
    programmeId: '',
    quality: '',
    sort: '',
    takeTimeInSec: '',
    type: '',
    updatedAt: '',
    createdAt: '',
    visible: true
};

const state = {
    programmeId: '',
    parentId: '',
    currentProgrammeVideo: {},
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const searchFields = ['programmeId', 'parentId', 'videoType', 'pageNum', 'pageSize'];

const getters = {
    list(state) {
        return state.list;
    },
    pagination(state) {
        return {
            pageSize: state.pageSize,
            total: state.total,
            pageNum: state.pageNum
        };
    },
    currentProgramme(state) {
        return state.currentProgramme;
    },
    searchFields(state) {
        return _.pick(state, searchFields);
    }
};

const mutations = {
    setProgrammeVideoList(state, payload) {
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
    },
    setCurrentProgrammeVideo(state, payload) {
        state.currentProgrammeVideo = payload.currentProgrammeVideo;
    },
    updateCurrentProgramme(state, payload) {
        state.currentProgrammeVideo = Object.assign({}, state.currentProgrammeVideo, payload);
    },
    resetProgramme(state) {
        state.currentProgrammeVideo = defaultProgrammeVideo;
    }
};

const actions = {
    getProgrammeVideoList({commit, state}) {
        service.getProgrammeVideoList(_.pick(state, searchFields))
            .then((res) => {
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeVideoList', {list});
                    commit('setPagination', {pageSize, pageNum, total});
                }
            });
    },

    getProgrammeVideo({commit, state}, id) {
        service.getProgrammeVideoInfo({id})
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setCurrentProgrammeVideo', {currentProgrammeVideo: res.data});
                }
            });
    },

    createProgrammeVideo({commit, state}) {
        return service.createProgrammeVideo(state.currentProgrammeVideo)
            .then((res) => {
                if (res && res.code === 0) {
                    return res;
                }
            });
    },
    updateProgrammeVideo({commit, state}) {
        let {currentProgrammeVideo} = state;
        return service.updateProgrammeVideoInfo({id: currentProgrammeVideo.id, video: currentProgrammeVideo})
            .then((res) => {
                if (res && res.code === 0) {
                    return res;
                }
            });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
