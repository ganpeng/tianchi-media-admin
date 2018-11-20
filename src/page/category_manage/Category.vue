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
                                    v-model="value"
                                    clearable
                                    class="type-input"
                                    ref="programmeCategoryInput"
                                    @keyup.enter.native="addCategoryHandler($event)"
                                    @blur="addCategoryHandler($event)"
                                    placeholder="请填写新的类型"
                                ></el-input>
                            </draggable>
                        </div>
                        <h3 class="content-sub-title">类型组</h3>
                        <div class="seperator-line"></div>
                        <draggable element="ul" class="category-group-list" v-model="getCategoryGroupList">
                            <li v-for="(item, index) in getCategoryGroupList" :key="item.name" class="category-group-item">
                                <div class="header">
                                    {{item.name}}
                                </div>
                                <div class="content">
                                    <div class="type-list-tags">
                                        <span v-for="(id) in item.programmeTypeList" :key="id">
                                            {{getTypeNameById(id)}}
                                        </span>
                                    </div>
                                    <div class="year-area-tags">
                                        <span class="year-tag" v-for="(name, index) in item.dateRangeList" :key="name + index">
                                            {{name}}
                                        </span>
                                        <span class="area-tag" v-for="(obj, index) in areaLabel(item.produceAreaList)" :key="index">
                                            <svg-icon icon-class="location"></svg-icon>
                                            {{obj.name}}
                                        </span>
                                    </div>
                                </div>
                                <span class="btn-text edit-btn" @click="editCategoryGroupByIndex(index)">编辑</span>
                                <i @click="deleteCategoryGroupByIndexHandler(index)" class="el-icon-circle-close-outline delete-btn"></i>
                            </li>
                            <li key="alsdjflsdjf" sort="false" class="category-group-item" @click="addCategoryGroup">
                                <svg-icon icon-class="plus"></svg-icon>
                            </li>
                        </draggable>
                        <div class="fixed-btn-container">
                            <el-button class="btn-style-two" type="primary" @click="saveProgrammeCategoryHandler">保存</el-button>
                        </div>
                        <div v-if="categoryGroupDialog" class="add-edit-category-group-dialog form-container">
                            <h4 class="header">新建</h4>
                            <i class="el-icon-close" @click="hideCategoryGroupDialog"></i>
                            <div class="category-group-form">
                                <div class="form-item">
                                    <label class="label" for="">名称</label>
                                    <div class="form-item-field">
                                        <el-input
                                            v-model="categoryGroup.name"
                                            placeholder="请输入类型组名称"
                                            clearable
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="form-item">
                                    <label class="label" for="">类型</label>
                                    <div class="form-item-field">
                                        <el-checkbox-group
                                            class="field-group"
                                            v-model="categoryGroup.programmeTypeList"
                                        >
                                            <el-checkbox
                                                v-for="(item) in activeProgrammeCategoryList"
                                                :key="item.id"
                                                :label="item.id"
                                                >
                                                    {{item.name}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="form-item">
                                    <label class="label" for="">年代</label>
                                    <div class="form-item-field">
                                        <el-checkbox-group
                                            class="field-group"
                                            v-model="categoryGroup.dateRangeList"
                                        >
                                            <el-checkbox label="2018">2018</el-checkbox>
                                            <el-checkbox label="2017">2017</el-checkbox>
                                            <el-checkbox label="2016">2016</el-checkbox>
                                            <el-checkbox label="2011-2015">2011-2015</el-checkbox>
                                            <el-checkbox label="2000-2010">2000-2010</el-checkbox>
                                            <el-checkbox label="90年代">90年代</el-checkbox>
                                            <el-checkbox label="80年代">80年代</el-checkbox>
                                            <el-checkbox label="70年代">70年代</el-checkbox>
                                            <el-checkbox label="更早">更早</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="form-item">
                                    <label class="label" for="">地区</label>
                                    <div class="form-item-field">
                                        <div class="my-tags">
                                            <el-tag
                                                :key="index"
                                                v-for="(area, index) in areaLabel(categoryGroup.produceAreaList)"
                                                closable
                                                :disable-transitions="false"
                                                @close="deleteAreaHandler(area.code)">
                                                {{area.name}}
                                            </el-tag>
                                        </div>
                                        <area-search
                                            :handleSelect="selectAreaHandler"
                                        ></area-search>
                                    </div>
                                </div>
                            </div>
                            <el-button class="btn-style-two" type="primary" @click="saveCategoryGroupHandler">确定</el-button>
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
                        <el-button class="btn-style-two" type="primary" @click="saveLiveCategoryHandler">保存</el-button>
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
                        <el-button class="btn-style-two" type="primary" @click="saveCarouselCategoryHandler">保存</el-button>
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
import AreaSearch from '../programme_manage/AreaSearch';
export default {
    name: 'Category',
    components: {
        draggable,
        AreaSearch
    },
    data() {
        return {
            //  类型组变量
            categoryGroupDialog: false,
            index: null,
            categoryGroup: {
                name: '',
                programmeTypeList: [],
                dateRangeList: [],
                produceAreaList: []
            },
            //  类型组变量结束
            value: '',
            activeTabIndex: 0,
            programmeCategoryActiveIndex: 0,
            tabList: ['节目类型', '直播类型', '轮播类型']
        };
    },
    created() {
        this.fetchCategoryByIndex(this.activeTabIndex);
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    computed: {
        ...mapGetters({
            programmeCategory: 'category/programmeCategory',
            liveChannelCategory: 'category/liveChannelCategory',
            carouselChannelCategory: 'category/carouselChannelCategory',
            categoryGroupList: 'category/categoryGroupList',
            isCustomId: 'category/isCustomId',
            checkProgrammeCategoryIsExist: 'category/checkProgrammeCategoryIsExist',
            checkLiveCategoryIsExist: 'category/checkLiveCategoryIsExist',
            checkCarouselCategoryIsExist: 'category/checkCarouselCategoryIsExist',
            //  区域搜索
            areaLabel: 'programme/areaLabel'
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
        },
        getCategoryGroupList: {
            get() {
                return this.categoryGroupList;
            },
            set(value) {
                this.setCategoryGroupList({categoryGroupList: value});
            }
        },
        getTypeNameById() {
            return (id) => {
                let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
                let activeProgrammeCategoryList = _.get(obj, 'programmeTypeList');
                let type = activeProgrammeCategoryList.find((item) => item.id === id);
                return _.get(type, 'name') || '';
            };
        },
        getUniqueKey() {
            return _.uniqueId('category_');
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
            deleteCarouselCategory: 'category/deleteCarouselCategory',
            // 类型组
            setCategoryGroupList: 'category/setCategoryGroupList',
            addCategoryGroupToList: 'category/addCategoryGroupToList',
            deleteCategoryGroupByIndex: 'category/deleteCategoryGroupByIndex',
            updateCategoryGroupList: 'category/updateCategoryGroupList'
        }),
        ...mapActions({
            getLiveChannelCategory: 'category/getLiveChannelCategory',
            getCarouselChannelCategory: 'category/getCarouselChannelCategory',
            getProgrammeCategory: 'category/getProgrammeCategory',
            getProgrammeTypeCount: 'programme/getProgrammeTypeCount',
            getChannelCount: 'channel/getChannelCount',
            saveChannelCategory: 'category/saveChannelCategory',
            getChannelCategory: 'category/getChannelCategory',
            saveProgrammeCategory: 'category/saveProgrammeCategory',
            getProgrammeTypeGroupListById: 'category/getProgrammeTypeGroupListById',
            postProgrammeTypeGroupListById: 'category/postProgrammeTypeGroupListById'
        }),
        changeTabHandler(index) {
            this.activeTabIndex = index;
            this.fetchCategoryByIndex(index);
        },
        changeProgrammeCategoryTabHandler(index) {
            this.programmeCategoryActiveIndex = index;
            let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
            let id = _.get(obj, 'id');
            this.getProgrammeTypeGroupListById(id);
        },
        fetchCategoryByIndex(index) {
            switch (index) {
                case 0:
                    this.getProgrammeCategoryAndProgrammeCategoryGroup();
                    break;
                case 1:
                    this.getChannelCategory();
                    break;
                case 2:
                    this.getChannelCategory();
                    break;
                default:
                    this.getProgrammeCategory();
            }
        },
        getProgrammeCategoryAndProgrammeCategoryGroup() {
            this.getProgrammeCategory()
                .then(() => {
                    let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
                    let id = _.get(obj, 'id');
                    this.getProgrammeTypeGroupListById(id);
                });
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
        async saveProgrammeCategoryHandler() {
            try {
                let res = await this.saveProgrammeCategory();
                if (res && res.code === 0) {
                    // 重新赋值类型别表
                    this.$message.success('类型保存成功');
                    this.getProgrammeCategory();

                    let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
                    let activeProgrammeCategoryId = _.get(obj, 'id');
                    if (activeProgrammeCategoryId) {
                        let res2 = await this.postProgrammeTypeGroupListById(activeProgrammeCategoryId);
                        if (res2 && res2.code === 0) {
                            this.$message.success('类型组保存成功');
                        }
                    }
                }
            } catch (err) {
                console.log(err);
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
        async saveLiveCategoryHandler() {
            try {
                let res = await this.saveChannelCategory();
                if (res && res.code === 0) {
                    this.$message.success('保存成功');
                    this.getChannelCategory();
                }
            } catch (err) {
                console.log(err);
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
        async saveCarouselCategoryHandler() {
            try {
                let res = await this.saveChannelCategory();
                if (res && res.code === 0) {
                    this.$message.success('保存成功');
                    this.getChannelCategory();
                }
            } catch (err) {
                console.log(err);
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
        },
        //  保存节目类型组
        addCategoryGroup() {
            this.resetCategoryGroup();
            this.showCategoryGroupDialog();
        },
        editCategoryGroupByIndex(index) {
            let categoryGroup = this.categoryGroupList[index];
            this.categoryGroup = _.cloneDeep(categoryGroup);
            this.index = index;
            this.showCategoryGroupDialog();
        },
        showCategoryGroupDialog() {
            this.categoryGroupDialog = true;
        },
        hideCategoryGroupDialog() {
            this.categoryGroupDialog = false;
            this.index = null;
        },
        saveCategoryGroupHandler() {
            let categoryGroup = _.cloneDeep(this.categoryGroup);
            if (this.index !== null) {
                this.updateCategoryGroupList({index: this.index, categoryGroup});
            } else {
                this.addCategoryGroupToList({categoryGroup});
            }
            this.hideCategoryGroupDialog();
        },
        deleteCategoryGroupByIndexHandler(index) {
            this.deleteCategoryGroupByIndex({index});
        },
        resetCategoryGroup() {
            this.categoryGroup = {
                name: '',
                programmeTypeList: [],
                dateRangeList: [],
                produceAreaList: []
            };
        },
        deleteAreaHandler(code) {
            this.categoryGroup.produceAreaList = this.categoryGroup.produceAreaList.filter((_code) => _code !== code);
        },
        selectAreaHandler(area) {
            this.categoryGroup.produceAreaList.push(area.code);
            this.categoryGroup.produceAreaList = _.uniq(this.categoryGroup.produceAreaList);
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
    flex-wrap: wrap;
    margin-top: 20px;
    cursor: pointer;
    text-align: left;
    .el-tag {
        font-size: 18px;
    }
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
    }
}
.category-group-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    .category-group-item {
        position: relative;
        min-width: 200px;
        height: 110px;
        background: #2A3040;
        border-radius: 4px;
        padding: 0 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        &:last-child {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 110px;
            min-width: 110px;
            border: 1px solid #3E495E;
            border-radius: 4px;
            background: transparent;
            cursor: pointer;
            .svg-icon {
                fill: #3E495E;
                width: 20px;
                height: 20px;
            }
        }
        .header {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            color: #A8ABB3;
            text-align: left;
            border-bottom: 1px solid #3E495E;
        }
        .content {
            .type-list-tags {
                text-align: left;
                margin-top: 10px;
                span {
                    display: inline-block;
                    background: #637497;
                    border-radius: 4px;
                    padding: 2px 5px;
                    color: #fff;
                    font-size: 12px;
                    transform: scale(0.8);
                }
            }
            .year-area-tags {
                text-align: left;
                margin-top: 10px;
                .area-tag {
                    display: inline-block;
                    background: #8AA4AF;
                    border-radius: 4px;
                    padding: 2px 5px;
                    color: #fff;
                    font-size: 12px;
                    transform: scale(0.8);
                    .svg-icon {
                        fill: #fff;
                    }
                }
                .year-tag {
                    display: inline-block;
                    background: #485777;
                    border-radius: 4px;
                    padding: 2px 5px;
                    color: #fff;
                    font-size: 12px;
                    transform: scale(0.8);
                }
            }
        }
        .edit-btn {
            position: absolute;
            right: 40px;
            top: 5px;
            font-size: 14px;
            color: #1989FA;
            cursor: pointer;
        }
        .delete-btn {
            position: absolute;
            right: 10px;
            top: 5px;
            font-size: 14px;
            line-height: 20px;
            background: transparent;
            color: #C0C4CC;
            cursor: pointer;
            &:hover {
                color: $dangerColor;
            }
        }
    }
}
.add-edit-category-group-dialog {
    position: absolute;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    background: rgba(65,74,93,0.90);
    box-shadow: 2px 4px 10px 0;
    border-radius: 4px;
    padding-bottom: 20px;
    .header {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 18px;
        color: #FFF;
    }
    i {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 18px;
        color: $dangerColor;
        cursor: pointer;
        &:hover {
            color: $dangerHoverColor;
        }
    }
    .category-group-form {
        .form-item {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            font-size: 14px;
            color: #A3D0FD;
            margin-bottom: 20px;
            .label {
                width: 80px;
            }
            .form-item-field,
            .field-group {
                display: flex;
                flex: 1;
                flex-wrap: wrap;
            }
            .el-input {
                width: 50%;
                border: 1px solid #A3D0FD;
                border-radius: 4px;
                .el-input_inner {
                    border: none;
                }
            }
            .el-checkbox {
                padding: 0;
                margin-right: 20px;
                margin-bottom: 10px;
            }
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            &:last-child {
                .form-item-field {
                    text-align: left;
                    display: block;
                    .my-tags {
                        margin-top: 0;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
}
</style>
