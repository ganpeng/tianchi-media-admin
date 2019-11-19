<!-- 类型管理页面 -->
<template>
    <div id="category" class="category-container">
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
                        <el-button
                            v-if="!editCategory"
                            class="btn-style-two contain-svg-icon"
                            @click="addNewProgrammeCategoryHandler">
                            <svg-icon icon-class="add"></svg-icon>
                            新增分类
                        </el-button>
                        <div class="category-tab-wrapper">
                            <ul class="category-tab-list">
                                <li
                                    v-for="(category, index) in programmeCategory"
                                    :key="index"
                                    :class="['category-tab-item', programmeCategoryActiveIndex === index ? 'active' : '']"
                                >
                                    <div
                                        v-if="!category.edit"
                                        class="display-wrapper">
                                        <span
                                            @dblclick.prevent.stop="toggleCategoryEditHandler(index)"
                                            @click="changeProgrammeCategoryTabHandler(index)">{{category.name}}
                                        </span>
                                        <i v-if="editCategory" @click.prevent="deleteProgrammeCategoryHandler(category, index)" class="el-tag__close el-icon-close"></i>
                                    </div>
                                    <div v-else class="edit-wrapper">
                                        <el-input
                                            :value="category.inputValue"
                                            @input="programmeCategoryInputValueChangeHandler($event, index)"
                                        ></el-input>
                                        <i @click="editProgrammeCategoryNameHandler(index)" class="save-btn text-success el-icon-success"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="edit-category-btn-wrapper">
                            <span class="btn-text text-primary" @click="toggleEditCategoryHandler">
                                {{editCategory ? '确定' : '编辑分类'}}
                            </span>
                        </div>
                    </div>
                    <div class="right-content">
                        <h3 class="content-sub-title">类型</h3>
                        <div class="seperator-line"></div>
                        <div class="my-tags big">
                            <draggable v-model="activeProgrammeCategoryList">
                                <div :key="index"
                                    v-for="(type, index) in activeProgrammeCategoryList"
                                    class="tag-wrapper">
                                    <el-tag
                                        v-if="!type.edit"
                                        closable
                                        :disable-transitions="false"
                                        v-on:dblclick.native="toggleTypeEditHandler(type.id)"
                                        @close="deleteProgrammeTypeHandler(type.id)">
                                        {{type.name}}
                                    </el-tag>
                                    <div v-else class="type-input-wrapper">
                                        <el-input
                                            :value="type.inputValue"
                                            @input="typeInputValueChangeHandler($event, type)"
                                        ></el-input>
                                        <i @click="editTypeNameHandler(type.id)" class="save-btn text-success el-icon-success"></i>
                                    </div>
                                </div>
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
                        <div class="category-group-container">
                            <h3 class="content-sub-title">类型组</h3>
                            <div class="seperator-line"></div>
                            <div class="category-group-list-wrapper">
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
                                        <i @click="deleteCategoryGroupByIndexHandler(index)" class="el-tag__close el-icon-close delete-btn"></i>
                                    </li>
                                    <li key="hahahaha" slot="footer" class="add-category-group-item" @click="addCategoryGroup">
                                        <i class="el-icon-plus plus-icon"></i>
                                        <!-- <svg-icon icon-class="plus"></svg-icon> -->
                                    </li>
                                </draggable>
                            </div>
                        </div>
                        <div class="fixed-btn-container">
                            <el-button class="btn-style-two" type="primary" @click="saveProgrammeCategoryHandler">保存</el-button>
                        </div>
                        <div v-if="categoryGroupDialog" class="add-edit-category-group-dialog form-container">
                            <h4 class="header">{{categoryGroupTitle}}</h4>
                            <i class="el-icon-close" @click="hideCategoryGroupDialog"></i>
                            <div class="category-group-form">
                                <div class="form-item">
                                    <label class="label" for="">名称</label>
                                    <div class="form-item-field">
                                        <el-input
                                            v-model="categoryGroup.name"
                                            placeholder="请输入类型组名称, 建议四个字以内"
                                            clearable
                                            :maxlength="6"
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
                                            class="area-search"
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
                    <div class="my-tags big">
                        <draggable v-model="liveChannelCategoryList">
                            <div :key="index"
                                v-for="(category, index) in liveChannelCategoryList"
                                class="tag-wrapper">
                                <el-tag
                                    v-if="!category.edit"
                                    closable
                                    :disable-transitions="false"
                                    v-on:dblclick.native="toggleLiveCategoryEditHandler(category.id)"
                                    @close="deleteLiveCategoryHandler(category.id)">
                                    {{category.name}}
                                </el-tag>
                                <div v-else class="type-input-wrapper">
                                    <el-input
                                        :value="category.inputValue"
                                        @input="liveCategoryInputValueChangeHandler($event, category)"
                                    ></el-input>
                                    <i @click="editLiveCategoryNameHandler(category.id)" class="save-btn text-success el-icon-success"></i>
                                </div>
                            </div>
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
                    <div class="my-tags big">
                        <draggable v-model="carouselChannelCategoryList">
                            <div :key="index"
                                v-for="(category, index) in carouselChannelCategoryList"
                                class="tag-wrapper">
                                <el-tag
                                    v-if="!category.edit"
                                    closable
                                    :disable-transitions="false"
                                    v-on:dblclick.native="toggleCarouselCategoryEditHandler(category.id)"
                                    @close="deleteCarouselCategoryHandler(category.id)">
                                    {{category.name}}
                                </el-tag>
                                <div v-else class="type-input-wrapper">
                                    <el-input
                                        :value="category.inputValue"
                                        @input="carouselCategoryInputValueChangeHandler($event, category)"
                                    ></el-input>
                                    <i @click="editCarouselCategoryNameHandler(category.id)" class="save-btn text-success el-icon-success"></i>
                                </div>
                            </div>
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
            categoryGroupTitle: '新建',
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
            tabList: ['节目类型', '直播类型', '轮播类型'],
            editCategory: false
        };
    },
    created() {
        if (!this.$authority.isHasAuthority('content:programmeCategory:list')) {
            return;
        }
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
            areaLabel: 'programme/areaLabel',
            //  dev_v2.5
            programmeCategoryIsEdit: 'category/programmeCategoryIsEdit'
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
                if (_.isArray(activeProgrammeCategoryList)) {
                    let type = activeProgrammeCategoryList.find((item) => item.id === id);
                    return _.get(type, 'name') || '';
                } else {
                    return '';
                }
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
            updateCategoryGroupList: 'category/updateCategoryGroupList',
            // v2.5
            typeInputValueUpdate: 'category/typeInputValueUpdate',
            typeNameUpdate: 'category/typeNameUpdate',
            toggleTypeEdit: 'category/toggleTypeEdit',
            addNewProgrammeCategory: 'category/addNewProgrammeCategory',
            deleteProgrammeCategory: 'category/deleteProgrammeCategory',
            toggleCategoryEdit: 'category/toggleCategoryEdit',
            programmeCategoryInputValueUpdate: 'category/programmeCategoryInputValueUpdate',
            programmeCategoryNameUpdate: 'category/programmeCategoryNameUpdate',
            resetAllEdit: 'category/resetAllEdit',
            //  v2.5 直播相关
            toggleLiveCategoryEdit: 'category/toggleLiveCategoryEdit',
            liveCategoryInputValueUpdate: 'category/liveCategoryInputValueUpdate',
            liveCategoryNameUpdate: 'category/liveCategoryNameUpdate',
            //  v2.5 轮播相关
            toggleCarouselCategoryEdit: 'category/toggleCarouselCategoryEdit',
            carouselCategoryInputValueUpdate: 'category/carouselCategoryInputValueUpdate',
            carouselCategoryNameUpdate: 'category/carouselCategoryNameUpdate'
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
            postProgrammeTypeGroupListById: 'category/postProgrammeTypeGroupListById',
            // dev_v2.5 新增
            deleteProgrammeCategoryById: 'category/deleteProgrammeCategoryById'
        }),
        changeTabHandler(index) {
            this.activeTabIndex = index;
            this.fetchCategoryByIndex(index);
        },
        changeProgrammeCategoryTabHandler(index) {
            this.programmeCategoryActiveIndex = index;
            let obj = this.programmeCategory[this.programmeCategoryActiveIndex];
            let id = _.get(obj, 'id');
            if (id && !(/^category_/.test(id))) {
                this.getProgrammeTypeGroupListById(id);
            } else {
                this.setCategoryGroupList({categoryGroupList: []});
            }
            this.resetAllEdit();
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
                if (!this.$authority.isHasAuthority('content:programmeCategory:delete')) {
                    return;
                }
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
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
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
                if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                    return;
                }
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
                            // this.gotoBlankPage();
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
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
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
                if (!this.$authority.isHasAuthority('content:programmeCategory:delete')) {
                    return;
                }
                let answer = await this.$confirm('此操作将永久删除该直播类型, 是否继续?', '提示', {
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
                if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                    return;
                }
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
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
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
                if (!this.$authority.isHasAuthority('content:programmeCategory:delete')) {
                    return;
                }
                let answer = await this.$confirm('此操作将永久删除该轮播类型, 是否继续?', '提示', {
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
                    // this.$message.info('已取消删除');
                }
            }
        },
        async saveCarouselCategoryHandler() {
            try {
                if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                    return;
                }
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
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
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
            if (!this.$authority.isHasAuthority('content:programmeTypeGroup:addAndPut')) {
                return;
            }

            this.resetCategoryGroup();
            this.showCategoryGroupDialog();
        },
        editCategoryGroupByIndex(index) {
            if (!this.$authority.isHasAuthority('content:programmeTypeGroup:addAndPut')) {
                return;
            }
            let categoryGroup = this.categoryGroupList[index];
            this.categoryGroup = _.cloneDeep(categoryGroup);
            this.index = index;
            this.showCategoryGroupDialog();
        },
        showCategoryGroupDialog() {
            if (!this.$authority.isHasAuthority('content:programmeTypeGroup:addAndPut')) {
                return;
            }
            this.categoryGroupDialog = true;
            if (this.index) {
                this.categoryGroupTitle = '编辑';
            } else {
                this.categoryGroupTitle = '新建';
            }
        },
        hideCategoryGroupDialog() {
            this.categoryGroupDialog = false;
            this.index = null;
        },
        saveCategoryGroupHandler() {
            if (!this.$authority.isHasAuthority('content:programmeTypeGroup:addAndPut')) {
                return;
            }
            let categoryGroup = _.cloneDeep(this.categoryGroup);
            if (!_.get(categoryGroup, 'name')) {
                this.$message.error('请输入类型组名称');
                return false;
            }
            if (this.index !== null) {
                this.updateCategoryGroupList({index: this.index, categoryGroup});
            } else {
                this.addCategoryGroupToList({categoryGroup});
            }
            this.hideCategoryGroupDialog();
        },
        deleteCategoryGroupByIndexHandler(index) {
            if (!this.$authority.isHasAuthority('content:programmeTypeGroup:delete')) {
                return;
            }
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
        },
        gotoBlankPage() {
            let routeData = this.$router.resolve({name: 'CreateProgramme'});
            window.open(routeData.href, '_blank');
        },
        //  v2.5新增内容
        editTypeNameHandler(id) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            this.typeNameUpdate({id, index: this.programmeCategoryActiveIndex});
        },
        typeInputValueChangeHandler(value, type) {
            this.typeInputValueUpdate({value, type, index: this.programmeCategoryActiveIndex});
        },
        toggleTypeEditHandler(id) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            if (!this.programmeCategoryIsEdit) {
                this.toggleTypeEdit({id, index: this.programmeCategoryActiveIndex});
            }
        },
        async addNewProgrammeCategoryHandler() {
            try {
                if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                    return;
                }
                let {value} = await this.$prompt(`请输入新分类`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: `分类不能为空`
                });
                if (value) {
                    let category = {
                        id: this.getUniqueKey,
                        name: value,
                        inputValue: value,
                        edit: false,
                        programmeTypeList: []
                    };
                    this.addNewProgrammeCategory({programmeCategory: category});
                }
            } catch (err) {
                console.log(err);
            }
        },
        async deleteProgrammeCategoryHandler(category, index) {
            try {
                if (!this.$authority.isHasAuthority('content:programmeCategory:delete')) {
                    return;
                }
                let confirm = await this.$confirm(`您确定要删除该分类吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    if (/^category_/.test(category.id)) {
                        this.deleteProgrammeCategory({index});
                        if (index === this.programmeCategoryActiveIndex) {
                            this.changeProgrammeCategoryTabHandler(0);
                        }
                    } else {
                        let res = await this.deleteProgrammeCategoryById(category.id);
                        if (res && res.code === 0) {
                            if (index === this.programmeCategoryActiveIndex) {
                                this.changeProgrammeCategoryTabHandler(0);
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        toggleCategoryEditHandler(index) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            if (this.editCategory && !this.programmeCategoryIsEdit) {
                this.toggleCategoryEdit({index});
            }
        },
        programmeCategoryInputValueChangeHandler(value, index) {
            this.programmeCategoryInputValueUpdate({value, index});
        },
        editProgrammeCategoryNameHandler(index) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            this.programmeCategoryNameUpdate({index});
        },
        toggleEditCategoryHandler() {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            if (this.editCategory) {
                this.resetAllEdit();
            }
            this.editCategory = !this.editCategory;
        },
        //  直播相关
        toggleLiveCategoryEditHandler(id) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            this.toggleLiveCategoryEdit({id});
        },
        liveCategoryInputValueChangeHandler(value, liveCategory) {
            this.liveCategoryInputValueUpdate({value, id: liveCategory.id});
        },
        editLiveCategoryNameHandler(id) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            this.liveCategoryNameUpdate({id});
        },
        //  轮播相关
        toggleCarouselCategoryEditHandler(id) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            this.toggleCarouselCategoryEdit({id});
        },
        carouselCategoryInputValueChangeHandler(value, liveCategory) {
            this.carouselCategoryInputValueUpdate({value, id: liveCategory.id});
        },
        editCarouselCategoryNameHandler(id) {
            if (!this.$authority.isHasAuthority('content:programmeCategory:addAndPut')) {
                return;
            }
            this.carouselCategoryNameUpdate({id});
        }
    }
};
</script>
<style lang="scss" scoped>
.content-sub-title {
    margin-bottom: 10px;
}
.category-group-container {
    margin-top: 100px;
}
.my-tags {
    display: flex;;
    justify-content: start;
    flex-wrap: wrap;
    margin-top: 20px;
    cursor: pointer;
    text-align: left;
    > div {
        display: flex;
        flex-wrap: wrap;
    }
    .el-tag {
        font-size: 18px;
        margin-top: 20px;
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
        &.active,
        &:hover {
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
                    height: 50px;
                    line-height: 50px;
                    font-size: 18px;
                    color: #6F7480;
                    cursor: pointer;
                    border-bottom: 1px solid #252D3F;
                    &:last-child {
                        border-bottom: 1px solid #252D3F;
                    }
                    &.active,
                    &:hover {
                        color: #fff;
                        border-bottom: 1px solid $mainColor;
                    }
                    .el-icon-close {
                        border-radius: 50%;
                        text-align: center;
                        position: relative;
                        cursor: pointer;
                        font-size: 12px;
                        height: 16px;
                        width: 16px;
                        line-height: 16px;
                        vertical-align: middle;
                        top: -1px;
                        right: -5px;
                        color: #2A3040;
                        background: #6F7480;;
                        &:before {
                            content: "\E60F";
                            display: block;
                        }
                        &:hover {
                            background: #C35757;
                        }
                    }
                    .edit-wrapper {
                        position: relative;
                        .save-btn {
                            position: absolute;
                            right: 6px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                    }
                }
            }
        }
        .edit-category-btn-wrapper {
            width: 120px;
            cursor: pointer;
            margin-top: 40px;
        }
    }
    .right-content {
        overflow: hidden;
        padding-left: 20px;
        .type-input-wrapper {
            position: relative;
            margin-top: 20px;
            margin-right: 10px;
            .el-input {
                .el-input__inner {
                    height: 34px;
                    line-height: 34px;
                }
            }
            .save-btn {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
            }
        }
    }
}
.live-channel-content, .carousel-channel-content {
    .type-input-wrapper {
        position: relative;
        margin-top: 20px;
        margin-right: 10px;
        .el-input {
            .el-input__inner {
                height: 34px;
                line-height: 34px;
            }
        }
        .save-btn {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
        }
    }
}
.category-group-list-wrapper {
    display: flex;
    min-height: 140px;
    .add-category-group-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 110px;
        min-width: 110px;
        border: 1px solid #3E495E;
        border-radius: 4px;
        background: transparent;
        margin: 0 0 10px 0;
        cursor: pointer;
        .svg-icon {
            fill: #3E495E;
            width: 20px;
            height: 20px;
        }
        .plus-icon {
            font-size: 20px;
            color: #3E495E;
        }
        &:hover {
            border-color: $mainColor;
            .plus-icon {
                color: $mainColor;
            }
        }
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
        border: 1px solid #2A3040;
        border-radius: 4px;
        padding: 0 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        &:hover {
            border: 1px solid $mainColor;
        }
        &.sortable-drag {
            background: #293550;
            border: 1px solid #637497;
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
            span {
                display: inline-block;
                border-radius: 4px;
                color: #fff;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                padding: 0 4px;
                margin-right: 10px;
            }
            .type-list-tags {
                text-align: left;
                margin-top: 10px;
                span {
                    background: #637497;
                }
            }
            .year-area-tags {
                text-align: left;
                margin-top: 10px;
                .area-tag {
                    background: #8AA4AF;
                    .svg-icon {
                        fill: #fff;
                    }
                }
                .year-tag {
                    background: #485777;
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
            cursor: pointer;
            width: 16px;
            height: 16px;
            line-height: 16px;
            border-radius: 50%;
            font-size: 12px;
            &.el-tag__close.el-icon-close {
                color: #2A3040;
                background: #6F7480;
                &:hover {
                    background: $dangerColor;
                }
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
    background: rgba(65,74,93,1);
    box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.30);
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
            align-items: baseline;
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
                        .el-tags {
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
#category {
    .type-input {
        margin-top: 20px;
        input.el-input__inner {
            height: 34px;
            line-height: 34px;
        }
    }
    .add-edit-category-group-dialog {
        .el-input {
            input.el-input__inner {
                width: 240px;
                height: 34px;
                line-height: 34px;
                border-color: #A3D0FD;
            }
        }
        .my-tags {
            .el-tag {
                background: #2A3040;
                border-radius: 4px;
                font-size: 12px;
                color: #6F7480;
                height: 24px;
                padding: 0 8px;
                line-height: 22px;
                margin-right: 10px;
                border: 1px solid #2A3040;
                cursor: default;
            }
        }
    }
    .el-checkbox {
        color: #A3D0FD;
        &.is-checked {
            color: #A3D0FD;
        }
        .el-checkbox__input.is-checked+.el-checkbox__label  {
            color: #A3D0FD;
        }
        .el-checkbox__input {
            span.el-checkbox__inner {
                border: 1px solid #A3D0FD;
            }
            &.is-checked {
                span.el-checkbox__inner {
                    border: 1px solid #1989FA;
                }
            }
        }
    }
}
</style>
