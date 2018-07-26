import axios from 'axios';
import _ from 'lodash';
import uuid from 'uuid';
import service from '../../../service';
import wsCache from '@/util/webStorage';
import {checkImageExist} from '@/util/formValidate';

const defaultProgramme = {
    // 全平台通用id，从媒资系统过来
    commonId: '',
    // 节目名称
    name: '',
    // 内部名字
    innerName: '',
    // 名称拼音首字母
    namePy: '',
    // 名称拼音
    namePinYin: '',
    // 评分
    score: '',
    // 节目来源 ENUM('MEDIA_SYS','CONTENT_CENTER') DEFAULT 'CONTENT_CENTER'
    origin: null,
    // 牌照方
    licence: '', // 单选
    // 发行商
    announcer: '', // 单选
    // 版权商
    copyrightReserved: '', //  单选
    // 节目总集数
    totalSets: '',
    // 版权开始日期
    copyrightStartedAt: '',
    // 版权结束日期
    copyrightEndedAt: '',
    // 播放基数(显示播放量)
    playCountBasic: '',
    // 实际播放量
    playCountReal: '',
    // 价格
    price: '',
    // 发布时间
    releaseAt: '',
    // 发布地区
    produceAreaList: [],
    // 节目发布状态 ENUM('RELEASED', 'DRAFT', 'PRE_RELEASED') DEFAULT 'DRAFT'
    releaseStatus: null,
    // 节目默认图片
    coverImage: {},
    //  默认的横版海报图
    horizontalCoverImage: {},
    // 节目类别
    categoryList: [],
    // 年级
    grade: '',
    // 规格
    specList: [],
    // 科目
    subject: '',
    // 赛事
    contest: '',
    // 播放平台
    platformList: [],
    // 正片数量,总集数（电视剧是预知的，综艺节目是变化的）
    featureVideoCount: '',
    // 节目看点
    desc: '',
    // 是否下架
    visible: null,
    // 节目描述
    description: '',
    // 发行时间
    announceAt: '',
    // 状态 ENUM('NORMAL', 'DELETE') DEFAULT 'NORMAL'
    status: null,
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
    // 编剧
    scenarist: [],
    scenaristResult: [],
    // 版权起止日期
    copyrightRange: [],
    // 当前选中的节目分类下的类型
    currentTypeList: []
};

const defaultVideo = {
    // 全平台通用id，从媒资系统过来
    commonId: '',
    // 节目id
    programmeId: '',
    // 名称
    name: '',
    // 文件原始名
    originName: '',
    // 详情
    description: '',
    // 视频封面图
    coverImage: null,
    // 时长,单位杪
    takeTimeInSec: '',
    // 用于排序，返回数据时倒叙排列
    sort: '',
    // 子集父id,自引用，比如电视剧下集预告，或者综艺的片花等需要绑定某一指定集
    parentId: '',
    // 是否显示，下架visible=false
    visible: null,
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
    // poStatus: '',
    status: 'NORMAL',
    // 创建时间
    createdAt: '',
    // 修改时间
    updatedAt: '',
    // 前端需要用到的id
    uid: '',
    m3u8For480P: '',
    m3u8For720P: '',
    m3u8For1080P: '',
    m3u8For4K: '',

    //  相关人物
    figureList: [],
    figureListResult: [],
    storageVideoId: '' // 视频资源库中的视频的id
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const defaultVideoPagination = {
    pageNum: 1,
    pageSize: 99999,
    total: 0
};

const defaultProgrammeVideo = {
    cacheSort: '',
    list: [],
    tempList: [],
    featureList: [],
    // pagination: _.cloneDeep(defaultPagination),
    pagination: _.cloneDeep(defaultVideoPagination),
    video: _.cloneDeep(defaultVideo)
};

const defaultProgrammeSearchFields = {
    keyword: '',
    visible: '',
    releaseAtStart: '', // 开始的发行日期
    releaseAtEnd: '', //  结束的发行日期
    produceAreaList: [],
    programmeTypeIdList: [],
    programmeCategoryIdList: []
};

const defaultGlobal = {
    categoryList: [],
    programmeTagList: [],
    licenceList: [],
    announcerList: [],
    copyrightReserverList: [],
    contestList: [],
    platformList: [],
    personId: ''
};

const defaultState = {
    searchFields: _.cloneDeep(defaultProgrammeSearchFields), // 新加
    pagination: _.cloneDeep(defaultPagination), // 新加
    global: _.cloneDeep(defaultGlobal), // 新加
    list: [],
    programme: _.cloneDeep(defaultProgramme), // 新加
    video: _.cloneDeep(defaultProgrammeVideo) // 新加
};

const state = _.clone(defaultState);

/**
 *  通过id获取节目
 */
function getProgrammeById(id) {
    let programme = state.list.find((item) => {
        return item.id === id;
    });
    return programme;
}

const getters = {
    // 新方法开始
    programmeList(state) {
        return state.list;
    },
    programmeSearchFields(state) {
        return state.searchFields;
    },
    programmeTypeOptions(state) {
        return state.searchFields.programmeCategoryIdList.reduce((res, id) => {
            let programmeTypeList = state.global.categoryList.find((category) => {
                return category.id === id;
            }).programmeTypeList;
            res = res.concat(programmeTypeList);
            return res;
        }, []);
    },
    programmePagination(state) {
        return state.pagination;
    },
    programme(state) {
        return state.programme;
    },
    //  导演，主演， 编剧
    role(state) {
        return (role) => {
            return state.programme[role].map((person) => person.id);
        };
    },
    programmeVisible(state) {
        return state.programme.visible;
    },
    getPersonDesc(state) {
        let {leadActorResult, directorResult, scenaristResult} = state.programme;
        let {figureList} = state.video.video;
        let result = [...leadActorResult, ...directorResult, ...scenaristResult, ...figureList];
        let person = result.find((person) => {
            return person.id === state.global.personId;
        });
        return person ? person.description : '';
    },
    // 分类，类型
    typeListOptions(state) {
        return state.programme.categoryList.reduce((res, id) => {
            let category = state.global.categoryList.find((category) => {
                return category.id === id;
            });
            if (!_.isEmpty(category)) {
                res = res.concat(category.programmeTypeList);
            }
            return res;
        }, []);
    },
    global(state) {
        return state.global;
    },
    programmeCategoryExist() {
        return ({value, data}) => {
            let {programmeTypeList} = data;
            let index = programmeTypeList.findIndex((type) => type.name === value);
            return index > -1;
        };
    },
    // 节目视频
    video(state) {
        return state.video;
    },
    cacheSort(state) {
        return state.video.cacheSort;
    },
    currentVideo(state) {
        return state.video.video;
    },
    videoPagination(state) {
        return state.video.pagination;
    },
    featureList(state) {
        return state.video.featureList;
    },
    videoPersonName(state) {
        return (figureList) => {
            return figureList ? figureList.map((figure) => figure.name).join(', ') : '';
        };
    },
    isUnsavedVideo(state) {
        return (id) => {
            let {list} = state.video;
            let video = list.find((video) => video.id === id);
            return video && video.new;
        };
    },
    featureVideoName(state) {
        return (id) => {
            let video = state.video.featureList.find((item) => {
                return item.id === id;
            });
            return video ? video.name : '';
        };
    },
    checkVideoIsSelected(state) {
        return (video) => {
            let {list} = state.video;
            let index = list.findIndex((item) => {
                return item.storageVideoId === video.id;
            });
            return index > -1;
        };
    },
    checkSortIsExist(state) {
        let sort = state.video.video.sort;
        let featureList = state.video.featureList;
        let list = state.video.list;
        let index = featureList.findIndex((video) => parseInt(video.sort) === parseInt(sort));
        let otherIndex = list.findIndex((video) => parseInt(video.sort) === parseInt(sort));
        return index > -1 || otherIndex > -1;
    },
    checkSortIsLargeThanTotalSets(state) {
        let sort = state.video.video.sort;
        let totalSets = state.programme.totalSets;
        if (sort) {
            return parseInt(sort) > parseInt(totalSets);
        } else {
            return false;
        }
    },
    // 新方法结束
    isTvPlay(state) {
        let category = state.global.categoryList.find((item) => item.name === '电视剧');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item === id);
        return index >= 0;
    },
    isShow(state) {
        let category1 = state.global.categoryList.find((item) => item.name === '卫视综艺');
        let category2 = state.global.categoryList.find((item) => item.name === '网络综艺');
        let id1 = category1 ? category1.id : '';
        let id2 = category2 ? category2.id : '';
        let index = state.programme.categoryList.findIndex((item) => (item === id1 || item === id2));
        return index >= 0;
    },
    isMovie(state) {
        let category = state.global.categoryList.find((item) => item.name === '电影');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item === id);
        return index >= 0;
    },
    isEducation(state) {
        let category = state.global.categoryList.find((item) => item.name === '教育');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item === id);
        return index >= 0;
    },
    isSports(state) {
        let category = state.global.categoryList.find((item) => item.name === '体育');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item === id);
        return index >= 0;
    },
    categoryListString(state) {
        return (categoryList) => {
            return categoryList.map((item) => item.name).join(',');
        };
    },
    typeList(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            return programme.typeList.map((item) => item.name).join(', ');
        };
    },
    getDirector(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let director = programme.figureListMap['DIRECTOR'] ? programme.figureListMap['DIRECTOR'] : [];
            return director.map((item) => item.name).join(', ');
        };
    },
    getChiefActor(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let chiefActor = programme.figureListMap['CHIEF_ACTOR'] ? programme.figureListMap['CHIEF_ACTOR'] : [];
            return chiefActor.map((item) => item.name).join(', ');
        };
    },
    getScenarist(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let scenarist = programme.figureListMap['SCENARIST'] ? programme.figureListMap['SCENARIST'] : [];
            return scenarist.map((item) => item.name).join(', ');
        };
    }
};

const mutations = {
    resetProgramme(state) {
        state.searchFields = _.cloneDeep(defaultProgrammeSearchFields); // 新加
        state.pagination = _.cloneDeep(defaultPagination); // 新加
        state.global = _.cloneDeep(defaultGlobal); // 新加
        state.list = [];
        state.programme = _.cloneDeep(defaultProgramme); // 新加
        state.video = _.cloneDeep(defaultProgrammeVideo); // 新加
    },
    setProgrammeList(state, payload) {
        state.list = payload.list;
    },
    // 节目分页
    setProgrammePagination(state, payload) {
        state.pagination.pageSize = payload.pageSize;
        state.pagination.pageNum = payload.pageNum;
        state.pagination.total = payload.total;
    },
    updateProgrammePagination(state, payload) {
        let {key, value} = payload;
        state.pagination[key] = value;
    },
    resetProgrammePagination(state) {
        state.pagination = _.cloneDeep(defaultPagination);
    },
    // 人物
    setPersonId(state, payload) {
        state.global.personId = payload.id;
    },
    // 节目搜索
    updateProgrammeSearchFields(state, payload) {
        let {key, value} = payload;
        state.searchFields[key] = value;
    },
    resetProgrammeSearchFields(state) {
        state.searchFields = _.cloneDeep(defaultProgrammeSearchFields);
    },
    // 全局数据 global
    updateGlobal(state, payload) {
        let {key, value} = payload;
        state.global[key] = value;
    },
    addProgrammeTag(state, payload) {
        state.global.programmeTagList.unshift(payload.value);
    },
    // 节目详情
    setProgramme(state, payload) {
        let {programme} = payload;
        Object.keys(programme).forEach((key) => {
            if (programme[key] !== null) {
                state.programme[key] = programme[key];
            }
        });
    },
    updateProgramme(state, payload) {
        let {key, value} = payload;
        state.programme[key] = value;
    },
    updateProgrammeVisible(state) {
        state.programme.visible = !state.programme.visible;
    },
    // 选择列表项的添加
    addSelectItem(state, payload) {
        let {key, value} = payload;
        state.global[key].unshift({value});
    },
    updatePersonResult(state, payload) {
        let {key, value} = payload;
        let result = state.programme[key].concat(value);
        state.programme[key] = _.uniqBy(result, 'id');
    },
    updatePerson(state, payload) {
        let {key, idList} = payload;
        state.programme[key] = idList.map((id) => {
            let resultKey = `${key}Result`;
            return state.programme[resultKey].find((item) => {
                return item.id === id;
            });
        });
    },
    //  节目视频
    setVideoList(state, payload) {
        state.video.list = payload.list;
    },
    setCacheSort(state, payload) {
        state.video.cacheSort = payload.sort;
    },
    setFeatureList(state, payload) {
        state.video.featureList = payload.list;
    },
    setVideoPagination(state, payload) {
        state.video.pagination.pageSize = payload.pageSize;
        state.video.pagination.pageNum = payload.pageNum;
        state.video.pagination.total = payload.total;
    },
    updateVideoPagination(state, payload) {
        let {key, value} = payload;
        state.video.pagination[key] = value;
    },
    setCurrentVideo(state, payload) {
        let {currentVideo} = payload;
        Object.keys(currentVideo).forEach((key) => {
            if (currentVideo[key] !== null) {
                state.video.video[key] = currentVideo[key];
            }
        });
        state.video.video.figureListResult = currentVideo.figureList;
    },
    updateVideo(state, payload) {
        let {key, value} = payload;
        state.video.video[key] = value;
    },
    setVideoCoverImage(state, payload) {
        state.video.video.coverImage = payload.posterImage;
    },
    resetVideoPagination(state) {
        // state.video.pagination = _.cloneDeep(defaultPagination);
        state.video.pagination = _.cloneDeep(defaultVideoPagination);
    },
    resetCurrentVideo(state) {
        state.video.video = _.cloneDeep(defaultVideo);
    },
    updateCurrentVideo(state, payload) {
        let {video} = payload;
        let id = video.id;
        let list = state.video.list;
        state.video.list = list.map((item) => {
            if (item.id === id) {
                return video;
            } else {
                return item;
            }
        });
    },
    addVideoToTempList(state) {
        let {video} = state.video;
        state.video.video.uid = uuid();
        state.video.tempList.push(video);
    },
    addVideoToList(state) {
        let {video, list} = state.video;
        video.id = uuid();
        video.new = true;
        list.unshift(video);
        state.video.list = list;
    },
    //  删除临时的视频
    deleteVideoFromList(state, payload) {
        let {id} = payload;
        let {list} = state.video;
        state.video.list = list.filter((video) => video.id !== id);
    },
    deleteVideoFromTempList(state, payload) {
        let {tempList} = state.video;
        state.video.tempList = tempList.filter((video) => video.uid !== payload.uid);
    },
    syncVideoMetaData(state, payload) {
        state.video.video.takeTimeInSec = payload.video.takeTimeInSec;
        state.video.video.originName = payload.video.originName;
        state.video.video.m3u8For480P = payload.video.m3u8For480P;
        state.video.video.m3u8For720P = payload.video.m3u8For720P;
        state.video.video.m3u8For1080P = payload.video.m3u8For1080P;
        state.video.video.m3u8For4K = payload.video.m3u8For4K;
        state.video.video.storageVideoId = payload.video.id;
    },
    updateVideoVisible(state, payload) {
        state.video.list = state.video.list.map((item) => {
            if (item.id === payload.id) {
                item.visible = !item.visible;
                return item;
            } else {
                return item;
            }
        });
    },
    deleteTempList(state) {
        state.video.tempList = [];
    },
    //  更新视频下的人物
    updateVideoPersonResult(state, payload) {
        let {key, value} = payload;
        let result = state.video.video[key].concat(value);
        state.video.video[key] = _.uniqBy(result, 'id');
    },
    updateVideoPerson(state, payload) {
        let {key, idList} = payload;
        state.video.video[key] = idList.map((id) => {
            let resultKey = `${key}Result`;
            let person = state.video.video[resultKey].find((item) => {
                return item.id === id;
            });
            if (person) {
                return {
                    id: person.id,
                    name: person.name,
                    avatarUri: person.avatarImage && person.avatarImage.uri ? person.avatarImage.uri : ''
                };
            }
        });
    },
    // 节目图片
    setCoverImage(state) {
        let coverImage = state.programme.posterImageList.find((img) => {
            return parseInt(img.width) === 240 && parseInt(img.height) === 350;
        });
        let horizontalCoverImage = state.programme.posterImageList.find((img) => {
            return parseInt(img.width) === 807 && parseInt(img.height) === 455;
        });
        state.programme.coverImage = coverImage;
        state.programme.horizontalCoverImage = horizontalCoverImage;
    },
    // 新加代码结束
    addPosterImage(state, payload) {
        if (!checkImageExist(state.programme.posterImageList, payload.posterImage)) {
            state.programme.posterImageList.push(payload.posterImage);
        }
    },
    deletePosterImage(state, payload) {
        let {coverImage, posterImageList} = state.programme;
        if (coverImage && coverImage.id === payload.id) {
            state.programme.coverImage = {};
        }
        state.programme.posterImageList = posterImageList.filter((img) => img.id !== payload.id);
    },
    deleteProgrammeCategory(state, payload) {
        let {node, data} = payload;
        let parentId = node.parent.data.id;
        let childrenId = data.id;
        state.global.categoryList = state.global.categoryList.map((category) => {
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
        state.global.categoryList = state.global.categoryList.map((category) => {
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
    },
    saveProgramme(state) {
        wsCache.localStorage.set('programme', state.currentProgramme);
    },
    removeProgramme(state) {
        wsCache.localStorage.remove('programme');
    },
    getProgrammeFromLocalStorage() {
        return wsCache.localStorage.get('programme');
    }
};

/**
 * 对节目数据做处理
 */
function formatProgramme(programme, state) {
    let {global: {categoryList}, video: {list}} = state;
    let programmeTypeList = categoryList.reduce((res, curr) => {
        return res.concat(curr.programmeTypeList);
    }, []);
    let result = Object.assign({}, programme, {
        // 版权开始日期
        copyrightStartedAt: programme.copyrightRange[0],
        // 版权结束日期
        copyrightEndedAt: programme.copyrightRange[1],
        featureVideoCount: list.filter((video) => video.type === 'FEATURE').length,
        categoryList: programme.categoryList.map((id) => {
            let category = categoryList.find((category) => category.id === id);
            return category;
        }),
        typeList: programme.typeList.map((id) => {
            let type = programmeTypeList.find((type) => type.id === id);
            return type;
        }),
        // 人物
        licence: programme.licence === '' ? null : programme.licence,
        figureList: [].concat(programme.leadActor.map((item) => {
            let obj = {};
            obj.role = 'DIRECTOR';
            obj.id = item.id;
            obj.name = item.name;
            obj.avatarUri = item.avatarUri;
            if (!obj.avatarUri) {
                if (item.avatarImage && item.avatarImage.uri) {
                    obj.avatarUri = item.avatarImage.uri;
                } else {
                    obj.avatarUri = '';
                }
            }
            return obj;
        })).concat(programme.director.map((item) => {
            let obj = {};
            obj.role = 'CHIEF_ACTOR';
            obj.id = item.id;
            obj.name = item.name;
            obj.avatarUri = item.avatarUri;
            if (!obj.avatarUri) {
                if (item.avatarImage && item.avatarImage.uri) {
                    obj.avatarUri = item.avatarImage.uri;
                } else {
                    obj.avatarUri = '';
                }
            }
            return obj;
        })).concat(programme.scenarist.map((item) => {
            let obj = {};
            obj.role = 'SCENARIST';
            obj.id = item.id;
            obj.name = item.name;
            obj.avatarUri = item.avatarUri;
            if (!obj.avatarUri) {
                if (item.avatarImage && item.avatarImage.uri) {
                    obj.avatarUri = item.avatarImage.uri;
                } else {
                    obj.avatarUri = '';
                }
            }
            return obj;
        }))
    });
    return result;
}

/**
 *  序列化服务端返回的数据
 */
function serializeProgrammData(programme) {
    let director = programme.figureListMap['DIRECTOR'] ? programme.figureListMap['DIRECTOR'] : [];
    let leadActor = programme.figureListMap['CHIEF_ACTOR'] ? programme.figureListMap['CHIEF_ACTOR'] : [];
    let scenarist = programme.figureListMap['SCENARIST'] ? programme.figureListMap['SCENARIST'] : [];
    let directorResult = [];
    let leadActorResult = [];
    let scenaristResult = [];

    if (director.length > 0) {
        directorResult = director;
    }
    if (leadActor.length > 0) {
        leadActorResult = leadActor;
    }
    if (scenarist.length > 0) {
        scenaristResult = scenarist;
    }

    let res = Object.assign({}, defaultProgramme, programme, {
        copyrightRange: [programme.copyrightStartedAt, programme.copyrightEndedAt],
        categoryList: programme.categoryList.map((category) => category.id),
        typeList: programme.typeList.filter((type) => type !== null).map((type) => type.id),
        director,
        leadActor,
        scenarist,
        directorResult,
        leadActorResult,
        scenaristResult
    });
    return res;
}

/**
 * 对等待上传的节目视频列表做处理
 */
function filterProgrammeVideoList(list, programme) {
    let resultList = list.map((video, index) => {
        let result = Object.assign({}, video, {
            programmeId: programme.id,
            programmeName: programme.name,
            order: index
        });
        if (result.new) {
            delete result.id;
        }
        return result;
    });
    return resultList;
}

const actions = {
    /**
     * 获取节目列表
     */
    async getProgrammeList({commit, state}) {
        try {
            let params = Object.assign({}, state.searchFields, {
                pageSize: state.pagination.pageSize,
                pageNum: state.pagination.pageNum - 1
            });
            let res = await service.getProgrammeList(params);
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('setProgrammeList', {list});
                commit('setProgrammePagination', {pageSize, pageNum: pageNum + 1, total});
            }
        } catch (err) {
        }
    },
    /**
     * 获取节目分类
     */
    async getProgrammeCategory({commit, state}) {
        try {
            let res = await service.getProgrammeCategory();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'categoryList', value: res.data});
            }
        } catch (err) {
        }
    },
    /**
     * 全量更新节目分类
     */
    async updateProgrammeCategory({commit, state}) {
        try {
            let categoryList = _.cloneDeep(state.global.categoryList);
            categoryList.forEach((item) => {
                item.programmeTypeList.forEach((innerItem) => {
                    if (/^category_/.test(innerItem.id)) {
                        delete innerItem.id;
                    }
                });
            });
            let res = await service.updateProgrammeCategory({categoryList});
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'categoryList', value: res.data});
            }
        } catch (err) {
        }
    },
    /**
     * 判断当前类型下面是不是有节目
     */
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
    /**
     * 创建节目
     */
    async createProgramme({commit, state}) {
        try {
            let programme = formatProgramme(state.programme, state);
            let res = await service.createProgramme(programme);
            return res;
        } catch (err) {
        }
    },
    /**
     * 根据节目的id更新节目信息
     */
    async updateProgrammeById({commit, state}, id) {
        try {
            let programme = formatProgramme(state.programme, state);
            let res = await service.updateProgrammeInfo({id, programme});
            return res;
        } catch (err) {
        }
    },
    /**
     *  根据节目的id获取该节目下的视频列表
     */
    async getProgrammeVideoListById({commit, state}, id) {
        try {
            let {pageSize, pageNum} = state.video.pagination;
            let res = await service.getProgrammeVideoListById({pageSize, pageNum: pageNum - 1, programmeId: id});
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('setVideoList', {list});
                commit('setVideoPagination', {pageSize, pageNum: pageNum + 1, total});
            }
        } catch (err) {
        }
    },
    /**
     * 根据id删除节目
     */
    async realDeleteProgramme({commit, state}, id) {
        try {
            let res = await service.realDeleteProgramme(id);
            return res;
        } catch (err) {}
    },
    async getProgrammeAndGetProgrammeCategory({commit, state}, id) {
        try {
            let res = await axios.all([service.getProgrammeInfo({id}), service.getProgrammeCategory()]);
            if (res[0] && res[0].code === 0) {
                commit('setProgramme', {programme: serializeProgrammData(res[0].data)});
            }
            if (res[1] && res[1].code === 0) {
                commit('updateGlobal', {key: 'categoryList', value: res[1].data});
            }
            return res;
        } catch (err) {
        }
    },
    async deleteProgramme({commit, state}, id) {
        try {
            let res = await service.deleteProgramme({id});
            if (res && res.code === 0) {
                commit('updateProgrammeVisible');
            }
        } catch (err) {
        }
    },
    async getProgrammeTagList({commit, state}) {
        try {
            let res = await service.getProgrammeTagList();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'programmeTagList', value: res.data});
            }
        } catch (err) {
        }
    },
    async getProgrammeAnnouncerList({commit, state}) {
        try {
            let res = await service.getProgrammeAnnouncerList();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'announcerList', value: res.data});
            }
        } catch (err) {
        }
    },
    async getProgrammeContestList({commit, state}) {
        try {
            let res = await service.getProgrammeContestList();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'contestList', value: res.data});
            }
        } catch (error) {
        }
    },
    async getProgrammeCopyrightList({commit, state}) {
        try {
            let res = await service.getProgrammeCopyrightList();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'copyrightReserverList', value: res.data});
            }
        } catch (err) {
        }
    },
    async getProgrammeLicenceList({commit, state}) {
        try {
            let res = await service.getProgrammeLicenceList();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'licenceList', value: res.data});
            }
        } catch (err) {
        }
    },
    async getProgrammePlatformList({commit, state}) {
        try {
            let res = await service.getProgrammePlatformList();
            if (res && res.code === 0) {
                commit('updateGlobal', {key: 'platformList', value: res.data});
            }
        } catch (err) {
        }
    },
    // 视频相关的请求
    async createMultProgrammeVideo({commit, state}, {programme}) {
        try {
            let {list} = state.video;
            let videoList = filterProgrammeVideoList(list, programme);
            let res = await service.createMultProgrammeVideo(videoList);
            return res;
        } catch (err) {}
    },
    async getProgrammeVideoById({commit, state}, id) {
        try {
            let res = await service.getProgrammeVideoInfo({id});
            if (res && res.code === 0) {
                commit('setCurrentVideo', {currentVideo: res.data});
                commit('setCacheSort', {sort: res.data.sort});
            }
        } catch (err) {
        }
    },
    async getFeatureVideoList({commit, state}, {id, pageSize}) {
        try {
            let res = await service.getProgrammeVideoListById({programmeId: id, pageSize: pageSize <= 0 ? 1 : pageSize, pageNum: 0, typeList: ['FEATURE']});
            if (res && res.code === 0) {
                let {list} = res.data;
                commit('setFeatureList', {list});
            }
        } catch (err) {
        }
    },
    async updateProgrammeVideoById({commit, state}) {
        try {
            let id = state.video.video.id;
            let video = _.cloneDeep(state.video.video);
            if (video.type === 'FEATURE') {
                video.parentId = '';
            }
            let res = await service.updateProgrammeVideoInfo({id, video});
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) {
        }
    },
    async realDeleteProgrammeVideoById({commit, state}, id) {
        try {
            let res = await service.deleteProgrammeVideoById(id);
            if (res && res.code === 0) {
                return res;
            }
        } catch (err) {
        }
    },
    async deleteProgrammeVideoById({commit, state}, id) {
        try {
            let res = await service.deleteProgrammeVideo({id});
            if (res && res.code === 0) {
                commit('updateVideoVisible', {id});
            }
        } catch (err) {
        }
    },
    //  字典
    async getDict({commit, state}, categoryList) {
        try {
            let res = await service.getDict({categoryList});
            if (res && res.code === 0) {
                let licenceList = _.uniqBy(res.data.reduce((res, item) => {
                    return item.name === 'LICENCE' ? res.concat(item.optionList) : res;
                 }, []), 'value');
                let announcerList = _.uniqBy(res.data.reduce((res, item) => {
                    return item.name === 'ANNOUNCER' ? res.concat(item.optionList) : res;
                 }, []), 'value');
                let copyrightReserverList = _.uniqBy(res.data.reduce((res, item) => {
                    return item.name === 'COPYRIGHT_RESERVED' ? res.concat(item.optionList) : res;
                 }, []), 'value');
                let contestList = _.uniqBy(res.data.reduce((res, item) => {
                    return item.name === 'CONTEST' ? res.concat(item.optionList) : res;
                 }, []), 'value');
                let platformList = _.uniqBy(res.data.reduce((res, item) => {
                    return item.name === 'PLATFORM' ? res.concat(item.optionList) : res;
                 }, []), 'value');

                 commit('updateGlobal', {key: 'licenceList', value: licenceList});
                 commit('updateGlobal', {key: 'announcerList', value: announcerList});
                 commit('updateGlobal', {key: 'copyrightReserverList', value: copyrightReserverList});
                 commit('updateGlobal', {key: 'contestList', value: contestList});
                 commit('updateGlobal', {key: 'platformList', value: platformList});
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
