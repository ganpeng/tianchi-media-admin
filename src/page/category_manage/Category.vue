<!-- 类型管理页面 -->
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
            <div class="seperator-line"></div>
            <div class="tab-content">
                <div v-if="activeTabIndex === 0" class="programme-content clearfix">
                    <div class="left-tab">
                        <div class="category-tab-wrapper">
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
                    </div>
                    <div class="right-content">
                        <h3 class="content-sub-title">类型</h3>
                        <div class="seperator-line"></div>
                        <div class="my-tags">
                            <draggable v-model="activeProgrammeCategoryList">
                                <el-tag
                                    :key="index"
                                    v-for="(type, index) in activeProgrammeCategoryList"
                                    closable
                                    :disable-transitions="false"
                                    @close="deleteProgrammeTypeHandler(type.id)">
                                    {{type.name}}
                                </el-tag>
                                <el-input
                                    :v-model="value"
                                    clearable
                                    class="type-input"
                                    ref="programmeCategoryInput"
                                    @keyup.enter.native="addCategoryHandler($event)"
                                    @blur="addCategoryHandler($event)"
                                    placeholder="请填写新的类型"
                                ></el-input>
                            </draggable>
                        </div>
                        <div class="fixed-btn-container">
                            <el-button class="btn-style-two" type="primary" @click="() => {}">保存</el-button>
                        </div>
                    </div>
                </div>
                <div v-if="activeTabIndex === 1" class="live-channel-content">
                    <h3 class="content-sub-title">类型</h3>
                    <div class="seperator-line"></div>
                    <div class="my-tags">
                        <draggable v-model="liveChannelCategoryList">
                            <el-tag
                                :key="index"
                                v-for="(category, index) in liveChannelCategoryList"
                                closable
                                :disable-transitions="false"
                                @close="deleteLiveCategoryHandler(category.id)">
                                {{category.name}}
                            </el-tag>
                            <el-input
                                clearable
                                class="type-input"
                                ref="liveCategoryInput"
                                @keyup.enter.native="addCategoryHandler($event)"
                                @blur="addCategoryHandler($event)"
                                placeholder="请填写新的类型"
                            ></el-input>
                        </draggable>
                    </div>
                    <div class="fixed-btn-container">
                        <el-button class="btn-style-two" type="primary" @click="() => {}">保存</el-button>
                    </div>
                </div>
                <div v-if="activeTabIndex === 2" class="carousel-channel-content">
                    <h3 class="content-sub-title">类型</h3>
                    <div class="seperator-line"></div>
                    <div class="my-tags">
                        <draggable v-model="carouselChannelCategoryList">
                            <el-tag
                                :key="index"
                                v-for="(category, index) in carouselChannelCategoryList"
                                closable
                                :disable-transitions="false"
                                @close="deleteCarouselCategoryHandler(category.id)">
                                {{category.name}}
                            </el-tag>
                            <el-input
                                clearable
                                class="type-input"
                                ref="carouselCategoryInput"
                                @keyup.enter.native="addCategoryHandler($event)"
                                @blur="addCategoryHandler($event)"
                                placeholder="请填写新的类型"
                            ></el-input>
                        </draggable>
                    </div>
                    <div class="fixed-btn-container">
                        <el-button class="btn-style-two" type="primary" @click="() => {}">保存</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
import draggable from 'vuedraggable';
import {mapGetters, mapMutations, mapActions} from 'vuex';
export default {
    name: 'Category',
    components: {
        draggable
    },
    data() {
        return {
            value: '',
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
            carouselChannelCategory: 'category/carouselChannelCategory',
            isCustomId: 'category/isCustomId',
            checkProgrammeCategoryIsExist: 'category/checkProgrammeCategoryIsExist',
            checkLiveCategoryIsExist: 'category/checkLiveCategoryIsExist',
            checkCarouselCategoryIsExist: 'category/checkCarouselCategoryIsExist'
        }),
        activeProgrammeCategoryList: {
            get() {
                let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
                return _.get(obj, 'programmeTypeList');
            },
            set(value) {
                this.updateProgrammeCategoryByIndex({index: this.programmeCategoryActiveIndex, value});
            }
        },
        liveChannelCategoryList: {
            get() {
                return this.liveChannelCategory;
            },
            set(value) {
                this.updateCategory({key: 'liveChannelCategory', value});
            }
        },
        carouselChannelCategoryList: {
            get() {
                return this.carouselChannelCategory;
            },
            set(value) {
                this.updateCategory({key: 'carouselChannelCategory', value});
            }
        }
    },
    methods: {
        ...mapMutations({
            updateCategory: 'category/updateCategory',
            updateProgrammeCategoryByIndex: 'category/updateProgrammeCategoryByIndex',
            deleteProgrammeTypeByIndexAndTypeId: 'category/deleteProgrammeTypeByIndexAndTypeId',
            addProgrammeTypeByIndex: 'category/addProgrammeTypeByIndex',
            addCarouselCategory: 'category/addCarouselCategory',
            addLiveCategory: 'category/addLiveCategory',
            deleteLiveCategory: 'category/deleteLiveCategory',
            deleteCarouselCategory: 'category/deleteCarouselCategory'
        }),
        ...mapActions({
            getLiveChannelCategory: 'category/getLiveChannelCategory',
            getCarouselChannelCategory: 'category/getCarouselChannelCategory',
            getProgrammeCategory: 'category/getProgrammeCategory',
            getProgrammeTypeCount: 'programme/getProgrammeTypeCount',
            getChannelCount: 'channel/getChannelCount'
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
        },
        clearInputValue() {
            let $programmeCategoryInput = this.$refs.programmeCategoryInput;
            let $liveCategoryInput = this.$refs.liveCategoryInput;
            let $carouselCategoryInput = this.$refs.carouselCategoryInput;

            if ($programmeCategoryInput) {
                $programmeCategoryInput.clear();
            }

            if ($liveCategoryInput) {
                $liveCategoryInput.clear();
            }

            if ($carouselCategoryInput) {
                $carouselCategoryInput.clear();
            }
        },
        //  节目类型管理部分开始
        async deleteProgrammeTypeHandler(id) {
            try {
                let answer = await this.$confirm('此操作将永久删除该节目类型, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        });
                if (answer === 'confirm') {
                    let isCustomId = this.isCustomId(id);
                    if (isCustomId) {
                        this.deleteProgrammeTypeByIndexAndTypeId({id, index: this.programmeCategoryActiveIndex});
                        this.$message.success('删除成功');
                    } else {
                        let noProgramme = await this.getProgrammeTypeCount(id);
                        if (noProgramme) {
                            this.deleteProgrammeTypeByIndexAndTypeId({id, index: this.programmeCategoryActiveIndex});
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error('该类型下面有节目，不能删除!');
                        }
                    }
                }
            } catch (err) {
                if (err === 'cancel') {
                    this.$message.info('已取消删除');
                }
            }
        },
        addProgrammeCategoryHandler(name) {
            let isExist = this.checkProgrammeCategoryIsExist(name, this.programmeCategoryActiveIndex);
            if (isExist) {
                this.$message.error(`${name}类型已经存在`);
            } else {
                this.addProgrammeTypeByIndex({name, index: this.programmeCategoryActiveIndex});
                this.clearInputValue();
            }
        },
        //  节目类型管理部分结束
        //  直播类型管理开始
        addLiveCategoryHandler(name) {
            let isExist = this.checkLiveCategoryIsExist(name);
            if (isExist) {
                this.$message.error(`${name}类型已经存在`);
            } else {
                this.addLiveCategory({name});
                this.clearInputValue();
            }
        },
        async deleteLiveCategoryHandler(id) {
            try {
                let answer = await this.$confirm('此操作将永久删除该节目类型, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        });
                if (answer === 'confirm') {
                    let isCustomId = this.isCustomId(id);
                    if (isCustomId) {
                        this.deleteLiveCategory({id});
                        this.$message.success('删除成功');
                    } else {
                        let noProgramme = await this.getChannelCount(id);
                        if (noProgramme) {
                            this.deleteLiveCategory({id});
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error('该类型下面有频道，不能删除!');
                        }
                    }
                }
            } catch (err) {
                if (err === 'cancel') {
                    this.$message.info('已取消删除');
                }
            }
        },
        //  直播类型管理结束
        //  轮播类型管理开始
        addCarouselCategoryHandler(name) {
            let isExist = this.checkCarouselCategoryIsExist(name);
            if (isExist) {
                this.$message.error(`${name}类型已经存在`);
            } else {
                this.addCarouselCategory({name});
                this.clearInputValue();
            }
        },
        async deleteCarouselCategoryHandler(id) {
            try {
                let answer = await this.$confirm('此操作将永久删除该节目类型, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        });
                if (answer === 'confirm') {
                    let isCustomId = this.isCustomId(id);
                    if (isCustomId) {
                        this.deleteCarouselCategory({id});
                        this.$message.success('删除成功');
                    } else {
                        let noProgramme = await this.getChannelCount(id);
                        if (noProgramme) {
                            this.deleteCarouselCategory({id});
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error('该类型下面有频道，不能删除!');
                        }
                    }
                }
            } catch (err) {
                if (err === 'cancel') {
                    this.$message.info('已取消删除');
                }
            }
        },
        //  轮播类型管理结束
        addCategoryHandler(e) {
            let name = e.target.value;
            if (name) {
                switch (this.activeTabIndex) {
                    case 0:
                        this.addProgrammeCategoryHandler(name);
                        break;
                    case 1:
                        this.addLiveCategoryHandler(name);
                        break;
                    case 2:
                        this.addCarouselCategoryHandler(name);
                        break;
                    default:
                        throw new Error('选项卡索引越界');
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.content-sub-title {
    margin-bottom: 10px;
}
.my-tags {
    display: flex;;
    justify-content: start;
    margin-top: 20px;
    cursor: pointer;
    text-align: left;
}

.type-input {
    display: inline-block;
    width: 160px;
    margin-top: 10px;
}

.tab-list {
    display: flex;
    justify-content: center;
    .tab-item {
        font-size: 24px;
        line-height: 40px;
        padding: 0 10px;
        color: #6F7480;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        &.active {
            color: #fff;
            border-bottom: 2px solid $mainColor;
        }
    }
}
.programme-content {
    margin-top: 20px;
    .left-tab {
        float: left;
        .category-tab-wrapper {
            border-right: 1px solid #252D3F;
            .category-tab-list {
                margin: 10px 20px 10px 0;
                width: 120px;
                .category-tab-item {
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 18px;
                    color: #6F7480;
                    cursor: pointer;
                    border-bottom: 1px solid #252D3F;
                    &:last-child {
                        border-bottom: 1px solid #252D3F;
                    }
                    &.active {
                        color: #fff;
                        border-bottom: 1px solid $mainColor;
                    }
                }
            }
        }
    }
    .right-content {
        overflow: hidden;
        padding-left: 20px;
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
