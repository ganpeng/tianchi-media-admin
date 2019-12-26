import axios from 'axios';
import _ from 'lodash';
import uuid from 'uuid';
import store from 'store';
import service from '../../../service';
import wsCache from '@/util/webStorage';
import {checkImageExist, getPageSize} from '@/util/formValidate';

let isLoading = false; //  列表页面重复点击的校验

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
    //  节目版式
    programmeTemplate: '',
    // 年级
    gradeList: [],
    // 规格
    specList: [],
    // 科目
    subject: '',
    cornerMark: {},
    // 赛事
    contest: '',
    // 播放平台
    platformList: [],
    // 正片数量,总集数（电视剧是预知的，综艺节目是变化的）
    featureVideoCount: '',
    // 节目看点
    desc: '',
    // 是否下架
    visible: false,
    // 节目描述
    description: '',
    // 节目规则
    updateRule: '',
    // 发行时间
    announceAt: '',
    // 状态 ENUM('NORMAL', 'DELETE') DEFAULT 'NORMAL'
    status: null,
    // 节目海报，json字符串存储，包含以下几个字段，fileId，uri，width，high")
    posterImageList: [],
    //  app端节目图片
    posterImageListForApp: [],
    // 相关人物
    figureList: [],
    //  figureListMap
    figureListMap: {},
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
    currentTypeList: [],

    //  v2.3.0中新增加的字段
    applicableClientList: ['APP', 'TV'], // 客户端适用的字段

    //  v2.3.6中新增字段
    price: '', // 单点付费金额
    paymentType: 'FREE', // 支付情况字段

    // dev_v2.6 新增
    coverImageForApp: {}, //  移动端六分位图片
    horizontalCoverImageForApp: {}// 移动端横版海报图
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
    pageSize: getPageSize('programmePageSize'),
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
    pagination: _.cloneDeep(defaultVideoPagination),
    video: _.cloneDeep(defaultVideo)
};

const defaultProgrammeSearchFields = {
    keyword: '',
    visible: '',
    releaseAtDateRange: [],
    releaseAtStart: '', // 开始的发行日期
    releaseAtEnd: '', //  结束的发行日期
    produceAreaList: '',
    programmeTypeIdList: '',
    programmeCategoryIdList: '',
    refCount: '', //  关联
    paymentType: '', // 支付情况
    //  dev_v2.6 新增
    applicableClientList: []
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
        let categoryIdList = [state.searchFields.programmeCategoryIdList];
        return categoryIdList.reduce((res, id) => {
            let programmeType = state.global.categoryList.find((category) => {
                return category.id === id;
            });
            let programmeTypeList = programmeType && programmeType.programmeTypeList ? programmeType.programmeTypeList : [];
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
    // 地区
    areaLabel() {
        return (areaList) => {
            let areas = store.get('areaList') || [];
            return areaList.reduce((res, curr) => {
                let area = areas.find((item) => item.code === curr);
                if (area) {
                    res.push(area);
                }
                return res;
            }, []);
        };
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
        return state.programme.categoryList.reduce((res, _category) => {
            let category = state.global.categoryList.find((category) => {
                return category.id === _category.id;
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
        if (state.video.video.type !== 'FEATURE') { // 如果不是正片的话就跳过判断
            return false;
        }
        // let featureList = state.video.featureList;
        let list = state.video.list;
        let otherIndex = list.findIndex((video) => parseInt(video.sort) === parseInt(sort));
        return otherIndex > -1;
        // let index = featureList.findIndex((video) => parseInt(video.sort) === parseInt(sort));
        // return index > -1;
        // return index > -1 || otherIndex > -1;
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
        let index = state.programme.categoryList.findIndex((item) => item.id === id);
        return index >= 0;
    },
    isShow(state) {
        let category1 = state.global.categoryList.find((item) => item.name === '卫视综艺');
        let category2 = state.global.categoryList.find((item) => item.name === '网络综艺');
        let id1 = category1 ? category1.id : '';
        let id2 = category2 ? category2.id : '';
        let index = state.programme.categoryList.findIndex((item) => (item.id === id1 || item.id === id2));
        return index >= 0;
    },
    isMovie(state) {
        let category = state.global.categoryList.find((item) => item.name === '电影');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item.id === id);
        return index >= 0;
    },
    isEducation(state) {
        let category = state.global.categoryList.find((item) => item.name === '教育');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item.id === id);
        return index >= 0;
    },
    isSports(state) {
        let category = state.global.categoryList.find((item) => item.name === '体育');
        let id = category ? category.id : '';
        let index = state.programme.categoryList.findIndex((item) => item.id === id);
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
            let allTypeList = programme ? programme.categoryList.reduce((prev, curr) => {
                let obj = state.global.categoryList.find((item) => item.id === curr.id);
                if (obj) {
                    return prev.concat(obj.programmeTypeList);
                } else {
                    return prev.concat([]);
                }
            }, []) : [];
            let typeList = programme ? programme.typeList.filter((item) => {
                let findIndex = allTypeList.findIndex((ele) => ele.id === item.id);
                return findIndex > -1;
            }) : [];
            return typeList.map((item) => item.name).join(', ');
        };
    },
    getDirector(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let director = programme && programme.figureListMap['DIRECTOR'] ? programme.figureListMap['DIRECTOR'] : [];
            return director.map((item) => item.name).join(', ');
        };
    },
    getChiefActor(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let chiefActor = programme && programme.figureListMap['ACTOR'] ? programme.figureListMap['ACTOR'] : [];
            return chiefActor.map((item) => item.name).join(', ');
        };
    },
    getScenarist(state) {
        return (id) => {
            let programme = getProgrammeById(id);
            let scenarist = programme && programme.figureListMap['SCENARIST'] ? programme.figureListMap['SCENARIST'] : [];
            return scenarist.map((item) => item.name).join(', ');
        };
    },
    getAllRoleList(state) {
        let {figureListMap} = state.programme;
        let directorList = figureListMap['DIRECTOR'] ? figureListMap['DIRECTOR'] : [];
        let chiefActorList = figureListMap['ACTOR'] ? figureListMap['ACTOR'] : [];
        let scenaristList = figureListMap['SCENARIST'] ? figureListMap['SCENARIST'] : [];
        return [...directorList, ...chiefActorList, ...scenaristList];
    }
};

const mutations = {
    resetProgramme(state) {
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
        if (key === 'releaseAtDateRange') {
            state.searchFields.releaseAtStart = state.searchFields.releaseAtDateRange ? state.searchFields.releaseAtDateRange[0] : '';
            state.searchFields.releaseAtEnd = state.searchFields.releaseAtDateRange ? state.searchFields.releaseAtDateRange[1] : '';
        }
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
        if (key === 'paymentType' && value !== 'EXTRAS') {
            state.programme.price = 0;
        }
    },
    updateProgrammeVisible(state) {
        state.programme.visible = !state.programme.visible;
    },
    // 选择列表项的添加
    addSelectItem(state, payload) {
        let {key, value} = payload;
        state.global[key].unshift({value});
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
        if (key === 'free') {
            state.video.video[key] = value;
        } else {
            state.video.video[key] = value || null;
        }
    },
    setVideoCoverImage(state, payload) {
        state.video.video.coverImage = payload.coverImage;
    },
    resetVideoPagination(state) {
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
    addVideoToList(state) {
        let {video, list} = state.video;
        video.id = uuid();
        video.new = true;
        video.visible = true;
        list.unshift(video);
        state.video.list = list;
    },
    //  删除临时的视频
    deleteVideoFromList(state, payload) {
        let {id} = payload;
        let {list} = state.video;
        state.video.list = list.filter((video) => video.id !== id);
        // if (state.video.list.length === 0) {
        //     state.programme.visible = null;
        // }
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
        let coverImage1 = state.programme.posterImageList.find((img) => {
            return parseInt(img.width) === 260 && parseInt(img.height) === 380;
        });
        let coverImage2 = state.programme.posterImageList.find((img) => {
            return parseInt(img.width) === 240 && parseInt(img.height) === 350;
        });

        let coverImage = coverImage1 || coverImage2;
        state.programme.coverImage = coverImage;
    },
    addImageToPosterImageList(state, payload) {
        let {image} = payload;
        let width = _.get(image, 'width');
        let height = _.get(image, 'height');
        if (parseInt(width) === 260 && parseInt(height) === 380) {
            state.programme.coverImage = image;
            state.programme.posterImageList = state.programme.posterImageList.filter((item) => {
                return parseInt(item.width) !== 260 && parseInt(item.height) !== 380;
            });
            state.programme.posterImageList.unshift(image);
        } else if (parseInt(width) === 240 && parseInt(height) === 350) {
            state.programme.posterImageList = state.programme.posterImageList.filter((item) => {
                return parseInt(item.width) !== 240 && parseInt(item.height) !== 350;
            });
            state.programme.posterImageList.push(image);
        } else {
            state.programme.posterImageList.push(image);
        }
        state.programme.posterImageList = _.uniqBy(state.programme.posterImageList, 'id');
    },
    addImageToPosterImageListForApp(state, payload) {
        let {image} = payload;
        state.programme.posterImageListForApp.push(image);
        state.programme.posterImageListForApp = _.uniqBy(state.programme.posterImageListForApp, 'id');
    },
    deleteImageFromPosterImageListById(state, payload) {
        let {id} = payload;
        state.programme.posterImageList = state.programme.posterImageList.filter((image) => image.id !== id);
        if (id === state.programme.coverImage.id) {
            state.programme.coverImage = {};
        }
    },
    deleteImageFromPosterImageListForAppById(state, payload) {
        let {id} = payload;
        state.programme.posterImageListForApp = state.programme.posterImageListForApp.filter((image) => image.id !== id);
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
        let {parentId, childrenId} = payload;
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
    },
    // 新的人物搜索的交互代码
    addPersonByRole(state, payload) {
        let {role, person} = payload;
        let obj = {};
        let pRole = '';

        switch (role) {
            case 'leadActor':
                pRole = 'ACTOR';
                break;
            case 'director':
                pRole = 'DIRECTOR';
                break;
            case 'scenarist':
                pRole = 'SCENARIST';
                break;
            default:
                throw new Error('人物类型错误');
        }

        obj.id = person.id;
        obj.name = person.name;
        obj.avatarUri = _.get(person, 'avatarImage.uri');
        obj.role = pRole;
        obj.playRole = null;
        obj.visible = null;

        state.programme[role].push(obj);
        state.programme[role] = _.uniqBy(state.programme[role], 'id');
    },
    deletePersonById(state, payload) {
        let {id, key} = payload;
        state.programme[key] = state.programme[key].filter((person) => person.id !== id);
    },
    //  搜索分类类型
    addCategoryToList(state, payload) {
        let {category} = payload;
        state.programme.categoryList.push(category);
        state.programme.categoryList = _.uniqBy(state.programme.categoryList, 'id');
    },
    addTypeToList(state, type) {
        state.programme.typeList.push(type);
        state.programme.typeList = _.uniqBy(state.programme.typeList, 'id');
    },
    deleteCategoryOrTypeById(state, payload) {
        let {id, key} = payload;
        state.programme[key] = state.programme[key].filter((person) => person.id !== id);
    },
    //  搜索分类结束
    //  搜索地区开始
    addAreaToList(state, payload) {
        let {area} = payload;
        let code = _.get(area, 'code');
        state.programme.produceAreaList.push(code);
        state.programme.produceAreaList = _.uniq(state.programme.produceAreaList);
    },
    deleteAreaByCode(state, payload) {
        let {code} = payload;
        state.programme.produceAreaList = state.programme.produceAreaList.filter((_code) => _code !== code);
    },
    // 搜索地区结束
    // 搜索关键字开始
    addTagToList(state, payload) {
        let {tag} = payload;
        let name = _.get(tag, 'name');
        state.programme.tagList.push(name);
        state.programme.tagList = _.uniq(state.programme.tagList);
    },
    deleteTagByName(state, payload) {
        let {tag} = payload;
        state.programme.tagList = state.programme.tagList.filter((_tag) => _tag !== tag);
    },
    //  搜索关键字结束
    //  播放平台搜索开始
    addPlatformToList(state, payload) {
        let {platform} = payload;
        let name = _.get(platform, 'name');
        state.programme.platformList.push(name);
        state.programme.platformList = _.uniq(state.programme.platformList);
    },
    deletePlatformByName(state, payload) {
        let {platform} = payload;
        state.programme.platformList = state.programme.platformList.filter((_platform) => _platform !== platform);
    },
    //  播放平台搜索结束
    //  年级搜索开始
    addGradeToList(state, payload) {
        let {grade} = payload;
        let name = _.get(grade, 'name');
        state.programme.gradeList.push(name);
        state.programme.gradeList = _.uniq(state.programme.gradeList);
    },
    deleteGradeByName(state, payload) {
        let {grade} = payload;
        state.programme.gradeList = state.programme.gradeList.filter((_grade) => _grade !== grade);
    },
    //  年级搜索结束
    //  规格搜索开始
    addSpecToList(state, payload) {
        let {spec} = payload;
        let name = _.get(spec, 'name');
        state.programme.specList.push(name);
        state.programme.specList = _.uniq(state.programme.specList);
    },
    deleteSpecByName(state, payload) {
        let {spec} = payload;
        state.programme.specList = state.programme.specList.filter((_spec) => _spec !== spec);
    },
    //  规格搜索结束
    /**
     * 节目中当前视频的相关操作开始
     */
    //  视频中figureList的增删改查
    addFigureToList(state, payload) {
        let {figure} = payload;
        state.video.video.figureList.push(figure);
        state.video.video.figureList = _.uniqBy(state.video.video.figureList, 'id');
    },
    deleteFigureById(state, payload) {
        let {id} = payload;
        state.video.video.figureList = state.video.video.figureList.filter((figure) => figure.id !== id);
    },
    //  视频中figureList的增删改查结束
    updateProgrammeMark(state, payload) {
        let {key, checked} = payload;
        let markType = '';
        switch (key) {
            case 'leftTop':
                markType = 'PLATFORM';
                break;
            case 'leftBottom':
                markType = 'EPISODES_NUMBER';
                break;
            case 'rightBottom':
                markType = 'SCORE';
                break;
            default:
                throw new Error('角标的key不存在');
        }
        if (checked) {
            state.programme.cornerMark[key] = {
                caption: '',
                imageUri: '',
                markType
            };
        } else {
            // delete state.programme.cornerMark[key];
            state.programme.cornerMark[key] = null;
        }
    },
    //  dev_v2.6新增
    setImageForApp(state, payload) {
        let {image} = payload;
        if (parseInt(image.width) === 384 && parseInt(image.height) === 561) {
            state.programme.coverImageForApp = image;
        }

        if (parseInt(image.width) === 330 && parseInt(image.height) === 186) {
            state.programme.horizontalCoverImageForApp = image;
        }
    },
    clearImageForApp(state, payload) {
        let {id} = payload;
        if (id === _.get(state.programme, 'coverImageForApp.id')) {
            state.programme.coverImageForApp = {};
        }

        if (id === _.get(state.programme, 'horizontalCoverImageForApp.id')) {
            state.programme.horizontalCoverImageForApp = {};
        }
    }
};

/**
 * 对节目数据做处理
 */
function formatProgramme(programme, state) {
    let {video: {list}} = state;
    let result = Object.assign({}, programme, {
        // 版权开始日期
        copyrightStartedAt: programme.copyrightRange[0],
        // 版权结束日期
        copyrightEndedAt: programme.copyrightRange[1],
        featureVideoCount: list.filter((video) => video.type === 'FEATURE').length,
        // 人物
        licence: programme.licence === '' ? null : programme.licence,
        price: programme.price * 100,
        figureList: [].concat(programme.leadActor.map((item) => {
            let obj = {};
            obj.role = 'ACTOR';
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
function serializeProgrammData(programme, state) {
    let director = programme.figureListMap['DIRECTOR'] ? programme.figureListMap['DIRECTOR'] : [];
    let leadActor = programme.figureListMap['ACTOR'] ? programme.figureListMap['ACTOR'] : [];
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
        director,
        leadActor,
        scenarist,
        directorResult,
        leadActorResult,
        scenaristResult,
        price: programme.price / 100,
        coverImageForApp: programme.coverImageForApp || {}, // 移动端6分位
        horizontalCoverImageForApp: programme.horizontalCoverImageForApp || {} // 横版海报
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
    async getProgrammeList({commit, state}, keyword) {
        try {
            if (!isLoading) {
                isLoading = true;
                let searchFields = Object.assign({}, state.searchFields, {
                    produceAreaList: [state.searchFields.produceAreaList],
                    categoryIdList: [state.searchFields.categoryIdList],
                    programmeTypeIdList: [state.searchFields.programmeTypeIdList]
                });
                let params = {};
                if (keyword) {
                    params = Object.assign({}, searchFields, {
                        pageSize: state.pagination.pageSize,
                        pageNum: state.pagination.pageNum - 1,
                        keyword
                    });
                } else {
                    params = Object.assign({}, searchFields, {
                        pageSize: state.pagination.pageSize,
                        pageNum: state.pagination.pageNum - 1
                    });
                }
                let res = await service.getProgrammeList(params);
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeList', {list});
                    commit('setProgrammePagination', {pageSize, pageNum: pageNum + 1, total});
                }
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
        }
    },
    /**
     * 获取特定类型的节目列表
     */
    async getProgrammeListIsVisibleByNews({commit, state}) {
        try {
            if (!isLoading) {
                isLoading = true;
                let searchFields = Object.assign({}, state.searchFields, {
                    programmeCategoryIdList: state.global.categoryList.filter((item) => item.signCode === 'NEWS').map((item) => item.id)
                });
                let params = Object.assign({}, searchFields, {
                        pageSize: state.pagination.pageSize,
                        pageNum: state.pagination.pageNum - 1,
                        visible: true
                    });
                let res = await service.getProgrammeList(params);
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeList', {list});
                    commit('setProgrammePagination', {pageSize, pageNum: pageNum + 1, total});
                }
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
        }
    },
    /**
     * 获取已经上架的节目列表
     */
    async getProgrammeListIsVisible({commit, state}, applicableClientList) {
        try {
            if (!isLoading) {
                isLoading = true;
                let params = {};
                if (applicableClientList) {
                    params = Object.assign({}, state.searchFields, {
                        pageSize: state.pagination.pageSize,
                        pageNum: state.pagination.pageNum - 1,
                        applicableClientList,
                        visible: true
                    });
                } else {
                    params = Object.assign({}, state.searchFields, {
                        pageSize: state.pagination.pageSize,
                        pageNum: state.pagination.pageNum - 1,
                        visible: true
                    });
                }
                console.log(params);
                let res = await service.getProgrammeList(params);
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setProgrammeList', {list});
                    commit('setProgrammePagination', {pageSize, pageNum: pageNum + 1, total});
                }
                isLoading = false;
                return res;
            }
        } catch (err) {
            isLoading = false;
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
        } catch (err) {}
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
            if (res[1] && res[1].code === 0) {
                commit('updateGlobal', {key: 'categoryList', value: res[1].data});
            }
            if (res[0] && res[0].code === 0) {
                commit('setProgramme', {programme: serializeProgrammData(res[0].data, state)});
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
            return res;
        } catch (err) {}
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
    //  创建节目的时候保存视频
    async createMultProgrammeVideo({state}, programme) {
        try {
            let {list} = state.video;
            let videoList = filterProgrammeVideoList(list, programme);
            let res = await service.createMultProgrammeVideo(videoList);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //  编辑节目的时候保存视频
    async editMultProgrammeVideo({state}) {
        try {
            let {list} = state.video;
            let {programme} = state;
            let videoList = filterProgrammeVideoList(list, programme);
            let res = await service.createMultProgrammeVideo(videoList);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async editEmptyProgrammeVideo({state}, id) {
        try {
            let res = await service.editEmptyProgrammeVideo(id);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async getProgrammeVideoById({commit, state}, id) {
        try {
            let res = await service.getProgrammeVideoInfo({id});
            if (res && res.code === 0) {
                commit('setCurrentVideo', {currentVideo: res.data});
                if (res.data.type === 'FEATURE') {
                    commit('setCacheSort', {sort: res.data.sort});
                }
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
            return res;
        } catch (err) {}
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
    },
    //  节目批量上下架
    async upLowerFrameProgramme({commit, state}, {idList, visible}) {
        try {
            let res = await service.upLowerFrameProgramme(idList, visible);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //   节目批量删除
    async batchDeleteProgrammes({commit, state}, idList) {
        try {
            let res = await service.batchDeleteProgrammes(idList);
            return res;
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
