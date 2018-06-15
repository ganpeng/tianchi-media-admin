/**
 * @fileOverview Define store module of layout
 */

const state = {
    // 当前状态与线上相比是否更改
    navBarList: []
};

const getters = {
    /**
     * get the current state of this module
     * @param state
     * @return {JSON}
     */
    getCurrentState: state => {
        return state;
    }
};

const mutations = {
    /**
     * 设置某个导航栏的整个布局
     * @param state
     * @param signCode The signCode of a single navBar
     * @param singleNavBarLayout An json of a single navBar layout
     */
    setSingleNavBarLayout(state, signCode, singleNavBarLayout) {
        state[signCode] = singleNavBarLayout;
    }
};

const actions = {
    /**
     * 设置单个导航栏的整个布局
     * @param commit
     * @param signCode The signCode of a single navBar layout
     * @param singleNavBarLayout An json of a single navBar layout
     */
    setSingleNavBarLayout({commit}, signCode, singleNavBarLayout) {
        return new Promise((resolve) => {
            commit('setSingleNavBarLayout', singleNavBarLayout);
            resolve('success');
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
