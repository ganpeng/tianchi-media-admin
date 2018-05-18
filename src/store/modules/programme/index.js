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
<<<<<<< HEAD
=======
    // 节目类型
    programType: '',
>>>>>>> dev_v1.0
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
<<<<<<< HEAD
    typeList: [],
    // 下面是自定义的前端数据结构，不是服务端返回的
    // 后续会去掉的节目类型
    programmeType: '',
=======
    typeVoList: [],
    // 下面是自定义的前端数据结构，不是服务端返回的
>>>>>>> dev_v1.0
    // 主演
    leadActor: [],
    // 导演
    director: [],
    // 版权起止日期
<<<<<<< HEAD
    copyrightRange: ''
=======
    copyrightRange: []
>>>>>>> dev_v1.0
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
<<<<<<< HEAD
    updateCurrentProgramme(state, payload) {
=======
    updateCurrentPerson(state, payload) {
>>>>>>> dev_v1.0
        state.currentProgramme = Object.assign({}, state.currentProgramme, payload);
    },
    resetProgramme(state) {
        state.currentProgramme = defaultProgramme;
    }
};

<<<<<<< HEAD
function formatProgrammeData(programmeData) {
    return Object.assign({}, programmeData, {
        // 版权开始日期
        copyrightStartedAt: programmeData.copyrightRange[0],
        // 版权结束日期
        copyrightEndedAt: programmeData.copyrightRange[1],

        tagList: [],
        typeList: []
    });
}

=======
>>>>>>> dev_v1.0
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
<<<<<<< HEAD
        let currentProgramme = formatProgrammeData(state.currentProgramme);
        service.createProgramme(currentProgramme)
=======
        service.createProgramme(state.currentProgramme)
>>>>>>> dev_v1.0
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
