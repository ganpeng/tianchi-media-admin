import _ from 'lodash';
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

const defaultState = {
    navbarList: [],
    //  每个栏目的布局
    pageLayoutList: [],
    personModule: _.cloneDeep(defaultPersonModule),
    personSubjectModule: _.cloneDeep(defaultPersonSubjectModule),
    //  获取列表的相应接口
    personSubject: _.cloneDeep(defaultPersonSubject)
};

const state = _.cloneDeep(defaultState);

const getters = {
    navbarList(state) {
        return state.navbarList;
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
    personSubject(state) {
        return state.personSubject;
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
    //  根据专题的id更新专题
    async updateSubjectById({commit, state}, id) {
        try {
            let subject = state.personSubject.list.find((personSubject) => personSubject.id === id);
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
