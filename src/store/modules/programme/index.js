import service from '../../../service';
import axios from 'axios';
import _ from 'lodash';

import {checkImageExist} from '@/util/formValidate';

const programmePostFields = ['copyrightStartedAt', 'copyrightEndedAt', 'copyrightReserver', 'name', 'playCountBasic', 'desc', 'score', 'price', 'quality', 'releaseArea', 'category', 'businessOperator', 'featureVideoCount', 'description', 'releaseAt', 'posterImageList', 'figureList', 'tagList', 'typeList', 'releaseStatus'];

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
    playCountBasic: '',
    // 价格
    price: '',
    // 正片清晰度 ENUM('HD_4K', 'HD_2K', 'HD_1080', 'HD_720', 'HD_480') DEFAULT 'HD_4K'
    quality: 'HD_480',
    // 发布时间
    releaseAt: '',
    // 发布地区
    releaseArea: '',
    // 节目发布状态 ENUM('RELEASED', 'DRAFT', 'PRE_RELEASED') DEFAULT 'DRAFT'
    releaseStatus: '',
    // 节目类别
    category: {},
    // 发行商
    businessOperator: '',
    // 正片数量,总集数（电视剧是预知的，综艺节目是变化的）
    featureVideoCount: '',
    // 节目看点
    desc: '',
    // 节目描述
    description: '',
    // 发行时间
    announceAt: '',
    // 状态 ENUM('NORMAL', 'DELETE') DEFAULT 'NORMAL'
    status: '',
    // 节目海报，json字符串存储，包含以下几个字段，fileId，uri，width，high")
    posterImageList: [],
    // 相关人物
    figureList: [],
    // 关键字
    tagList: [],
    // 节目类型，关联节目类型id的引用
    typeList: [],
    // 节目视频列表，video的id引用
    videoIdList: [],

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
    copyrightRange: [],
    // 当前选中的节目分类下的类型
    currentTypeList: []
};

const defaultCurrentProgrammeVideoObj = {
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const defaultState = {
    keyword: '',
    releaseStatus: '',
    releaseAt: '',
    releaseArea: '',
    programmeCategory: {},
    currentTypeList: [],
    programmeType: [],
    currentProgramme: Object.assign({}, defaultProgramme),
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0,
    categoryList: [],
    programmeTagList: [],
    currentProgrammeVideoObj: Object.assign({}, defaultCurrentProgrammeVideoObj)
};

const state = JSON.parse(JSON.stringify(defaultState));
const searchFields = ['keyword', 'releaseStatus', 'releaseArea', 'releaseAt', 'programmeCategory', 'programmeType', 'pageNum', 'pageSize'];

/**
 *  通过id获取节目
 */
function getProgrammeById(id) {
    return state.list.find((item) => {
        return item.id === id;
    });
}

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
    isTvPlay(state) {
        return state.currentProgramme.category.name === '电视剧';
    },
    isShow(state) {
        return state.currentProgramme.category.name === '综艺';
    },
    categoryName(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            return programme ? (programme.category ? programme.category.name : '') : '';
        };
    },
    serializeCategory(state) {
        return state.currentProgramme.category.id;
    },
    searchCategory(state) {
        return state.programmeCategory.id;
    },
    serializeTypeList(state) {
        return state.currentProgramme.typeList.map((item) => item.id);
    },
    searchType(state) {
        return state.programmeType;
    },
    searchCurrentTypeList(state) {
        return state.currentTypeList;
    },
    releaseArea(state) {
        return state.releaseArea;
    },
    releaseAt(state) {
        return state.releaseAt;
    },
    keyword(state) {
        return state.keyword;
    },
    programmeTagList(state) {
        return state.programmeTagList.map((item) => {
            return {
                value: item,
                label: item
            };
        });
    },
    typeList(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            return programme.typeList.map((item) => item.name).join(', ');
        };
    },
    leadActorValue(state) {
        return state.currentProgramme.leadActor.map((item) => item.id);
    },
    directorValue() {
        return state.currentProgramme.director.map((item) => item.id);
    },
    getDirector(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let director = programme.figureList.filter((figure) => figure.role === 'DIRECTOR');
            return director.map((item) => item.name).join(', ');
        };
    },
    getChiefActor(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let chiefActor = programme.figureList.filter((figure) => figure.role === 'CHIEF_ACTOR');
            return chiefActor.map((item) => item.name).join(', ');
        };
    },
    getPostImage(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            return programme.posterImageList[0] ? programme.posterImageList[0] : '';
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
    },
    currentVideoIdList(state) {
        return state.currentProgramme.videoIdList || [];
    },
    programmeVideoList(state) {
        return state.currentProgrammeVideoObj.list;
    },
    programmeVideoPagination(state) {
        return _.pick(state.currentProgrammeVideoObj, ['pageNum', 'pageSize', 'total']);
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
    setVideoPagination(state, payload) {
        if (payload.pageSize) {
            state.currentProgrammeVideoObj.pageSize = payload.pageSize;
        }
        if (payload.pageNum) {
            state.currentProgrammeVideoObj.pageNum = payload.pageNum;
        }
        if (payload.total) {
            state.currentProgrammeVideoObj.total = payload.total;
        }
    },
    setProgrammeTagList(state, payload) {
        state.programmeTagList = payload.list;
    },
    setCurrentProgramme(state, payload) {
        state.currentProgramme = payload.currentProgramme;
    },
    updateCurrentProgramme(state, payload) {
        state.currentProgramme = Object.assign({}, state.currentProgramme, payload);
    },
    addProgrammeTag(state, payload) {
        state.programmeTagList.push(payload.tag);
    },
    setSearchField(state, payload) {
        if (payload.releaseArea !== undefined) {
            state.releaseArea = payload.releaseArea;
        }
        if (payload.releaseAt !== undefined) {
            state.releaseAt = payload.releaseAt;
        }
        if (payload.keyword !== undefined) {
            state.keyword = payload.keyword;
        }
    },
    resetCurrentProgramme(state) {
        state.currentProgramme = Object.assign({}, defaultProgramme);
    },
    resetProgramme(state) {
        state = Object.assign({}, defaultState);
    },
    resetCurrentProgrammeVideoObj(state) {
        state.currentProgrammeVideoObj = Object.assign({}, defaultCurrentProgrammeVideoObj);
    },
    updateProgrammeVideoVisible(state, payload) {
        state.currentProgrammeVideoObj.list = state.currentProgrammeVideoObj.list.map((item) => {
            if (item.id === payload.id) {
                item.visible = !item.visible;
                return item;
            } else {
                return item;
            }
        });
    },
    updateProgrammeVisible(state) {
        state.currentProgramme.visible = !state.currentProgramme.visible;
    },
    updateCategoryValue(state, payload) {
        let category = state.categoryList.find((item) => {
            return item.id === payload.id;
        });
        state.currentProgramme.category = category;
        state.currentProgramme.currentTypeList = category.programmeTypeList;
    },
    updateSearchCategoryValue(state, payload) {
        if (payload.id) {
            let category = state.categoryList.find((item) => {
                return item.id === payload.id;
            });
            state.programmeCategory = category;
            state.currentTypeList = category.programmeTypeList;
        }
    },
    updateTypeList(state, payload) {
        state.currentProgramme.typeList = payload.type.map((id) => {
            return state.currentProgramme.currentTypeList.find((item) => {
                return item.id === id;
            });
        });
    },
    updateSearchType(state, payload) {
        // state.programmeType = state.currentTypeList.find((item) => item.id === payload.id);
        state.programmeType = payload.list;
    },
    resetSearchCategory(state) {
        state.programmeCategory = {};
        state.currentTypeList = [];
        state.programmeType = [];
    },
    resetSearchType(state) {
        state.programmeType = [];
    },
    resetSearchField(state) {
        state.keyword = '';
        state.releaseStatus = '';
        state.releaseAt = '';
        state.releaseArea = '';
        state.programmeCategory = {};
        state.programmeType = [];
   },
    updateLeadActor(state, payload) {
        state.currentProgramme.leadActor = payload.leadActorIdList.map((id) => {
            return state.currentProgramme.leadActorResult.find((item) => {
                return item.id === id;
            });
        });
    },
    updateDirector(state, payload) {
        state.currentProgramme.director = payload.directorIdList.map((id) => {
            return state.currentProgramme.directorResult.find((item) => {
                return item.id === id;
            });
        });
    },
    updateLeadActorResult(state, payload) {
        let {leadActorResult} = state.currentProgramme;
        state.currentProgramme.leadActorResult = _.uniqBy(leadActorResult.concat(payload.leadActorResult), 'id');
    },
    updateDirectorResult(state, payload) {
        let {directorResult} = state.currentProgramme;
        state.currentProgramme.directorResult = _.uniqBy(directorResult.concat(payload.directorResult), 'id');
    },
    addPosterImage(state, payload) {
        if (!checkImageExist(state.currentProgramme.posterImageList, payload.posterImage)) {
            state.currentProgramme.posterImageList.push(payload.posterImage);
        }
    },
    deletePosterImage(state, payload) {
        state.currentProgramme.posterImageList = state.currentProgramme.posterImageList.filter((img) => img.id !== payload.id);
    },
    checkPosterImage(state, payload) {
        state.currentProgramme.posterImageList = state.currentProgramme.posterImageList.map((img) => {
            if (img.id === payload.id) {
                img.checked = true;
            } else {
                delete img.checked;
            }

            return img;
        });
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
    },
    setProgrammeVideoObj(state, payload) {
        state.currentProgrammeVideoObj = Object.assign({}, payload);
    },
    setCurrentTypeList(state) {
        let {id} = state.currentProgramme.category;
        let currentTypeList = state.categoryList.find((item) => item.id === id);
        state.currentProgramme.currentTypeList = currentTypeList.programmeTypeList;
    },
    updateCurrentProgrammeVideoItem(state, payload) {
        let {video} = payload;
        let id = video.id;
        let list = state.currentProgrammeVideoObj.list;
        state.currentProgrammeVideoObj.list = list.map((videoItem) => {
            if (videoItem.id === id) {
                return video;
            } else {
                return videoItem;
            }
        });
    }
};

/**
 * 对节目数据做处理
 */
function formatProgrammeData(programmeData) {
    let result = Object.assign({}, programmeData, {
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

    delete result.category.programmeTypeList;
    return result;
}

/**
 *  序列化服务端返回的数据
 */
function serializeProgrammData(programmeData) {
    let director = programmeData.figureList.filter((item) => item.role === 'DIRECTOR');
    let leadActor = programmeData.figureList.filter((item) => item.role === 'CHIEF_ACTOR');
    let directorResult = [];
    let leadActorResult = [];

    if (director.length > 0) {
        directorResult = director;
    }
    if (leadActor.length > 0) {
        leadActorResult = leadActor;
    }

    return Object.assign({}, defaultProgramme, programmeData, {
        copyrightRange: [programmeData.copyrightStartedAt, programmeData.copyrightEndedAt],
        director,
        leadActor,
        directorResult,
        leadActorResult
    });
}

const actions = {
    getProgrammeList({commit, state}) {
        let searchObj = _.pick(state, searchFields);
        searchObj.programmeCategoryId = searchObj.programmeCategory.id;
        searchObj.programmeTypeIdList = searchObj.programmeType;
        service.getProgrammeList(Object.assign({}, searchObj, {pageNum: state.pageNum - 1}))
            .then((res) => {
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeList', {list});
                    commit('setPagination', {pageSize, pageNum: pageNum + 1, total});
                }
            });
    },

    getProgramme({commit, state}, id) {
        service.getProgrammeInfo({id})
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setCurrentProgramme', {currentProgramme: res.data});
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
    updateProgramme({commit, state}, id) {
        let currentProgramme = _.pick(formatProgrammeData(state.currentProgramme), programmePostFields);
        return service.updateProgrammeInfo({id, programme: currentProgramme})
            .then((res) => {
                if (res && res.code === 0) {
                    return res;
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
    },
    getProgrammeTypeCount({commit, state}, programmeTypeId) {
        if (/^category_/.test(programmeTypeId)) {
            return Promise.resolve(true);
        } else {
            return service.getProgrammeTypeCount({programmeTypeId})
                .then((res) => {
                    if (res && res.code === 0) {
                        if (res.data === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
        }
    },
    getProgrammeVideoListById({commit, state}, id) {
        let {pageSize, pageNum} = state.currentProgrammeVideoObj;
        return service.getProgrammeVideoListById({pageSize, pageNum: pageNum - 1, programmeId: id})
            .then((res) => {
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeVideoObj', {list, pageSize, pageNum: pageNum + 1, total});
                }
            });
    },
    getProgrammeAndGetProgrammeCategory({commit, state}, id) {
        return axios.all([service.getProgrammeInfo({id}), service.getProgrammeCategory()])
            .then(axios.spread((...res) => {
                if (res[0] && res[0].code === 0) {
                    commit('setCurrentProgramme', {currentProgramme: serializeProgrammData(res[0].data)});
                }
                if (res[1] && res[1].code === 0) {
                    commit('setCategroyList', {list: res[1].data});
                }
                commit('setCurrentTypeList');
                return res;
            }));
    },
    deleteProgrammeVideo({commit, state}, id) {
        return service.deleteProgrammeVideo({id})
            .then((res) => {
                if (res && res.code === 0) {
                    commit('updateProgrammeVideoVisible', {id});
                }
            });
    },
    deleteProgramme({commit, state}, id) {
        return service.deleteProgramme({id})
            .then((res) => {
                commit('updateProgrammeVisible');
            });
    },
    getProgrammeTagList({commit, state}) {
        return service.getProgrammeTagList()
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setProgrammeTagList', {list: res.data});
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
