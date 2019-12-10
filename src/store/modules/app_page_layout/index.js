import _ from 'lodash';
import store from 'store';
import service from '../../../service';

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

const defaultPagination = {
    pageNum: 1,
    pageSize: 10,
    total: 0
};

const defaultState = {
    activeLayout: [],
    navbarList: [],
    //  每个栏目的布局
    layout: store.get('layoutStore') || {}
};

const state = _.cloneDeep(defaultState);

const getters = {
    navbarList(state) {
        return state.navbarList;
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
    //  2.3.0 新的修改  ========================
    setActiveLayout(state, payload) {
        let {layout} = payload;
        state.activeLayout = layout;
    },
    updateLayoutBlockById(state, payload) {
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
    async getAppNavbarList({commit, state}) {
        try {
            let res = await service.getAppNavbarList();
            if (res && res.code === 0) {
                commit('setNavbarList', {navbarList: res.data});
            }
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
            if (res && res.code === 0) {
                commit('setActiveLayout', {layout: res.data});
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
