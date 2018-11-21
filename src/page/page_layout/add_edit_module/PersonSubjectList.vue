<template>
    <div class="sortable-list-container">
        <ul class="sortable-list">
            <li @click="selectPersonSubjectHandler(index)" v-for="(layoutItem, index) in personSubjectModule.layoutItemMultiList" :key="index" class="sortable-item">
                <div :style="styleStr(getImageUri(layoutItem))" class="img-wrapper">
                    <div class="mask"></div>
                    <!-- <span @click="deleteHandler(person.id)" class="delete-btn">
                        <svg-icon icon-class="bg_delete"></svg-icon>
                    </span> -->
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
export default {
    name: 'PersonSubjectList',
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            personSubjectModule: 'pageLayout/personSubjectModule'
        }),
        getImageUri() {
            return (layoutItem) => {
                return _.get(layoutItem, 'coverImage.uri');
            };
        },
        styleStr() {
            return (uri) => {
                return `background:url(${uri}) center center no-repeat;`;
            };
        }
    },
    methods: {
        ...mapMutations({
            updatePersonModule: 'pageLayout/updatePersonModule'
        }),
        selectPersonSubjectHandler(index) {
            window.eventBus.$emit('showDialog', index);
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
            width: 78px;
            margin-right: 10px;
            cursor: pointer;
            .img-wrapper {
                position: relative;
                width: 78px;
                height: 178px;
                border: 1px solid #3E495E;
                border-radius: 4px;
                background-size: contain!important;
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
