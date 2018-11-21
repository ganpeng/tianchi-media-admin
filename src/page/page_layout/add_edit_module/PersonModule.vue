<template>
    <div class="person-module-container">
        <h2 class="content-title">新增人物模块</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="personModule" status-icon ref="createPerson"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block">
                <el-col :span="8">
                    <el-form-item label="人物模块名称" prop="name" required>
                        <el-input
                            :value="personModule.name"
                            @input="inputHandler($event, 'name')"
                            placeholder="请输入人物姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="personModule.icon ? personModule.icon.uri : ''"
                            :uploadSuccessHandler="uploadSuccessHandler"
                            :dimension="{width: 40, height: 40}"
                            :allowResolutions="[{width: 200, height: 200}]"
                        ></single-image-uploader>
                    </el-form-item>
                    <el-form-item label="选择人物" required>
                        <el-button class="btn-style-two" @click="selectPersonClickHandler">选择人物</el-button>
                        <span class="my-tool-tips">只能选择6个人物</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label=" ">
                        <person-sortable-list></person-sortable-list>
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
            :before-close="closeSelectPersonDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <div class="my-tags-two-container">
                    <div class="header">
                        <span class="count">已选{{personModule.personList.length}}项</span>
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
                            v-for="(person, index) in personModule.personList"
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
                            :value="''"
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
                                @click="displayPerson(scope.row.id)"
                                class="ellipsis three name">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="照片" width="120px" align="center" >
                        <template slot-scope="scope">
                            <img v-if="scope.row.avatarImage" @click="displayImage(scope.row.avatarImage ? scope.row.avatarImage : {} )" width="100px" height="100px" class="pointer" :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
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
                    @size-change="handlePaginationChange($event, 'pageSize')"
                    @current-change="handlePaginationChange($event, 'pageNum')"
                    :current-page="pagination.pageNum"
                    :page-sizes="[5, 10, 20, 30, 50]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeSelectPersonDialog">取 消</el-button>
                    <el-button type="primary" @click="selectPersonEnterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
import PersonSortableList from './PersonSortableList';
export default {
    name: 'PersonModule',
    components: {
        SingleImageUploader,
        PreviewSingleImage,
        PersonSortableList
    },
    data() {
        return {
            selectPersonDialogVisible: false,
            tagsFieldVisible: false,
            previewImage: {
                title: '',
                display: false,
                uri: ''
            }
        };
    },
    created() {
        this.resetPersonModule();
        this.resetPerson();
        this.getPersonList({isProgramme: false});
    },
    computed: {
        ...mapGetters({
            personModule: 'pageLayout/personModule',
            searchFields: 'person/searchFields',
            list: 'person/list',
            mainRoleLabel: 'person/mainRoleLabel',
            pagination: 'person/pagination'
        }),
        checkIsChecked() {
            return (row) => {
                let index = this.personModule.personList.findIndex((person) => person.id === row.id);
                return index >= 0;
            };
        },
        disabled() {
            return (row) => {
                let index = this.personModule.personList.findIndex((person) => person.id === row.id);
                return index < 0 && this.personModule.personList.length > 5;
            };
        }
    },
    methods: {
        ...mapMutations({
            resetPersonModule: 'pageLayout/resetPersonModule',
            updatePersonModule: 'pageLayout/updatePersonModule',
            updatePagination: 'person/updatePagination',
            resetPerson: 'person/resetPerson',
            updateSearchFields: 'person/updateSearchFields',
            //  人物模块中人物的添加删除
            addPersonToPersonlistOfPersonModule: 'pageLayout/addPersonToPersonlistOfPersonModule',
            deletePersonFromPersonListOfPersonModule: 'pageLayout/deletePersonFromPersonListOfPersonModule'
            //  人物模块中人物的添加删除结束
        }),
        ...mapActions({
            getPersonList: 'person/getPersonList'
        }),
        inputHandler(value, key) {
            this.updatePersonModule({key, value});
        },
        handlePaginationChange(value, key) {
            this.updatePagination({value, key});
            this.getPersonList({isProgramme: false});
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
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
        },
        //  动态的为符合条件的行添加class
        tableRowClassName({row, rowIndex}) {
            let index = this.personModule.personList.findIndex((person) => person.id === row.id);
            return index >= 0 ? 'checked' : '';
        },
        checkHandler(value, person) {
            if (this.personModule.personList.length > 5 && value) {
                return false;
            }
            if (value) {
                this.addPersonToPersonlistOfPersonModule({person});
            } else {
                this.deletePersonFromPersonListOfPersonModule({id: person.id});
            }
        },
        saveHandler() { },
        //  弹窗控制方法
        showSelectPersonDialog() {
            this.selectPersonDialogVisible = true;
        },
        closeSelectPersonDialog() {
            this.resetPerson();
            this.selectPersonDialogVisible = false;
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
            this.closeSelectPersonDialog();
        },
        searchEnterHandler() {
            this.getPersonList({isProgramme: false});
        },
        deletePersonHandler(id) {
            this.deletePersonFromPersonListOfPersonModule({id});
        },
        toggleTagsField() {
            this.tagsFieldVisible = !this.tagsFieldVisible;
        },
        //  长传icon的成功回调函数
        uploadSuccessHandler(image) {
            this.updatePersonModule({key: 'icon', value: image});
        }
    }
};
</script>
<style lang="scss" scoped>
.searchForm {
    margin-top: 20px;
}
</style>
