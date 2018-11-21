import _ from 'lodash';
import store from 'store';
import service from '../../../service';

//  推荐专题（背景渲染） SUBJECT,
// 推荐节目PROGRAMME PROGRAMME,
//  节目列表页面 PROGRAMME_LIST,
//  视频播放页面 PROGRAMME_VIDEO,
//  链接类型 LINK,
//  电影节目类别 MOVIE_PROGRAMME_CATEGORY,
//  电影节目类型 MOVIE_PROGRAMME_TYPE,
//  电视剧节目类别 TV_DRAMA_PROGRAMME_CATEGORY,
//  电视剧节目类型 TV_DRAMA_PROGRAMME_TYPE,
//  新闻节目类别 NEWS_PROGRAMME_CATEGORY,
//  新闻节目类型 NEWS_PROGRAMME_TYPE,
//  网视节目类别 NETWORK_PROGRAMME_CATEGORY,
//  网视节目类型 NETWORK_PROGRAMME_TYPE,
//  体育节目类别 SPORTS_PROGRAMME_CATEGORY,
//  体育节目类型 SPORTS_PROGRAMME_TYPE,
//  儿童节目类别 CHILD_PROGRAMME_CATEGORY,
//  儿童节目类型 CHILD_PROGRAMME_TYPE,
//  纪实节目类别 RECORD_PROGRAMME_CATEGORY,
//  纪实节目类型 RECORD_PROGRAMME_TYPE,
//  教育节目类别 EDU_PROGRAMME_CATEGORY,
//  教育节目类型 EDU_PROGRAMME_TYPE,
//  卫视综艺节目类别 TV_SHOW_SATELLITE_PROGRAMME_CATEGORY,
//  卫视综艺节目类型 TV_SHOW_SATELLITE_PROGRAMME_TYPE,
//  网络综艺节目类别 TV_SHOW_NETWORK_PROGRAMME_CATEGORY,
//  网络综艺节目类型 TV_SHOW_NETWORK_PROGRAMME_TYPE,
//  音乐节目类别 MUSIC_PROGRAMME_CATEGORY,
//  音乐节目类型 MUSIC_PROGRAMME_TYPE,
//  曲艺节目类别 TUNE_ART_PROGRAMME_CATEGORY,
//  曲艺节目类型 TUNE_ART_PROGRAMME_TYPE,
//  幽默节目类别 HUMOROUS_PROGRAMME_CATEGORY,
//  幽默节目类型 HUMOROUS_PROGRAMME_TYPE,
//  科普中国节目类别 CHINA_SCIENCE_PROGRAMME_CATEGORY,
//  科普中国节目类型 CHINA_SCIENCE_PROGRAMME_TYPE,
//  新时代党建节目类别 COMMUNIST_PARTY_BUILD_PROGRAMME_CATEGORY,
//  新时代党建节目类型 COMMUNIST_PARTY_BUILD_PROGRAMME_TYPE,
//  直播频道（色块） CHANNEL,
//  频道组 CHANNEL_GROUP,
//  人物（人物） FIGURE,
//  更多  ALL,

/**
 * 根据每个色块的类型初始化每个色块的数据结构
 */
function initLayoutItemByLayoutItemType(layoutItemType) {
    return Object.assign({}, defaultLayoutItem, {layoutItemType});
}

const defaultLayoutItem = {
    cornerMark: {},
    coverImage: {
        height: '',
        name: '',
        uri: '',
        width: ''
    },
    coverImageBackground: {
        height: '',
        name: '',
        uri: '',
        width: ''
    },
    desc: '',
    layoutItemType: '',
    id: '',
    name: '',
    params: ''
};

const defaultPersonModule = {
    name: '',
    icon: {},
    personList: []
};

const defaultPersonSubjectModule = {
    layoutTemplate: '',
    navBarId: '',
    navBarName: '',
    renderType: '',
    subjectId: '',
    title: '',
    icon: {},
    layoutItemMultiList: _.times(6, () => _.cloneDeep(initLayoutItemByLayoutItemType('SUBJECT')))
};

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const defaultPersonSubject = {
    name: '', //  搜索的关键字
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const defaultProgrammeSubject = {
    name: '', //  搜索的关键字
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const defaultState = {
    navbarList: [],
    //  每个栏目的布局
    pageLayoutList: [],
    layout: store.get('layoutStore'),
    personModule: _.cloneDeep(defaultPersonModule),
    personSubjectModule: _.cloneDeep(defaultPersonSubjectModule),
    //  获取列表的相应接口
    personSubject: _.cloneDeep(defaultPersonSubject),
    programmeSubject: _.cloneDeep(defaultProgrammeSubject)
};

const state = _.cloneDeep(defaultState);

const getters = {
    navbarList(state) {
        return state.navbarList;
    },
    getLayoutTemplateByNavbarId(state) {
        return (id) => {
            return state.layout[id].layoutTemplate;
        };
    },
    getLayoutListByNavbarId(state) {
        return (id) => {
            return state.layout[id].data;
        };
    },
    layout() {
        return state.layout;
    },
    pageLayoutList(state) {
        return state.pageLayoutList;
    },
    personModule(state) {
        return state.personModule;
    },
    personSubjectModule(state) {
        return state.personSubjectModule;
    },
    //  人物专题列表
    personSubject(state) {
        return state.personSubject;
    },
    //  节目专题列表
    programmeSubject(state) {
        return state.programmeSubject;
    }
};

const mutations = {
    setNavbarList(state, payload) {
        let {navbarList} = payload;
        state.navbarList = navbarList;
    },
    setPageLayoutList(state, payload) {
        let {pageLayoutList} = payload;
        state.pageLayoutList = pageLayoutList;
    },

    //  layout相关的操作开始
    updateLayoutItemByIndex(state, payload) {
        let {index, navbarId, squareIndex, key, value} = payload;
        _.set(state.layout, `${navbarId}.data.${index}.layoutItemMultiList.${squareIndex}[${key}]`, value);
    },
    setLayoutItemByIndex(state, payload) {
        let {index, navbarId, squareIndex, layoutItem} = payload;
        _.set(state.layout, `${navbarId}.data.${index}.layoutItemMultiList.${squareIndex}`, layoutItem);
    },
    updateLayout(state) {
        state.layout = store.get('layoutStore');
    },
    saveLayoutToStore(state) {
        store.set('layoutStore', state.layout);
    },
    //  layout相关的操作结束
    //  人物模块相关操作
    resetPersonModule(state) {
        state.personModule = _.cloneDeep(defaultPersonModule);
    },
    updatePersonModule(state, payload) {
        let {key, value} = payload;
        state.personModule[key] = value;
    },
    addPersonToPersonlistOfPersonModule(state, payload) {
        let {person} = payload;
        state.personModule.personList.push(person);
        state.personModule.personList = _.uniqBy(state.personModule.personList, 'id');
    },
    deletePersonFromPersonListOfPersonModule(state, payload) {
        let {id} = payload;
        state.personModule.personList = state.personModule.personList.filter((person) => person.id !== id);
    },
    //  人物专题的相关操作
    resetPersonSubject(state) {
        state.personSubject = _.cloneDeep(defaultPersonSubject);
    },
    updatePersonSubject(state, payload) {
        let {key, value} = payload;
        state.personSubject[key] = value;
    },
    setPersonSubjectPagination(state, payload) {
        state.personSubject.pagination.pageSize = payload.pageSize;
        state.personSubject.pagination.pageNum = payload.pageNum;
        state.personSubject.pagination.total = payload.total;
    },
    updatePersonSubjectPagination(state, payload) {
        let {key, value} = payload;
        state.personSubject.pagination[key] = value;
    },
    addImageToPersonSubjectListById(state, payload) {
        let {id, image} = payload;
        state.personSubject.list = state.personSubject.list.map((personSubject) => {
            if (personSubject.id === id) {
                personSubject.posterImageList = personSubject.posterImageList.filter((item) => {
                    return parseInt(item.width) !== 260 && parseInt(item.height) !== 600;
                });
                personSubject.posterImageList.push(image);
                personSubject.posterImageList = _.uniqBy(personSubject.posterImageList, 'id');
            }
            return personSubject;
        });
    },
    //  节目专题的相关操作
    resetProgrammeSubject(state) {
        state.programmeSubject = _.cloneDeep(defaultProgrammeSubject);
    },
    updateProgrammeSubject(state, payload) {
        let {key, value} = payload;
        state.programmeSubject[key] = value;
    },
    setProgrammeSubjectPagination(state, payload) {
        state.programmeSubject.pagination.pageSize = payload.pageSize;
        state.programmeSubject.pagination.pageNum = payload.pageNum;
        state.programmeSubject.pagination.total = payload.total;
    },
    updateProgrammeSubjectPagination(state, payload) {
        let {key, value} = payload;
        state.programmeSubject.pagination[key] = value;
    },
    addImageToProgrammeSubjectListById(state, payload) {
        let {id, image} = payload;
        state.programmeSubject.list = state.programmeSubject.list.map((programmeSubject) => {
            if (programmeSubject.id === id) {
                programmeSubject.posterImageList = programmeSubject.posterImageList.filter((item) => {
                    return parseInt(item.width) !== 260 && parseInt(item.height) !== 600;
                });
                programmeSubject.posterImageList.push(image);
                programmeSubject.posterImageList = _.uniqBy(programmeSubject.posterImageList, 'id');
            }
            return programmeSubject;
        });
    },
    //  人物专题模块相关操作
    resetPersonSubjectModule(state) {
        state.personSubjectModule = _.cloneDeep(defaultPersonSubjectModule);
    },
    updatePersonSubjectModule(state, payload) {
        let {key, value} = payload;
        state.personSubjectModule[key] = value;
    },
    updateLayoutItemMultiListByIndex(state, payload) {
        let {index, id, image} = payload;
        state.personSubjectModule.layoutItemMultiList[index]['id'] = id;
        state.personSubjectModule.layoutItemMultiList[index]['coverImage'] = image;
    }
};

const actions = {
    async getNavbarList({commit, state}) {
        try {
            let res = await service.getNavbarList();
            if (res && res.code === 0) {
                commit('setNavbarList', {navbarList: res.data});
            }
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async getPageLayoutByNavbarId({commit, state}, id) {
        try {
            let res = await service.getPageLayoutByNavbarId(id);
            if (res && res.code === 0) {
                commit('setPageLayoutList', {pageLayoutList: res.data});
            }
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async savePageLayoutByNavbarId({commit, state}, id) {
        try {
            let {data} = state.layout[id];
            let res = await service.savePageLayoutByNavbarId(id, data);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //  获取人物专题列表
    async getPersonSubjectList({commit, state}) {
        try {
            let {name, pagination: {pageSize, pageNum}} = state.personSubject;
            let params = Object.assign({}, { name, pageSize, pageNum: pageNum - 1 });
            let res = await service.getPersonSubjectList(params);
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('updatePersonSubject', {key: 'list', value: list});
                commit('setPersonSubjectPagination', {pageSize, pageNum: pageNum + 1, total});
            }
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    async getProgrammeSubjectList({commit, state}) {
        try {
            let {name, pagination: {pageSize, pageNum}} = state.programmeSubject;
            let params = Object.assign({}, { name, pageSize, pageNum: pageNum - 1 });
            let res = await service.getProgrammeSubjectList(params);
            if (res && res.code === 0) {
                let {pageNum, pageSize, total, list} = res.data;
                commit('updateProgrammeSubject', {key: 'list', value: list});
                commit('setProgrammeSubjectPagination', {pageSize, pageNum: pageNum + 1, total});
            }
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //  根据人物专题的id更新人物专题
    async updateSubjectById({commit, state}, id) {
        try {
            let subject = state.personSubject.list.find((personSubject) => personSubject.id === id);
            let res = await service.updateSubjectById(id, subject);
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //  根据节目专题的ID更新节目专题
    async updateProgrammeSubjectById({commit, state}, id) {
        try {
            let subject = state.programmeSubject.list.find((programmeSubject) => programmeSubject.id === id);
            let res = await service.updateSubjectById(id, subject);
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
