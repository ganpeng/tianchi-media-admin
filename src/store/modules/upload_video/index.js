const state = {
    xhr: null,
    files: [],
    count: 0,
    isUploading: false,
    clearFlag: false,
    min: false
};

const getters = {
    uploadState(state) {
        return state;
    }
};

const mutations = {
    updateUploadState(state, payload) {
        let {key, value} = payload;
        state[key] = value;
    }
};

const actions = { };

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
