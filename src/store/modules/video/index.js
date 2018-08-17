import _ from 'lodash';
import service from '../../../service';
import role from '@/util/config/role';
import {getPageSize} from '@/util/formValidate';

let isLoading = false; // 解决重复调用列表接口的问题

const defaultSearchFields = {
    name: '',
    status: '',
    videoType: null
};

const defaultPagination = {
    pageNum: 1,
    pageSize: getPageSize('videoPageSize'),
    total: 0
};

const state = {
    selectedVideoId: '',
    selectedVideoList: [],
    videoType: 'VOD', //  VOD: 点播 CAROUSEL: 轮播 这是上传视频是的字段
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
    getVideoType(state) {
        return state.videoType;
    },
    getStatus(state) {
        return (video) => {
            let {status, transcodeProgress, transcodeStatus} = video;
            if (status === 'INJECTING') {
                if (transcodeStatus === 'TRANSCODING') {
                    return `<i class="status-mid">${role.VIDEO_TRANSFER_STATUS[transcodeStatus]} ${transcodeProgress}%</i>`;
                } else {
                    let text = transcodeStatus ? role.VIDEO_TRANSFER_STATUS[transcodeStatus] : role.VIDEO_UPLOAD_STATUS[status];
                    return `<i class="status-mid">${text}</i>`;
                }
            } else {
                let text = role.VIDEO_UPLOAD_STATUS[status];
                if (status === 'FAILED') {
                    return `<i class="status-abnormal">${text}</i>`;
                } else {
                    return `<i class="status-normal">${text}</i>`;
                }
            }
        };
    },
    selectedVideoIdList(state) {
        return state.selectedVideoList.map((video) => video.id);
    },
    selectedVideoList(state) {
        return state.selectedVideoList;
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
    setVideoType(state, payload) {
        state.videoType = payload.videoType;
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
    },
    setSelectedVideoList(state, payload) {
        state.selectedVideoList = payload.list;
    }
};

const actions = {
    async getVideoList({commit, state}, elTable) {
        try {
            if (!isLoading) {
                isLoading = true;
                let {pageNum, pageSize} = state.pagination;
                let params = Object.assign({}, {pageNum: pageNum > 0 ? pageNum - 1 : 0, pageSize}, {...state.searchFields});
                let result = await service.getVideoList(params);
                if (result && result.code === 0) {
                    let {list, pageSize, pageNum, total} = result.data;
                    commit('setList', {list});
                    commit('setPagination', {pageNum: pageNum + 1, pageSize, total});

                    if (elTable) {
                        state.selectedVideoList.forEach((item) => {
                            let video = state.list.find((video) => {
                                return item.code === video.code;
                            });
                            if (video) {
                                console.log(video);
                                console.log(elTable);
                                elTable.toggleRowSelection(video);
                            }
                        });
                    }
                }
                isLoading = false;
            }
        } catch (err) {
            isLoading = false;
        }
    },
    async deleteVideoById({commit, state}, id) {
        try {
            let result = await service.deleteVideoById(id);
            return result;
        } catch (err) {}
    },
    async checkVideoMd5({commit, state}, key) {
        try {
            let result = await service.getVideoList({key});
            if (result && result.code === 0) {
                return result;
                // return result.data.list && result.data.list.length === 0;
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
