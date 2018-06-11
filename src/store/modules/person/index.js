import service from '../../../service';
import router from '../../../router';
import {checkImageExist} from '@/util/formValidate';

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
    weight: '',
    avatarImage: {}
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
        return Array.from(state.list).sort((prev, curr) => curr.updatedAt - prev.updatedAt);
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
    },
    posterImageList(state) {
        return state.currentPerson && state.currentPerson.posterImageList;
    },
    avatarImage(state) {
        return state.currentPerson && state.currentPerson.avatarImage;
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
        let { posterImageList, avatarImage } = state.currentPerson;
        if (!Array.isArray(posterImageList)) {
            state.currentPerson.posterImageList = [];
        }
        state.currentPerson.posterImageList = state.currentPerson.posterImageList.map((item) => {
            if (item.id === (avatarImage ? avatarImage.id : '')) {
                item.checked = true;
            }
            return item;
        });
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
        state.currentPerson.posterImageList = [];
    },
    addPosterImage(state, payload) {
        // Todo 后续要删除的代码
        payload.posterImage.uri = payload.posterImage.uri.replace('local', 'test');
        if (!state.currentPerson.posterImageList) {
            state.currentPerson.posterImageList = [];
        }
        if (!checkImageExist(state.currentPerson.posterImageList, payload.posterImage)) {
            state.currentPerson.posterImageList.push(payload.posterImage);
        }
    },
    deletePosterImage(state, payload) {
        let {posterImageList} = state.currentPerson;
        state.currentPerson.posterImageList = posterImageList.filter((image) => {
            return image.id !== payload.id;
        });
    },
    checkPosterImage(state, payload) {
        state.currentPerson.posterImageList = state.currentPerson.posterImageList.map((img) => {
            if (img.id === payload.id) {
                img.checked = true;
                state.currentPerson.avatarImage = img;
            } else {
                delete img.checked;
            }

            return img;
        });
    }
};

const actions = {
    getPersonList({commit, state}, {isProgramme, name}) {
        let searchName = !name ? state.searchStr : name;
        return service.getPersonList({ pageNum: state.pageNum - 1, pageSize: state.pageSize, name: searchName, area: state.area })
            .then((res) => {
                if (res && res.code === 0) {
                    let {pageNum, pageSize, total, list} = res.data;
                    if (!isProgramme) {
                        commit('setPersonList', {list});
                        commit('setPagination', {pageSize, pageNum: pageNum + 1, total});
                    } else {
                        return res;
                    }
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
        let person = JSON.parse(JSON.stringify(state.currentPerson));
        delete person.createdAt;
        service.createPerson(person)
            .then((res) => {
                if (res && res.code === 0) {
                    return res;
                }
            });
    },
    updatePerson({commit, state}) {
        let person = JSON.parse(JSON.stringify(state.currentPerson));
        delete person.createdAt;
        service.updatePersonInfo({id: person.id, person: person})
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
