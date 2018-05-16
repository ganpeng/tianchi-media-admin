import service from '../../../service';
import router from '../../../router';
import _ from 'lodash';

const defaultProgramme = {
    // 版权商
    copyrightReserver: '',
    // 版权开始日期
    copyrightStartedAt: '',
    // 版权结束日期
    copyrightEndedAt: '',
    // 节目名称
    name: '',
    // 播放量
    playCountBasic: 0,
    // 价格
    price: 0,
    // 视频质量
    quality: 'HD_480',
    // 发布时间
    releaseAt: '',
    // 发布地区
    releaseArea: '',
    // 节目发布状态
    releaseStatus: '',
    // 节目分类
    programmeCategory: '',
    // 节目类型
    programType: '',
    // 发行商
    businessOperator: '',
    // 正片数量
    featureVideoCount: '',
    // 节目描述
    description: '',
    // 发行时间
    announceAt: '',
    // 节目图片
    posterImages: [],
    // 人物列表
    figureList: [],
    // 关键字
    tagList: [],
    // 节目类型
    typeVoList: [],
    // 下面是自定义的前端数据结构，不是服务端返回的
    // 主演
    leadActor: [],
    // 导演
    director: [],
    // 版权起止日期
    copyrightRange: []
};

const state = {
    figure: '',
    releaseStatus: '',
    releaseAt: '',
    releaseArea: '',
    programmeCategory: '',
    programmeType: '',
    currentProgramme: {},
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const searchFields = ['figure', 'releaseStatus', 'releaseArea', 'releaseAt', 'programmeCategory', 'programmeType', 'pageNum', 'pageSize'];

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
    setProgrammeList(state, payload) {
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
    setCurrentProgramme(state, payload) {
        state.currentProgramme = payload.currentProgramme;
    },
    updateCurrentPerson(state, payload) {
        state.currentProgramme = Object.assign({}, state.currentProgramme, payload);
    },
    resetProgramme(state) {
        state.currentProgramme = defaultProgramme;
    }
};

const actions = {
    getProgrammeList({commit, state}) {
        service.getProgrammeList(_.pick(state, searchFields))
            .then((res) => {
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeList', {list});
                    commit('setPagination', {pageSize, pageNum, total});
                }
            });
    },

    getProgramme({commit, state}, id) {
        service.getProgrammeInfo({id})
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setCurrentProgramme', {currentPerson: res.data});
                }
            });
    },

    createProgramme({commit, state}) {
        service.createProgramme(state.currentProgramme)
            .then((res) => {
                if (res && res.code === 0) {
                    router.push({ name: 'ProgrammeList' });
                }
            });
    },
    updateProgramme({commit, state}) {
        let {currentProgramme} = state;
        service.updateProgrammeInfo({id: currentProgramme.id, person: currentProgramme})
            .then((res) => {
                if (res && res.code === 0) {
                    router.push({ name: 'ProgrammeList' });
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
