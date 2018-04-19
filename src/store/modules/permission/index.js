// 用户权限信息,有可能与用户信息合并模块

const state = {
    list: []
};

const getters = {};

const mutations = {
    setList(state, data) {
        state.list = data;
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
