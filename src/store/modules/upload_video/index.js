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
    },
    resetState(state) {
        if (state.xhr) {
            state.xhr.abort();
            state.xhr = null;
        }
        state.files = [];
        state.count = 0;
        state.isUploading = false;
        state.clearFlag = false;
        state.min = false;
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
