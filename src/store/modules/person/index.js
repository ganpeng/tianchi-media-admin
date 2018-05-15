import service from '../../../service';
import router from '../../../router';

const defaultPerson = {
    area: '',
    birthday: '',
    description: '',
    height: '',
    mainRole: '',
    name: '',
    namePinYin: '',
    namePy: '',
    posterImageList: [],
    programmeList: [],
    updatedAt: '',
    weight: ''
};

const state = {
    searchStr: '',
    area: '',
    currentPerson: {},
    list: [],
    pageNum: 1,
    pageSize: 5,
    total: 0
};

const getters = {
    list(state) {
        return state.list;
    },
    pagination(state) {
        return {
            pageSize: state.pageSize,
            total: state.total,
            pageNum: state.pageNum
        };
    },
    area(state) {
        return state.area;
    },
    searchStr(state) {
        return state.searchStr;
    },
    currentPerson(state) {
        return state.currentPerson;
    }
};

const mutations = {
    setPersonList(state, payload) {
        state.list = payload.list;
    },
    setPagination(state, payload) {
        if (payload.pageSize) {
            state.pageSize = payload.pageSize;
        }
        if (payload.pageNum) {
            state.pageNum = payload.pageNum;
        }
        if (payload.total) {
            state.total = payload.total;
        }
    },
    setCurrentPerson(state, payload) {
        state.currentPerson = payload.currentPerson;
        let { posterImageList } = state.currentPerson;
        if (!Array.isArray(posterImageList)) {
            state.currentPerson.posterImageList = [];
        }
    },
    updateCurrentPerson(state, payload) {
        state.currentPerson = Object.assign({}, state.currentPerson, payload);
    },
    setSearchStr(state, payload) {
        state.searchStr = payload.searchStr;
    },
    setArea(state, payload) {
        state.area = payload.area;
    },
    resetPerson(state) {
        state.currentPerson = defaultPerson;
    },
    addPosterImage(state, payload) {
        state.currentPerson.posterImageList.push(payload.posterImage);
    }
};

const actions = {
    getPersonList({commit, state}) {
        service.getPersonList({ pageNum: state.pageNum, pageSize: state.pageSize, name: state.searchStr, area: state.area })
            .then((res) => {
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    commit('setPersonList', {list});
                    commit('setPagination', {pageSize, pageNum, total});
                }
            });
    },

    getPerson({commit, state}, id) {
        service.getPersonInfo({id})
            .then((res) => {
                if (res && res.code === 0) {
                    commit('setCurrentPerson', {currentPerson: res.data});
                }
            });
    },

    createPerson({commit, state}) {
        service.createPerson(state.currentPerson)
            .then((res) => {
                if (res && res.code === 0) {
                    router.push({ name: 'PersonList' });
                }
            });
    },
    updatePerson({commit, state}) {
        let {currentPerson} = state;
        service.updatePersonInfo({id: currentPerson.id, person: currentPerson})
            .then((res) => {
                if (res && res.code === 0) {
                    router.push({ name: 'PersonList' });
                }
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
