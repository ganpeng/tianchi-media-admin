import service from '../../../service';
import router from '../../../router';
import _ from 'lodash';

const programmePostFields = ['copyrightStartedAt', 'copyrightEndedAt', 'name', 'playCountBasic', 'price', 'quality', 'releaseArea', 'category', 'businessOperator', 'featureVideoCount', 'description', 'announceAt', 'posterImages', 'figureList', 'tagList', 'typeList'];

const defaultProgramme = {
    // 全平台通用id，从媒资系统过来
    commonId: '',
    // 名称拼音首字母
    namePy: '',
    // 名称拼音
    namePinYin: '',
    // 评分
    score: '',
    // 节目来源 ENUM('MEDIA_SYS','CONTENT_CENTER') DEFAULT 'CONTENT_CENTER'
    origin: '',
    // 版权商
    copyrightReserver: '',
    // 版权开始日期
    copyrightStartedAt: '',
    // 版权结束日期
    copyrightEndedAt: '',
    // 节目名称
    name: '',
    // 播放基数(显示播放量)
    playCountBasic: 0,
    // 价格
    price: 0,
    // 正片清晰度 ENUM('HD_4K', 'HD_2K', 'HD_1080', 'HD_720', 'HD_480') DEFAULT 'HD_4K'
    quality: 'HD_480',
    // 发布时间
    releaseAt: '',
    // 发布地区
    releaseArea: '',
    // 节目发布状态 ENUM('RELEASED', 'DRAFT', 'PRE_RELEASED') DEFAULT 'DRAFT'
    // releaseStatus: 'RELEASED',
    // 节目类别
    category: {},
    // 发行商
    businessOperator: '',
    // 正片数量,总集数（电视剧是预知的，综艺节目是变化的）
    featureVideoCount: '',
    // 节目描述
    description: '',
    // 发行时间
    announceAt: '',
    // 状态 ENUM('NORMAL', 'DELETE') DEFAULT 'NORMAL'
    status: '',
    // 节目海报，json字符串存储，包含以下几个字段，fileId，uri，width，high")
    posterImages: [],
    // 相关人物
    figureList: [],
    // 关键字
    tagList: [],
    // 节目类型，关联节目类型id的引用
    typeList: [],
    // 节目视频列表，video的id引用
    // videoIdList: [],

    // 下面是自定义的前端数据结构，不是服务端返回的

    // 主演
    leadActor: [],
    // 主演搜索结果
    leadActorResult: [],
    // 导演
    director: [],
    // 导演搜索结果
    directorResult: [],
    // 版权起止日期
    copyrightRange: '',
    // 当前选中的节目分类下的类型
    currentTypeList: []
};

const state = {
    figure: '',
    releaseStatus: '',
    releaseAt: '',
    releaseArea: '',
    category: {},
    programmeType: '',
    currentProgramme: {},
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0,
    categoryList: []
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
    },
    categroyList(state) {
        return state.categoryList;
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
    updateCurrentProgramme(state, payload) {
        state.currentProgramme = Object.assign({}, state.currentProgramme, payload);
    },
    resetProgramme(state) {
        state.currentProgramme = defaultProgramme;
        state.currentProgramme.posterImages = [];
    },
    addPosterImage(state, payload) {
        state.currentProgramme.posterImages.push(payload.posterImage);
    },
    setCategroyList(state, payload) {
        state.categoryList = payload.list ? payload.list : [];
    },
    deleteProgrammeCategory(state, payload) {
        let {node, data} = payload;
        let parentId = node.parent.data.id;
        let childrenId = data.id;
        state.categoryList = state.categoryList.map((category) => {
            if (category.id === parentId) {
                category.programmeTypeList = category.programmeTypeList.filter((item) => item.id !== childrenId);
                return category;
            } else {
                return category;
            }
        });
    },
    addProgrammeCategory(state, payload) {
        let {name, data: {id}} = payload;
        state.categoryList = state.categoryList.map((category) => {
            if (category.id === id) {
                let obj = {
                    id: _.uniqueId('category_'),
                    name,
                    visible: true
                };
                category.programmeTypeList = category.programmeTypeList || [];
                category.programmeTypeList.push(obj);
                return category;
            } else {
                return category;
            }
        });
    }
};

/**
 * 对节目数据做处理
 */
function formatProgrammeData(programmeData) {
    return Object.assign({}, programmeData, {
        // 版权开始日期
        copyrightStartedAt: programmeData.copyrightRange[0],
        // 版权结束日期
        copyrightEndedAt: programmeData.copyrightRange[1],
        // 人物
        figureList: [].concat(programmeData.leadActor.map((item) => {
            let obj = {};
            obj.role = 'DIRECTOR';
            obj.id = item.id;
            obj.name = item.name;
            return obj;
        })).concat(programmeData.director.map((item) => {
            let obj = {};
            obj.role = 'CHIEF_ACTOR';
            obj.id = item.id;
            obj.name = item.name;
            return obj;
        }))
    });
}

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
        let currentProgramme = _.pick(formatProgrammeData(state.currentProgramme), programmePostFields);
        return service.createProgramme(currentProgramme)
            .then((res) => {
                if (res && res.code === 0) {
                    return res;
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
    },
    getProgrammeCategory({commit, state}) {
        service.getProgrammeCategory()
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setCategroyList', {list: res.data});
                }
            });
    },
    updateProgrammeCategory({commit, state}) {
        let categoryList = JSON.parse(JSON.stringify(state.categoryList));
        categoryList.forEach((item) => {
            item.programmeTypeList.forEach((innerItem) => {
                if (/^category_/.test(innerItem.id)) {
                    delete innerItem.id;
                }
            });
        });
        service.updateProgrammeCategory({categoryList})
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setCategroyList', {list: res.data});
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
