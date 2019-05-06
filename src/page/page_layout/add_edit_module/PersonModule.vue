<template>
    <div class="person-module-container">
        <h2 class="content-title">{{title}}</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutData"
                    :rules="inputRules"
                    status-icon
                    ref="personModuleForm"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block my-form">
                <el-col :span="8">
                    <el-form-item label="人物模块名称" prop="title" required>
                        <el-input
                            :value="layoutData.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入人物姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="layoutData.iconImage ? layoutData.iconImage.uri : ''"
                            :showDelete="false"
                            :uploadSuccessHandler="uploadSuccessHandler"
                            :allowResolutions="[{width: 82, height: 82}]"
                        ></single-image-uploader>
                    </el-form-item>
                    <el-form-item label="选择人物" required>
                        <el-button class="btn-style-two" @click="selectPersonClickHandler">选择人物</el-button>
                        <span class="my-tool-tips">只能选择6个人物</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label=" ">
                        <div class="sortable-list-container">
                            <draggable v-if="personList.length ===6" element="ul" class="sortable-list" v-model="personList">
                                <li @click="selectPersonClickHandler" v-for="(person, index) in personList" :key="index" class="sortable-item">
                                    <div :style="styleStr(person)" class="img-wrapper">
                                        <div class="mask"></div>
                                    </div>
                                    <p class="name">{{person.name}}</p>
                                </li>
                            </draggable>
                            <ul v-else class="sortable-empty-list sortable-list">
                                <li @click="selectPersonClickHandler" v-for="(item, index) in [1, 2, 3, 4, 5, 6]" :key="index" class="sortable-item">
                                    <div class="img-wrapper">
                                        <div class="mask"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <el-dialog
            title="选择人物"
            class="my-dialog"
            width="80%"
            :visible.sync="selectPersonDialogVisible"
            :show-close="true"
            :before-close="cancelHanlder"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <div class="my-tags-two-container">
                    <div class="header">
                        <span class="count">已选{{layoutItemMultiList.length}}项</span>
                        <span
                            @click="toggleTagsField"
                            :class="['el-dropdown-link', tagsFieldVisible ? 'active' : '']">
                            {{tagsFieldVisible ? '收起' : '展开'}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                    </div>
                    <div class="seperator-line"></div>
                    <div v-show="tagsFieldVisible" class="my-tags-two">
                        <el-tag
                            :key="index"
                            v-for="(person, index) in layoutItemMultiList"
                            closable
                            :disable-transitions="false"
                            @close="deletePersonHandler(person.id)">
                            {{person.name}}
                        </el-tag>
                    </div>
                    <div class="seperator-line"></div>
                </div>
                <el-form class="searchForm" :inline="true" @submit.native.prevent>
                    <el-form-item class="search">
                        <el-input
                            placeholder="搜索你想要的信息"
                            clearable
                            class="border-input"
                            :value="searchFields.name"
                            @input="searchInputHandler($event, 'name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :row-class-name="tableRowClassName"
                    :header-row-class-name='"common-table-header"' class="my-table-style" :data="list" border>
                    <el-table-column align="center" width="60px" label="选择">
                        <template slot-scope="scope">
                            <el-checkbox
                                @change="checkHandler($event, scope.row)"
                                :value="checkIsChecked(scope.row)"
                                :disabled="disabled(scope.row)"
                            ></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" align="center" width="120px" label="编号">
                        <template slot-scope="scope">
                            {{scope.row.id | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="名字">
                        <template slot-scope="scope">
                            <span
                                class="ellipsis three name">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="照片" width="120px" align="center" >
                        <template slot-scope="scope">
                            <img v-if="scope.row.avatarImage" class="person-image" :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
                            <span v-else>------</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="area" align="center" label="地区">
                        <template slot-scope="scope">
                            {{areaLabel(scope.row.area) | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="mainRole" align="center" label="职业">
                        <template slot-scope="scope">
                            <span class="ellipsis three">
                                {{mainRoleLabel(scope.row.mainRoleList).join(', ') | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                            <i v-else class="off-the-shelf">已下架</i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handlePaginationChange($event, 'pageNum')"
                    :current-page="pagination.pageNum"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button type="primary" @click="selectPersonEnterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import draggable from 'vuedraggable';
import store from 'store';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
export default {
    name: 'PersonModule',
    components: {
        SingleImageUploader,
        draggable
    },
    data() {
        return {
            navbarId: '', //  缓存navbarId
            index: '', //  缓存的index
            selectPersonDialogVisible: false,
            tagsFieldVisible: false,
            title: '',
            areaOptions: store.get('areaList'),
            inputRules: {
                title: [
                    { required: true, message: '请输入人物模块名称' }
                ]
            },
            layoutItemMultiList: [],

            //  2.3.0新增
            layoutBlockId: ''
        };
    },
    async created() {
        try {
            let {id} = this.$route.query;
            let {navbarId, index, operator} = this.$route.params;
            this.navbarId = navbarId;
            this.index = index;
            this.layoutBlockId = id;

            if (operator === 'edit') {
                await this.getLayoutByNavbarId(navbarId);
                this.title = '编辑人物模块';
            } else {
                this.title = '新增人物模块';
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            searchFields: 'person/searchFields',
            list: 'person/list',
            mainRoleLabel: 'person/mainRoleLabel',
            pagination: 'person/pagination',
            getNavbarNameById: 'pageLayout/getNavbarNameById',
            getLayoutDataByNavbarId: 'pageLayout/getLayoutDataByNavbarId',
            getNavbarSignCodeById: 'pageLayout/getNavbarSignCodeById',

            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        layoutData() {
            let layoutBlock = _.get(this.activeLayout, `${this.index}`);
            return layoutBlock || {};
        },
        checkIsChecked() {
            return (row) => {
                let index = this.layoutItemMultiList.findIndex((person) => person.id === row.id);
                return index >= 0;
            };
        },
        disabled() {
            return (row) => {
                if (!_.get(row, 'avatarImage.uri')) {
                    return true;
                }
                let index = this.layoutItemMultiList.findIndex((person) => person.id === row.id);
                return index < 0 && this.layoutItemMultiList.length > 5;
            };
        },
        getImageUri() {
            return (person) => {
                return _.get(person, 'coverImage.uri');
            };
        },
        styleStr() {
            return (person) => {
                return `background-image:url(${this.getImageUri(person)});`;
            };
        },
        personList: {
            get() {
                return _.get(this.layoutData, 'layoutItemMultiList') || [];
            },
            set(value) {
                this.updateLayoutBlockDataById({ layoutBlockId: this.layoutBlockId, key: 'layoutItemMultiList', value });
            }
        }
    },
    methods: {
        ...mapMutations({
            updatePagination: 'person/updatePagination',
            resetPagination: 'person/resetPagination',
            resetSearchFields: 'person/resetSearchFields',
            updateSearchFields: 'person/updateSearchFields',

            //  2.3.0新增
            updateLayoutBlockDataById: 'pageLayout/updateLayoutBlockDataById'
        }),
        ...mapActions({
            getPersonList: 'person/getPersonList',

            //  2.3.0 新增的部分
            getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
        }),
        inputHandler(value, key) {
            this.updateLayoutBlockDataById({ layoutBlockId: this.layoutBlockId, key, value });
        },
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        handlePaginationChange(value, key) {
            this.updatePagination({value, key});
            this.getPersonList({isProgramme: false, params: {visible: true}});
        },
        resetPerson() {
            this.resetPagination();
            this.resetSearchFields();
        },
        areaLabel(code) {
            let reg = /^\d+(\.\d+)?$/;
            if (reg.test(code)) {
                let area = this.areaOptions.find((area) => area.code === code);
                return area ? area.name : '';
            } else {
                return code;
            }
        },
        //  动态的为符合条件的行添加class
        tableRowClassName({row, rowIndex}) {
            let index = this.layoutItemMultiList.findIndex((person) => person.id === row.id);
            return index >= 0 ? 'checked' : '';
        },
        checkHandler(value, person) {
            if (this.layoutItemMultiList.length > 5 && value) {
                return false;
            }
            if (value) {
                let layoutItem = {
                    id: person.id,
                    name: person.name,
                    desc: person.desc,
                    coverImage: person.avatarImage,
                    layoutItemType: 'FIGURE',
                    params: ''
                };
                this.layoutItemMultiList.push(layoutItem);
            } else {
                this.layoutItemMultiList = this.layoutItemMultiList.filter((item) => item.id !== person.id);
            }
        },
        async saveHandler() {
            try {
                let valid = await this.$refs.personModuleForm.validate();
                if (valid) {
                    let signCode = this.getNavbarSignCodeById(this.navbarId);
                    let {id} = this.$route.query;
                    if (signCode === 'CHILD') {
                        this.updateLayoutBlockDataById({layoutBlockId: this.layoutBlockId, key: 'layoutTemplate', value: 'LT_KID_6'});
                    }
                    if (id) {
                        let layoutBlock = this.activeLayout.find((item) => item.id === id);
                        if (layoutBlock) {
                            let putLayoutBlockRes = await this.$service.putLayoutBlock(id, layoutBlock);
                            if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                this.$message.success('保存成功');
                                this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        //  弹窗控制方法
        showSelectPersonDialog() {
            let layoutItemMultiList = _.get(this.layoutData, 'layoutItemMultiList');
            if (layoutItemMultiList) {
                this.layoutItemMultiList = _.cloneDeep(layoutItemMultiList);
            }
            this.selectPersonDialogVisible = true;
            window.addEventListener('keyup', this.keyupHandler);
        },
        closeDialog() {
            this.resetPerson();
            this.selectPersonDialogVisible = false;
            this.layoutItemMultiList = [];

            window.removeEventListener('keyup', this.keyupHandler);
        },
        dialogOpenHandler() {
            this.updatePagination({key: 'pageSize', value: 5});
            this.getPersonList({isProgramme: false, params: {visible: true}});
        },
        //  搜索人物的事件处理函数
        searchInputHandler(value, key) {
            this.updateSearchFields({key, value});
        },
        //  选择人物点击事件处理函数
        selectPersonClickHandler() {
            this.showSelectPersonDialog();
        },
        selectPersonEnterHandler() {
            if (this.layoutItemMultiList.length === 6) {
                this.updateLayoutBlockDataById({ layoutBlockId: this.layoutBlockId, key: 'layoutItemMultiList', value: _.cloneDeep(this.layoutItemMultiList) });
                this.closeDialog();
            } else {
                this.$message.error('必须选择6个人物');
                return false;
            }
        },
        searchEnterHandler() {
            this.getPersonList({isProgramme: false, params: {visible: true}});
        },
        deletePersonHandler(id) {
            this.layoutItemMultiList = this.layoutItemMultiList.filter((item) => item.id !== id);
        },
        toggleTagsField() {
            this.tagsFieldVisible = !this.tagsFieldVisible;
        },
        //  长传icon的成功回调函数
        uploadSuccessHandler(image) {
            this.updateLayoutBlockDataById({layoutBlockId: this.layoutBlockId, key: 'iconImage', value: image});
        },
        cancelHanlder() {
            this.closeDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.searchForm {
    margin-top: 20px;
}
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
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center center;
                .mask {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 4px;
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
.person-image {
    width: 80px;
    height: 80px;
}
</style>
