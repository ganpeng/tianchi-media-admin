/**
 * @fileOverview Define store module of layout
 */

import wsCache from '@/util/webStorage';

const state = {
    navBarList: []
};

const getters = {
    /**
     * get the current state of this module
     * @param state
     * @return {JSON} The info of navBar, such as
     * {id:'5b231d5ac1c275b2d8029ba5',
     *  name:'娱乐',
     *  signCode:'ENTERTAINMENT',
     *  type:'CUSTOM',
     *  uri:'empty',
     *  visible:true,
     *  sort:null,
     *  releaseStatus:'RELEASED',
     *  status:'NORMAL'}
     */
    getNavBarInfo: (state) => ({navBarId}) => {
        let info = '';
        state.navBarList.map(navBarInfo => {
            if (navBarInfo.id === navBarId.toString()) {
                info = navBarInfo;
            }
        });
        return info;
    },
    /**
     * get the current state of this module
     * @param state
     * @return {JSON}
     */
    getCurrentState: state => {
        return state;
    },
    /**
     * get the current layout of a single navBar
     * @param state
     * @return {JSON}
     */
    getCurrentLayout: (state) => ({navBarSignCode, navBarId, navBarName}) => {
        if (state[navBarSignCode]) {
            return state[navBarSignCode];
        } else {
            return {
                modified: false,
                navBarId: navBarId,
                navBarName: navBarName,
                liveChannelList: [],
                layoutBlockList: []
            };
        }
    },
    /**
     * get the current id list of recommend model subject
     * @param state
     * @return {Array}
     */
    getRecommendModelSubjectIdList: (state) => ({navBarSignCode}) => {
        let subjectIdList = [];
        if (state[navBarSignCode] && state[navBarSignCode].layoutBlockList) {
            for (let i = 0; i < state[navBarSignCode].layoutBlockList.length; i++) {
                if (state[navBarSignCode].layoutBlockList[i].subjectId) {
                    subjectIdList.push(state[navBarSignCode].layoutBlockList[i].subjectId);
                }
            }
        }
        return subjectIdList;
    },
    /**
     * get the current layout of a single navBar
     * @param state
     * @return {JSON}
     */
    getCurrentLayoutStatus: (state) => ({navBarSignCode}) => {
        return state[navBarSignCode] && state[navBarSignCode].modified;
    },
    /**
     * 判断某个导航栏的直播频道布局本地是否存在
     * @param state
     * @param navBarSignCode The signCode of a single navBar
     */
    getLiveChannelStatus: (state) => ({navBarSignCode}) => {
        return state[navBarSignCode] && state[navBarSignCode].liveChannelList && state[navBarSignCode].liveChannelList.length > 0;
    },
    /**
     * 获取直播频道的列表
     * @param state
     * @param navBarSignCode The signCode of a single navBar
     */
    getLiveChannelList: (state) => ({navBarSignCode}) => {
        if (state[navBarSignCode] && state[navBarSignCode].liveChannelList && state[navBarSignCode].liveChannelList.length > 0) {
            return state[navBarSignCode].liveChannelList;
        }
        return [];
    },
    /**
     * 获取单个推荐位的节目或者专题数据
     * @param state
     * @param navBarSignCode The signCode of a single navBar
     * @param model The model index of a recommend item
     * @param row The row index of a recommend item
     * @param index The index of a recommend item
     */
    getRecommendItemInfo: (state) => ({navBarSignCode, model, row, index}) => {
        if (state[navBarSignCode] && state[navBarSignCode].layoutBlockList && state[navBarSignCode].layoutBlockList[model] && state[navBarSignCode].layoutBlockList[model].layoutItemMultiList[row] && state[navBarSignCode].layoutBlockList[model].layoutItemMultiList[row][index]) {
            return state[navBarSignCode].layoutBlockList[model].layoutItemMultiList[row][index];
        }
        return {};
    },
    /**
     * 获取模块推荐位的信息
     * @param state
     * @param navBarSignCode The signCode of a single navBar
     * @param model The model index of a recommend item
     */
    getRecommendModelInfo: (state) => ({navBarSignCode, model}) => {
        if (state[navBarSignCode] && state[navBarSignCode].layoutBlockList && state[navBarSignCode].layoutBlockList[model]) {
            return state[navBarSignCode].layoutBlockList[model];
        }
        return {};
    }
};

const mutations = {
    /**
     * 设置整个state对象
     * @param state
     * @param stateData The whole data of state
     */
    setState(state, stateData) {
        for (let prop in stateData) {
            state[prop] = stateData[prop];
        }
        mutations.setCache();
    },
    /**
     * 设置导航栏列表
     * @param state
     * @param navBarList An array of navBars
     */
    setNavBarList(state, {navBarList}) {
        state.navBarList = navBarList;
        mutations.setCache();
    },
    /**
     * 设置某个导航栏的整个布局
     * @param state
     * @param navBarSignCode The signCode of a single navBar
     * @param singleNavBarLayout An json of a single navBar layout
     */
    setSingleNavBarLayout(state, {navBarSignCode, singleNavBarLayout}) {
        state[navBarSignCode] = singleNavBarLayout;
        mutations.setCache();
    },
    /**
     * 设置某个导航栏的直播频道布局
     * @param state
     * @param navBarSignCode The signCode of a single navBar
     * @param navBarId The id of navBar
     * @param liveChannelList An array of live channels in the single navBar
     */
    setLiveChannel(state, {navBarSignCode, navBarId, navBarName, liveChannelList}) {
        if (state[navBarSignCode]) {
            state[navBarSignCode].liveChannelList = liveChannelList;
            state[navBarSignCode].modified = true;
        } else {
            state[navBarSignCode] = {
                modified: false,
                navBarId: navBarId,
                navBarName: navBarName,
                liveChannelList: liveChannelList,
                layoutBlockList: []
            };
        }
        mutations.setCache();
    },
    /**
     * 设置某个导航栏布局单个推荐位置的节目或者专题
     * @param state
     * @param model The index of layoutBlockList
     * @param model The index of layoutBlockList
     * @param row The row of layoutBlockList's two-dimensional array
     * @param index The index of the row
     * @param item An single subject or programme recommended
     */
    setSingleRecommendItem(state, {navBarId, navBarName, navBarSignCode, model, row, index, item}) {
        if (state[navBarSignCode]) {
            state[navBarSignCode].layoutBlockList[model].layoutItemMultiList[row][index] = item;
            state[navBarSignCode].modified = true;
        } else {
            state[navBarSignCode] = {
                modified: false,
                navBarId: navBarId,
                navBarName: navBarName,
                liveChannelList: [],
                layoutBlockList: []
            };
            state[navBarSignCode].layoutBlockList[model].layoutItemMultiList[row][index] = item;
        }
        mutations.setCache();
    },
    /**
     * 设置色块推荐节目二级分类或者直播频道
     * @param state
     * @param model The index of layoutBlockList
     * @param catalogueModel The catalogue model which is two-dimensional array
     */
    setCatalogue(state, {navBarId, navBarName, navBarSignCode, model, catalogueModel}) {
        if (state[navBarSignCode]) {
            state[navBarSignCode].layoutBlockList[model] = catalogueModel;
            state[navBarSignCode].modified = true;
        } else {
            state[navBarSignCode] = {
                modified: false,
                navBarId: navBarId,
                navBarName: navBarName,
                liveChannelList: [],
                layoutBlockList: []
            };
            state[navBarSignCode].layoutBlockList[model] = catalogueModel;
        }
        mutations.setCache();
    },
    /**
     * 设置模块推荐位的专题项
     * @param state
     * @param model The index of layoutBlockList
     * @param subjectModel The subject model which is two-dimensional array
     * @param operate The operate for subject model, such as 'edit' or 'add'
     */
    setSubjectLayoutItem(state, {navBarId, navBarName, navBarSignCode, model, subjectModel, operate}) {
        if (state[navBarSignCode]) {
            if (operate === 'edit') {
                state[navBarSignCode].layoutBlockList[model] = subjectModel;
            } else if (operate === 'add') {
                state[navBarSignCode].layoutBlockList.splice(model, 0, subjectModel);
            }
            state[navBarSignCode].modified = true;
        } else {
            state[navBarSignCode] = {
                modified: false,
                navBarId: navBarId,
                navBarName: navBarName,
                liveChannelList: [],
                layoutBlockList: []
            };
            state[navBarSignCode].layoutBlockList[model] = subjectModel;
        }
        mutations.setCache();
    },
    /**
     * 设置模块推荐位的专题项
     * @param state
     * @param model The index of layoutBlockList
     * @param subjectModel The subject model which is two-dimensional array
     */
    setLayoutStatus(state, {navBarId, navBarName, navBarSignCode, modified}) {
        if (state[navBarSignCode]) {
            state[navBarSignCode].modified = modified;
        } else {
            state[navBarSignCode] = {
                modified: modified,
                navBarId: navBarId,
                navBarName: navBarName,
                liveChannelList: [],
                layoutBlockList: []
            };
        }
        mutations.setCache();
    },
    /**
     * 设置模块推荐位的专题项
     * @param state
     * @param model The index of layoutBlockList
     */
    removeModel(state, {navBarSignCode, model}) {
        state[navBarSignCode].layoutBlockList.splice(model, 1);
        state[navBarSignCode].modified = true;
        mutations.setCache();
    },
    /**
     * 设置模块推荐位的专题项排序
     * @param state
     */
    sortModelList(state, {navBarId, navBarSignCode, modelSubjectIdList}) {
        let minModelIndex = 0;
        for (let i = 0; i < state[navBarSignCode].layoutBlockList.length; i++) {
            if (!state[navBarSignCode].layoutBlockList[i].subjectId) {
                minModelIndex = i;
            }
        }
        let sortedLayoutBlockList = [];
        // 添加非模块推荐位
        for (let i = 0; i < minModelIndex + 1; i++) {
            sortedLayoutBlockList.push(JSON.parse(JSON.stringify(state[navBarSignCode].layoutBlockList[i])));
        }
        // 添加模块推荐位
        for (let m = 0; m < modelSubjectIdList.length; m++) {
            for (let k = 0; k < state[navBarSignCode].layoutBlockList.length; k++) {
                if (modelSubjectIdList[m] === state[navBarSignCode].layoutBlockList[k].subjectId) {
                    sortedLayoutBlockList.push(JSON.parse(JSON.stringify(state[navBarSignCode].layoutBlockList[k])));
                }
            }
        }
        state[navBarSignCode].layoutBlockList = sortedLayoutBlockList;
        state[navBarSignCode].modified = true;
        mutations.setCache();
    },
    /**
     * 缓存整个state数据到localStorage中
     */
    setCache() {
        wsCache.localStorage.set('layout', state);
    }
};

const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
