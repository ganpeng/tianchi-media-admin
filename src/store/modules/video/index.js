import service from '../../../service';
import role from '@/util/config/role';

// 'http://test-video.tianchiapi.com/group1/M00/00/03/CgEBIVsg7m6AFsYpAAAcnK8oMY069.m3u8',
// 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
const state = {
    selectedVideoId: '',
    list: [],
    pageSize: 5,
    pageNum: 1,
    total: 8
};

const getters = {
    video(state) {
        return state;
    },
    getStatus(state) {
        return (status) => {
            return role.VIDEO_UPLOAD_STATUS[status];
        };
    },
    qualityOptions(state) {
        let video = state.list.find((video) => video.id === state.selectedVideoId);
        let qualityOptions = [];
        if (video) {
            if (video.m3u8For1080P) {
                qualityOptions.push({
                    value: 'HD_1080',
                    label: 'HD_1080'
                });
            }
            if (video.m3u8For720P) {
                qualityOptions.push({
                    value: 'HD_720',
                    label: 'HD_720'
                });
            }
            if (video.m3u8For480P) {
                qualityOptions.push({
                    value: 'HD_480',
                    label: 'HD_480'
                });
            }

            qualityOptions.push({
                value: 'HD_480',
                label: 'HD_480'
            });
        }
        return qualityOptions;
    }
};

const mutations = {
    setVideo(state, payload) {
        state.list = payload.list;
        state.pageSize = payload.pageSize;
        state.pageNum = payload.pageNum;
        state.total = payload.total;
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
    setSelectedVideoId(state, payload) {
        state.selectedVideoId = payload.id;
    }
};

const actions = {
    async getVideoList({commit, state}) {
        try {
            let {pageNum, pageSize} = state;
            let result = await service.getVideoList({pageNum: pageNum > 0 ? pageNum - 1 : 0, pageSize});
            if (result && result.code === 0) {
                let {list, pageSize, pageNum, total} = result.data;
                commit('setVideo', {list, pageSize, pageNum: pageNum + 1, total});
            }
        } catch (err) {

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
