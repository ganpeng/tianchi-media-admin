<template>
    <div class="category-container">
        <div class="tab-container">
            <ul class="tab-list clearfix">
                <li
                    v-for="(tab, index) in tabList"
                    :key="index"
                    :class="['tab-item', 'float-left', activeTabIndex === index ? 'active' : '']"
                    @click="changeTabHandler(index)"
                >
                    {{tab}}
                </li>
            </ul>
            <div class="tab-content">
                <div v-if="activeTabIndex === 0" class="programme-content clearfix">
                    <div class="left-tab">
                        <ul class="category-tab-list">
                            <li
                                v-for="(category, index) in programmeCategory"
                                :key="index"
                                :class="['category-tab-item', programmeCategoryActiveIndex === index ? 'active' : '']"
                                @click="changeProgrammeCategoryTabHandler(index)"
                            >
                                {{category.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="right-content">
                        <ul class="type-list clearfix">
                            <li
                                v-for="(type, index) in getActiveProgrammeCategoryContent"
                                class="type-item"
                                :key="index"
                            >
                                {{type.name}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="activeTabIndex === 1" class="live-channel-content">
                    <ul class="live-category-list clearfix">
                        <li
                            v-for="(category, index) in liveChannelCategory"
                            class="live-category-item"
                            :key="index"
                        >
                            {{category.name}}
                        </li>
                    </ul>
                </div>
                <div v-if="activeTabIndex === 2" class="carousel-channel-content">
                    <ul class="live-category-list clearfix">
                        <li
                            v-for="(category, index) in carouselChannelCategory"
                            class="live-category-item"
                            :key="index"
                        >
                            {{category.name}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters, mapActions} from 'vuex';
export default {
    name: 'Category',
    data() {
        return {
            activeTabIndex: 0,
            programmeCategoryActiveIndex: 0,
            tabList: ['节目类型', '直播类型', '轮播类型']
        };
    },
    created() {
        this.fetchCategoryByIndex(this.activeTabIndex);
    },
    computed: {
        ...mapGetters({
            programmeCategory: 'category/programmeCategory',
            liveChannelCategory: 'category/liveChannelCategory',
            carouselChannelCategory: 'category/carouselChannelCategory'
        }),
        getActiveProgrammeCategoryContent() {
            let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
            return _.get(obj, 'programmeTypeList');
        }
    },
    methods: {
        ...mapActions({
            getLiveChannelCategory: 'category/getLiveChannelCategory',
            getCarouselChannelCategory: 'category/getCarouselChannelCategory',
            getProgrammeCategory: 'category/getProgrammeCategory'
        }),
        changeTabHandler(index) {
            this.activeTabIndex = index;
            this.fetchCategoryByIndex(index);
        },
        changeProgrammeCategoryTabHandler(index) {
            this.programmeCategoryActiveIndex = index;
        },
        fetchCategoryByIndex(index) {
            switch (index) {
                case 0:
                    this.getProgrammeCategory();
                    break;
                case 1:
                    this.getLiveChannelCategory();
                    break;
                case 2:
                    this.getCarouselChannelCategory();
                    break;
                default:
                    this.getProgrammeCategory();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.tab-list {
    .tab-item {
        padding: 0px 30px;
        height: 40px;
        line-height: 40px;
        background: #fff;
        color: #000;
        cursor: pointer;
        &.active {
            color: red;
        }
    }
}
.programme-content {
    margin-top: 20px;
    .left-tab {
        float: left;
        width: 200px;
        .category-tab-list {
            background: #fff;
            .category-tab-item {
                width: 200px;
                height: 40px;
                line-height: 40px;
                border: 1px solid #000;
                border-bottom: none;
                cursor: pointer;
                &:last-child {
                    border-bottom: 1px solid #000;
                }
                &.active {
                    color: blue;
                }
            }
        }
    }
    .right-content {
        float: left;
        width: 800px;
        background: #fff;
        border: 1px solid #000;
        margin-left: 20px;
        padding: 20px;
        .type-list {
            .type-item {
                float: left;
                padding: 0 10px;
                min-width: 100px;
                height: 30px;
                line-height: 30px;
                margin: 0 10px 10px 0;
                border: 1px solid #f2f2f2;
                border-radius: 5px;
                cursor: pointer;
            }
        }
    }
}
.live-channel-content, .carousel-channel-content {
    background: #fff;
    padding: 20px;
    margin-top: 20px;
    width: 1020px;
    .live-category-item {
        float: left;
        padding: 0 10px;
        min-width: 100px;
        height: 30px;
        line-height: 30px;
        margin: 0 10px 10px 0;
        border: 1px solid #f2f2f2;
        border-radius: 5px;
        cursor: pointer;
    }
}
</style>
