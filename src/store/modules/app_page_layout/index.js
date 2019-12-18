import _ from 'lodash';
import store from 'store';
import service from '../../../service';

let defaultLayoutData = {
    iconImage: {},
    layoutItemMultiList: [],
    layoutTemplate: 'M_FS_1',
    navBarId: '',
    navBarName: '',
    renderType: 'SHUFFLE',
    subjectId: '',
    title: ''
};

const defaultLayoutItem = {
    desc: '',
    id: '',
    layoutItemType: 'PROGRAMME',
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

const defaultState = {
    activeLayout: [],
    navbarList: [],
    //  每个栏目的布局
    layout: store.get('appLayoutStore') || {}
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
    getLayoutItemDetail(state) {
        return (navbarId, index, squareIndex) => {
            let obj = _.get(state.activeLayout, `${index}.layoutItemMultiList.${squareIndex}`);
            return !_.isEmpty(obj) ? obj : {};
        };
    },
    selectAll(state) {
        return (navbarId, index) => {
            let layoutItemMultiList = _.get(state.activeLayout, `${index}.layoutItemMultiList`);
            let allFlag = false;
            allFlag = _.some(layoutItemMultiList, (item) => {
                    return !item.id || !_.get(item, 'coverImage.uri');
            });
            return allFlag;
        };
    },
    layout() {
        return state.layout;
    },
    //  2.3.0 新的修改  ========================
    activeLayout(state) {
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
    async getAppLayoutByNavbarId({commit, state}, id) {
        try {
            let res = await service.getAppLayoutByNavbarId(id);
            if (res && res.code === 0) {
                if (res.data.length === 0) {
                    let navbar = state.navbarList.find((item) => item.id === id);
                    if (navbar) {
                        let activeLayout = [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                            layoutItemMultiList: _.times(3, () => _.cloneDeep(defaultLayoutItem)),
                            navBarId: navbar.id,
                            navBarName: navbar.name
                        })];
                        commit('setActiveLayout', {layout: activeLayout});
                    }
                } else {
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
