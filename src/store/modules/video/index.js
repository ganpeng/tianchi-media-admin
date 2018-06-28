import _ from 'lodash';
import service from '../../../service';
import role from '@/util/config/role';

/*
    1920 三种， 720 两种
*/

const defaultSearchFields = {
    name: '',
    status: ''
};

const defaultPagination = {
    pageSize: 5,
    pageNum: 1,
    total: 8
};

const state = {
    selectedVideoId: '',
    searchFields: _.cloneDeep(defaultSearchFields),
    pagination: _.cloneDeep(defaultPagination),
    list: []
};

const getters = {
    video(state) {
        return state;
    },
    pagination(state) {
        return state.pagination;
    },
    searchFields(state) {
        return state.searchFields;
    },
    getStatus(state) {
        // return (status) => {
        //     return role.VIDEO_UPLOAD_STATUS[status];
        // };

        return (id) => {
            let video = state.list.find((video) => video.id === id);
            let status = video.status;
            if (status !== 'SUCCESS') {
                return role.VIDEO_UPLOAD_STATUS[status];
            } else {
                let m3u8For480PStatus = !!video.m3u8For480P;
                let m3u8For720PStatus = !!video.m3u8For720P;
                let m3u8For1080PStatus = !!video.m3u8For1080P;
                return m3u8For480PStatus && m3u8For720PStatus && m3u8For1080PStatus ? '成功' : '注入中';
            }
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
    setList(state, payload) {
        state.list = payload.list;
    },
    setPagination(state, payload) {
        state.pagination.pageSize = payload.pageSize;
        state.pagination.pageNum = payload.pageNum;
        state.pagination.total = payload.total;
    },
    resetPagination(state) {
        state.pagination = _.cloneDeep(defaultPagination);
    },
    updatePagination(state, payload) {
        let {key, value} = payload;
        state.pagination[key] = value;
    },
    setSelectedVideoId(state, payload) {
        state.selectedVideoId = payload.id;
    },
    updateSearchFields(state, payload) {
        let {key, value} = payload;
        state.searchFields[key] = value;
    },
    resetSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultSearchFields);
    }
};

const actions = {
    async getVideoList({commit, state}) {
        try {
            let {pageNum, pageSize} = state.pagination;
            let params = Object.assign({}, {pageNum: pageNum > 0 ? pageNum - 1 : 0, pageSize}, {...state.searchFields});
            let result = await service.getVideoList(params);
            if (result && result.code === 0) {
                let {list, pageSize, pageNum, total} = result.data;
                commit('setList', {list});
                commit('setPagination', {pageNum: pageNum + 1, pageSize, total});
            }
        } catch (err) {

        }
    },

    async deleteVideoById({commit, state}, id) {
        try {
            let result = await service.deleteVideoById(id);
            return result;
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
