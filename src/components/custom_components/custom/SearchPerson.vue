<template>
    <div class="search-person-container">
        <ul v-show="personList.length > 0" id="person-list" class="person-list">
            <li v-for="(person, index) in personList" :key="index" :data-person="JSON.stringify(person)" class="person-item">
                <span class="person-name">{{person.name}}</span>
                <i class="delete-btn" @click="deletePerson(person.id)">X</i>
            </li>
        </ul>
        <div class="search-field">
            <input ref="searchPersonInput" type="text" @input="searchPersonHandler($event)">
            <ul v-if="searchResultList.length > 0" class="search-result-list">
                <li @click="cliceSearchResultItemHandler(person)" v-for="(person, index) in searchResultList" :key="index" class="search-result-item">
                    <span class="person-name">
                        {{person.name}}
                    </span>
                </li>
            </ul>
            <div v-if="emptySearchResultFlag" class="search-result-empty-text">
                您搜索的人物不存在
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import _ from 'lodash';
export default {
    name: 'SearchPerson',
    data() {
        return {
            emptySearchResultFlag: false,
            personList: [],
            searchResultList: []
        };
    },
    created() {
        this.initDragula();
    },
    methods: {
        ...mapActions({
            searchPerson: 'person/searchPerson'
        }),
        searchPersonHandler: _.debounce(function(e) {
            let searchStr = e.target.value;
            if (searchStr !== '') {
                this.searchPerson(searchStr)
                    .then((res) => {
                        if (res && res.code === 0) {
                            let {list} = res.data;
                            if (list.length > 0) {
                                this.searchResultList = this.excludeExistPerson(list);
                                this.emptySearchResultFlag = false;
                            } else {
                                this.emptySearchResultFlag = true;
                            }
                        }
                    });
            } else {
                this.emptySearchResultFlag = false;
                this.searchResultList = [];
            }
        }, 500),
        initDragula() {
            this.$nextTick(function () {
                let ele = document.querySelector('#person-list');
                this.$dragula([ele], {
                    direction: 'horizontal'
                });
            });
        },
        excludeExistPerson(list) {
            return list.filter((person) => {
                let index = this.personList.findIndex((_person) => {
                    return person.id === _person.id;
                });
                return index < 0;
            });
        },
        cliceSearchResultItemHandler(person) {
            this.personList.push(person);
            this.searchResultList = [];
            this.$refs.searchPersonInput.value = '';
            this.emptySearchResultFlag = false;
        },
        deletePerson(id) {
            this.personList = this.personList.filter((person) => person.id !== id);
        },
        getSortedPersonList() {
            let eles = document.querySelectorAll('#person-list .person-item');
            if (!eles) {
                return [];
            }
            let res = Array.from(eles).map((ele) => {
                let person = ele.getAttribute('data-person');
                return JSON.parse(person);
            });
            return res;
        }
    }
};
</script>
<style lang="scss" scoped>
.search-person-container {
    background: #fff;
    margin-top: 20px;
    .person-list {
        overflow: hidden;
        padding: 20px 20px 20px 0;
        .person-item {
            float: left;
            padding: 0 10px;
            min-width: 100px;
            height: 30px;
            line-height: 30px;
            margin-right: 10px;
            border: 1px solid #f2f2f2;
            border-radius: 5px;
            cursor: pointer;
        }
    }
    .search-field {
        position: relative;
        width: 160px;
        input {
            width: 160px;
            height: 30px;
            padding-left: 10px;
        }
        .search-result-list {
            position: absolute;
            top: 30px;
            left: 0;
            right: 0;
            height: 300px;
            background: #fff;
            border: 1px solid #000;
            overflow-y: scroll;
            .search-result-item {
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                border-bottom: 1px solid #f2f2f2;
                &:last-child {
                    border-bottom: none;
                }
            }
        }
        .search-result-empty-text {
            position: absolute;
            top: 30px;
            left: 0;
            right: 0;
            height: 30px;
            line-height: 30px;
            background: #fff;
            border: 1px solid #000;
        }
    }
}
</style>
