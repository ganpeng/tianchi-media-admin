import _ from 'lodash';
import service from '../../../service';

const defaultState = {
    navbarList: [],
    pageLayout: []
};

const state = _.cloneDeep(defaultState);

const getters = {
    navbarList(state) {
        return state.navbarList;
    },
    pageLayout(state) {
        return state.pageLayout;
    }
};

const mutations = {
    setNavbarList(state, payload) {
        let {navbarList} = payload;
        state.navbarList = navbarList;
    },
    setPageLayout(state, payload) {
        let {pageLayout} = payload;
        state.pageLayout = pageLayout;
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
                commit('setPageLayout', {pageLayout: res.data});
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
