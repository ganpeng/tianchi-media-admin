import _ from 'lodash';
import store from 'store';
import service from '../../../service';

// /** 节目专题*/
// PROGRAMME_SUBJECT,

// /** 人物专题*/
// FIGURE_SUBJECT,

// /** 推荐节目PROGRAMME */
// PROGRAMME,

// /** 节目列表页面 */
// PROGRAMME_LIST,

// /** 视频播放页面 */
// PROGRAMME_VIDEO,

// /** 链接类型 */
// LINK,

// /** 电影节目类别 */
// MOVIE_PROGRAMME_CATEGORY,
// /** 电影节目类型 */
// MOVIE_PROGRAMME_TYPE,

// /** 电视剧节目类别 */
// TV_DRAMA_PROGRAMME_CATEGORY,
// /** 电视剧节目类型 */
// TV_DRAMA_PROGRAMME_TYPE,

// /** 新闻节目类别 */
// NEWS_PROGRAMME_CATEGORY,
// /** 新闻节目类型 */
// NEWS_PROGRAMME_TYPE,

// /** 网视节目类别 */
// NETWORK_PROGRAMME_CATEGORY,
// /** 网视节目类型 */
// NETWORK_PROGRAMME_TYPE,

// /** 体育节目类别 */
// SPORTS_PROGRAMME_CATEGORY,
// /** 体育节目类型 */
// SPORTS_PROGRAMME_TYPE,

// /** 儿童节目类别 */
// CHILD_PROGRAMME_CATEGORY,
// /** 儿童节目类型 */
// CHILD_PROGRAMME_TYPE,

// /** 纪实节目类别 */
// RECORD_PROGRAMME_CATEGORY,
// /** 纪实节目类型 */
// RECORD_PROGRAMME_TYPE,

// /** 教育节目类别 */
// EDU_PROGRAMME_CATEGORY,
// /** 教育节目类型 */
// EDU_PROGRAMME_TYPE,

// /** 卫视综艺节目类别 */
// TV_SHOW_SATELLITE_PROGRAMME_CATEGORY,
// /** 卫视综艺节目类型 */
// TV_SHOW_SATELLITE_PROGRAMME_TYPE,

// /** 网络综艺节目类别 */
// TV_SHOW_NETWORK_PROGRAMME_CATEGORY,
// /** 网络综艺节目类型 */
// TV_SHOW_NETWORK_PROGRAMME_TYPE,

// /** 音乐节目类别 */
// MUSIC_PROGRAMME_CATEGORY,
// /** 音乐节目类型 */
// MUSIC_PROGRAMME_TYPE,

// /** 曲艺节目类别 */
// TUNE_ART_PROGRAMME_CATEGORY,
// /** 曲艺节目类型 */
// TUNE_ART_PROGRAMME_TYPE,

// /** 幽默节目类别 */
// HUMOROUS_PROGRAMME_CATEGORY,
// /** 幽默节目类型 */
// HUMOROUS_PROGRAMME_TYPE,

// /** 科普中国节目类别 */
// CHINA_SCIENCE_PROGRAMME_CATEGORY,
// /** 科普中国节目类型 */
// CHINA_SCIENCE_PROGRAMME_TYPE,

// /** 新时代党建节目类别 */
// COMMUNIST_PARTY_BUILD_PROGRAMME_CATEGORY,
// /** 新时代党建节目类型 */
// COMMUNIST_PARTY_BUILD_PROGRAMME_TYPE,

// /** 直播频道（色块） */
// CHANNEL,

// /** 频道组*/
//  CHANNEL_GROUP,

// /** 人物（人物） */
// FIGURE,

// /** 更多  */
// ALL,

/**
 * 根据每个色块的类型初始化每个色块的数据结构
 */
function initLayoutItemByLayoutItemType(layoutItemType) {
    return Object.assign({}, defaultLayoutItem, {layoutItemType});
}

const defaultLayoutItem = {
    desc: '',
    id: '',
    layoutItemType: '',
    programmeTemplate: null,
    name: '',
    params: '',
    coverImage: {},
    coverImageBackground: {},
    cornerMark: {
        leftTop: {},
        leftBottom: {},
        rightTop: {},
        rightBottom: {}
    }
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
    keyword: '', //  搜索的关键字
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const defaultProgrammeSubject = {
    keyword: '', //  搜索的关键字
    list: [],
    pagination: _.cloneDeep(defaultPagination)
};

const defaultState = {
    activeLayout: [],
    navbarList: [],
    //  每个栏目的布局
    layout: store.get('layoutStore') || {},
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
    getNavbarNameById(state) {
        return (id) => {
            let navbar = _.get(state.layout, `${id}.name`);
            return navbar;
        };
    },
    getNavbarSignCodeById(state) {
        return (id) => {
            return _.get(state.layout, `${id}.signCode`);
        };
    },
    getLayoutItemCornerMark(state) {
        return (navbarId, index, squareIndex) => {
            let obj = _.get(state.activeLayout, `${index}.layoutItemMultiList.${squareIndex}.cornerMark`);
            return !_.isEmpty(obj) ? obj : {};
        };
    },
    selectAll(state) {
        return (navbarId, index) => {
            let layoutTemplate = _.get(state.activeLayout, `${index}.layoutTemplate`);
            let layoutItemMultiList = _.get(state.activeLayout, `${index}.layoutItemMultiList`).filter((item) => item.layoutItemType !== 'ALL');
            let allFlag = false;
            if (layoutTemplate === 'LT_SN') {
                allFlag = !(layoutItemMultiList.length > 0 && _.every(layoutItemMultiList, (item) => _.get(item, 'coverImage.uri')));
            } else if (layoutTemplate === 'LT_3_3' || layoutTemplate === 'FS_6' || layoutTemplate === 'FS_3') {
                allFlag = !_.every(layoutItemMultiList, (item) => _.get(item, 'coverImage.uri'));
            } else {
                allFlag = _.some(layoutItemMultiList, (item) => {
                    if (item.layoutItemType === 'LINK' || /_PROGRAMME_CATEGORY$/.test(item.layoutItemType)) {
                        return !_.get(item, 'coverImage.uri');
                    } else {
                        return !item.id || !_.get(item, 'coverImage.uri');
                    }
                });
            }
            return allFlag;
        };
    },
    layout() {
        return state.layout;
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
    },
    //  2.3.0 新的修改  ========================
    getActiveLayout(state) {
        return state.activeLayout;
    },
    getLayoutBlockItem(state) {
        return (layoutBlockId, squareIndex) => {
            let layoutBlock = state.activeLayout.find((item) => item.id === layoutBlockId);
            return layoutBlock ? _.get(layoutBlock, `layoutItemMultiList.${squareIndex}`) : {};
        };
    },
    getLayoutBlockItemByIndex(state) {
        return (index, squareIndex) => {
            return _.get(state.activeLayout, `${index}.layoutItemMultiList.${squareIndex}`) || {};
        };
    },
    getLayoutTemplateByNavbarId(state) {
        return (id) => {
            let layoutBlock = state.activeLayout.find((item) => item.id === id);
            return _.get(layoutBlock, `layoutTemplate`);
        };
    }
};

const mutations = {
    setNavbarList(state, payload) {
        let {navbarList} = payload;
        state.navbarList = navbarList;
    },
    //  layout相关的操作开始, 重新定义的增删改查方法开始
    setLayoutItemByNavbar(state, payload) {
        let {navbar, data, index} = payload;
        let obj = {
            changed: false,
            data,
            id: navbar.id,
            index,
            layoutTemplate: navbar.layoutTemplate,
            name: navbar.name,
            signCode: navbar.signCode
        };
        _.set(state.layout, `${navbar.id}`, _.cloneDeep(obj));
    },
    //  重新定义的增删改查方法结束
    updateLayout(state) {
        state.layout = store.get('layoutStore');
    },
    //  layout相关的操作结束
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
    //  2.3.0 新的修改  ========================
    setActiveLayout(state, payload) {
        console.log('setActiveLayout');
        console.log(payload);
        let {layout} = payload;
        state.activeLayout = layout;
    },
    updateLayoutBlockById(state, payload) {
        console.log('updateLayoutBlockById');
        console.log(payload);
        let {layoutBlockItem, layoutBlockId, squareIndex} = payload;
        state.activeLayout = state.activeLayout.map((item) => {
            if (item.id === layoutBlockId) {
                item.layoutItemMultiList = item.layoutItemMultiList.map((_layoutBlockItem, index) => {
                    if (index === squareIndex) {
                        return layoutBlockItem;
                    } else {
                        return _layoutBlockItem;
                    }
                });
            }
            return item;
        });
    },
    updateLayoutBlockByIndex(state, payload) {
        let {layoutBlockItem, index, squareIndex} = payload;
        state.activeLayout = state.activeLayout.map((item, _index) => {
            if (_index === index) {
                item.layoutItemMultiList = item.layoutItemMultiList.map((_layoutBlockItem, __index) => {
                    if (__index === squareIndex) {
                        return layoutBlockItem;
                    } else {
                        return _layoutBlockItem;
                    }
                });
            }
            return item;
        });
    },
    updateLayoutBlockDataById(state, payload) {
        let {key, value, layoutBlockId} = payload;
        state.activeLayout = state.activeLayout.map((item) => {
            if (item.id === layoutBlockId) {
                item[key] = value;
            }
            return item;
        });
    },
    updateLayoutBlockDataByIndex(state, payload) {
        let {key, value, index} = payload;
        state.activeLayout = state.activeLayout.map((item, _index) => {
            if (index === _index) {
                item[key] = value;
            }
            return item;
        });
    },
    addLayoutBlockItemById(state, payload) {
        let {layoutBlockItem, layoutBlockId} = payload;
        state.activeLayout = state.activeLayout.map((item) => {
            if (item.id === layoutBlockId) {
                item.layoutItemMultiList.push(layoutBlockItem);
            }
            return item;
        });
    },
    insertLayoutBlockByIndex(state, payload) {
        console.log('insertLayoutBlockByIndex');
        console.log(state);
        console.log(payload);
        let {index, layoutTemplate, renderType, navbarId, layoutItemMultiList} = payload;
        let layoutBlockDefault = {
            layoutTemplate: '',
            subjectId: '',
            iconImage: {},
            title: ''
        };
        let navbar = state.navbarList.find((navbar) => navbar.id === navbarId);
        let layoutBlock = Object.assign({}, layoutBlockDefault, {
            layoutTemplate,
            navBarId: navbarId,
            navBarName: _.get(navbar, 'name'),
            renderType,
            layoutItemMultiList: layoutItemMultiList || []
        });

        state.activeLayout.splice(index, 0, layoutBlock);
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
    //  获取人物专题列表
    async getPersonSubjectList({commit, state}) {
        try {
            let {keyword, pagination: {pageSize, pageNum}} = state.personSubject;
            let params = Object.assign({}, {keyword, pageSize, pageNum: pageNum - 1, visible: true});
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
            let {keyword, pagination: {pageSize, pageNum}} = state.programmeSubject;
            let params = Object.assign({}, {keyword, pageSize, pageNum: pageNum - 1, visible: true});
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
    },
    //  获取右上角的标签列表
    async getCustomMarkList({commit, state}) {
        try {
            let res = await service.getCustomMarkList();
            return res;
        } catch (err) {
            console.log(err);
        }
    },
    //  2.3.0 新的修改  ========================
    async getLayoutByNavbarId({commit, state}, id) {
        try {
            let res = await service.getPageLayoutByNavbarId(id);
            console.log('res');
            console.log(res);
            if (res && res.code === 0) {
                // 防止当前页面刷新导致数据请求为空，再次请求
                let res1 = await service.getNavbarList();
                if (res1 && res1.code === 0) {
                    console.log(state.navbarList);
                    let navbarList = res1.data;
                    console.log('navbarList');
                    console.log(navbarList);
                    let picRemark = '';
                    navbarList.map(item => {
                        if (item.id === res.data[0].navBarId) {
                            picRemark = item.picRemark;
                            console.log('picRemark');
                            console.log(picRemark);
                        }
                    });
                    res.data.map(item => {
                        item.navBarName = item.navBarName || picRemark;
                    });
                    console.log(res.data);
                    // 拿到当前navBar的picRemark
                    commit('setActiveLayout', {layout: res.data});
                }
            }
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
