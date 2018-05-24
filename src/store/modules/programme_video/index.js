import service from '../../../service';
import axios from 'axios';

const defaultProgrammeVideo = {
    // 全平台通用id，从媒资系统过来
    commonId: '',
    // 节目id
    programmeId: '',
    // 名称
    name: '',
    // 播放链接
    playUrl: '',
    // 详情
    description: '',
    // 时长,单位杪
    takeTimeInSec: '',
    // 用于排序，返回数据时倒叙排列
    sort: '',
    // 子集父id,自引用，比如电视剧下集预告，或者综艺的片花等需要绑定某一指定集
    parentId: '',
    // 是否显示，下架visible=false
    visible: true,
    // 视频类型 ENUM('FEATURE', 'PRE_SHOW', 'EXTRAS', 'HIGH_LIGHT') DEFAULT 'FEATURE'
    type: '',
    // 清晰度 ENUM('HD_4K', 'HD_2K', 'HD_1080', 'HD_720', 'HD_480') DEFAULT 'HD_4K'
    quality: '',
    // 是否免费，子集不定价，定价在节目主表中
    free: '',
    // 可播放时间
    displayStartAt: '',
    // 截止播放时间
    displayDeadlineAt: '',
    // 状态 ENUM('NORMAL', 'DELETE') DEFAULT 'NORMAL'
    poStatus: '',
    // 创建时间
    createdAt: '',
    // 修改时间
    updatedAt: ''
};

const state = {
    programmeId: '',
    parentId: '',
    videoType: '',
    currentProgrammeVideo: {},
    // 当前节目下上传的视频的列表
    videoList: []
};

const getters = {
    currentProgrammeVideo(state) {
        return state.currentProgrammeVideo;
    }
};

const mutations = {
    setCurrentProgrammeVideo(state, payload) {
        state.currentProgrammeVideo = payload.currentProgrammeVideo;
    },
    updateCurrentProgrammeVideo(state, payload) {
        state.currentProgrammeVideo = Object.assign({}, state.currentProgrammeVideo, payload);
    },
    resetProgrammeVideo(state) {
        state.currentProgrammeVideo = defaultProgrammeVideo;
    },
    addVideoToList(state) {
        state.videoList.push(state.currentProgrammeVideo);
    },
    deleteVideoFromList(state, payload) {
        state.videoList = state.videoList.filter((video) => {
            return video.id !== payload.id;
        });
    }
};

/**
 * 对等待上传的节目视频列表做处理
 */
function filterProgrammeVideoData(videoList, programmeId) {
    return videoList.map((video) => {
        return Object.assign({}, video, {
            playUrl: 'http://www.w3school.com.cn/i/movie.ogg',
            programmeId,
            parentId: undefined
        });
    });
}

const actions = {
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
    },
    createMultProgrammeVideo({commit, state}) {
        let {videoList} = state;
        let copiedVideoList = filterProgrammeVideoData(videoList, state.programmeId).map((video) => {
            return service.createProgrammeVideo(video);
        });
        return service.createMultProgrammeVideo(copiedVideoList)
            .then(axios.spread((...res) => {
                return res;
            }));
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
