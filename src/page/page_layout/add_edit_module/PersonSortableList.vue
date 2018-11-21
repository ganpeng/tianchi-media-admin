<template>
    <div class="sortable-list-container">
        <draggable element="ul" class="sortable-list" v-model="personList">
            <li v-for="(person) in personList" :key="person.id" class="sortable-item">
                <div :style="styleStr(getImageUri(person))" class="img-wrapper">
                    <div class="mask"></div>
                    <span @click="deleteHandler(person.id)" class="delete-btn">
                        <svg-icon icon-class="bg_delete"></svg-icon>
                    </span>
                </div>
                <p class="name">{{person.name}}</p>
            </li>
        </draggable>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
export default {
    name: 'PersonSortableList',
    components: { draggable },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            personModule: 'pageLayout/personModule'
        }),
        personList: {
            get() {
                return this.personModule.personList;
            },
            set(value) {
                this.updatePersonModule({key: 'personList', value});
            }
        },
        getImageUri() {
            return (person) => {
                return _.get(person, 'avatarImage.uri');
            };
        },
        styleStr() {
            return (uri) => {
                return `background:url(${uri}) center center no-repeat;background-size: contain;`;
            };
        }
    },
    methods: {
        ...mapMutations({
            updatePersonModule: 'pageLayout/updatePersonModule',
            deletePersonFromPersonListOfPersonModule: 'pageLayout/deletePersonFromPersonListOfPersonModule'
        }),
        deleteHandler(id) {
            this.deletePersonFromPersonListOfPersonModule({id});
        }
    }
};
</script>
<style lang="scss" scoped>
.sortable-list-container {
    .sortable-list {
        display: flex;
        .sortable-item {
            position: relative;
            width: 80px;
            margin-right: 10px;
            cursor: pointer;
            .img-wrapper {
                position: relative;
                width: 80px;
                height: 80px;
                border: 1px solid #3E495E;
                border-radius: 4px;
                .mask {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                }
                .delete-btn {
                    display: none;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    z-index: 1000;
                    .svg-icon {
                        width: 22px;
                        height: 22px;
                        fill: $dangerColor;
                        &:hover {
                            fill: $dangerHoverColor;
                        }
                    }
                }
                &:hover {
                    .mask, .delete-btn {
                        display: block;
                    }
                }
                img {
                    display: block;
                    width: 80px;
                    height: 80px;
                }
            }
            .name {
                font-size: 12px;
                line-height: 18px;
                color: #6F7480;
                text-align: center;
            }
        }
    }
}
</style>
