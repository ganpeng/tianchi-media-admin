<!--  设置为节目专题的弹窗 -->
<template>
    <div class="edit-programme-subject-container">
        <el-dialog
            title="设置为节目专题"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <el-steps class="my-steps" :active="active" finish-status="success">
                    <el-step title="选择节目专题"></el-step>
                    <el-step title="选择图片"></el-step>
                    <el-step title="设置角标"></el-step>
                </el-steps>
                <div class="seperator-line"></div>
                <div v-show="active === 0" class="step-one">
                    <el-form class="my-el-form" :inline="true" @submit.native.prevent>
                        <el-form-item>
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
                        :header-row-class-name='"common-table-header"' class="my-table-style" :data="programmeSubject.list" border>
                        <el-table-column align="center" width="60px" label="选择">
                            <template slot-scope="scope">
                                <el-radio :value="getSquareProgrammeId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" align="center" width="120px" label="编号">
                            <template slot-scope="scope">
                                {{scope.row.id | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="专题名称">
                            <template slot-scope="scope">
                                    {{scope.row.name | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="内容数量">
                            <template slot-scope="scope">
                                    {{scope.row.itemCount | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="内容类型">
                            <template slot-scope="scope">
                                    {{scope.row.programmeCategoryList.map((item) => item.name).join(', ') | padEmpty}}
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
                        :current-page="programmeSubject.pagination.pageNum"
                        :page-sizes="[5, 10, 20, 30, 50]"
                        :page-size="programmeSubject.pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="programmeSubject.pagination.total">
                    </el-pagination>
                </div>
                <div v-show="active === 1" class="step-two">
                    <el-form class="my-el-form" status-icon label-width="120px" @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="非焦点图" required>
                                <single-image-uploader
                                    id="programmeSubjectImageUploaderOne"
                                    :uri="getImageByKey('coverImage') || ''"
                                    :uploadSuccessHandler="uploadProgrammeCoverImageSuccessHandler"
                                    :allowResolutions="allowResolutions"
                                ></single-image-uploader>
                            </el-form-item>
                            <el-form-item label="焦点图">
                                <single-image-uploader
                                    id="programmeSubjectImageUploaderTwo"
                                    :uri="getImageByKey('coverImageBackground') || ''"
                                    :uploadSuccessHandler="uploadProgrammeBgImageSuccessHandler"
                                    :allowResolutions="allowResolutions"
                                ></single-image-uploader>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div v-show="active === 2" class="step-three">
                    <el-form status-icon label-width="120px" class="my-el-form" @submit.native.prevent>
                        <el-col :span="12">
                            <el-form-item label="节目角标">
                                <div class="mark-container">
                                    <div class="mark-item">
                                        <el-checkbox @change="markChangeHandler($event, 'rightTop')" :disabled="rightTopDisabled">
                                            右上角：
                                        </el-checkbox>
                                        <!--  此处需要增加一个选择框 -->
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 2" class="btn-style-three" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 2" type="primary" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
export default {
    name: 'EditProgrammeSubject',
    props: {
        squareIndex: {
            type: Number,
            default: 0
        },
        allowResolutions: {
            type: Array,
            default: () => []
        }
    },
    components: {
        PreviewSingleImage,
        SingleImageUploader
    },
    data() {
        return {
            active: 0,
            dialogVisible: false,
            programmeSubjectData: {},
            layoutItem: {},
            previewImage: {
                title: '',
                display: false,
                uri: ''
            }
        };
    },
    computed: {
        ...mapGetters({
            programmeSubject: 'pageLayout/programmeSubject',
            layout: 'pageLayout/layout'
        }),
        checkIsChecked() {
            return (row) => {
                return true;
            };
        },
        isDisabled() {
            return (row) => {
                return false;
            };
        },
        getImageByKey() {
            return (key) => {
                let {navbarId, index} = this.$route.params;
                return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
            };
        },
        rightTopDisabled() {
            return false;
        },
        getSquareProgrammeId() {
            let {navbarId, index} = this.$route.params;
            return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.id`);
        },
        getSquareProgrammeLayoutItemType() {
            let {navbarId, index} = this.$route.params;
            return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.layoutItemType`);
        }
    },
    methods: {
        ...mapMutations({
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            resetProgrammeSubject: 'pageLayout/resetProgrammeSubject',
            resetProgrammeSubjectModule: 'pageLayout/resetProgrammeSubjectModule',
            updateProgrammeSubject: 'pageLayout/updateProgrammeSubject',
            updateProgrammeSubjectModule: 'pageLayout/updateProgrammeSubjectModule',
            updateProgrammeSubjectPagination: 'pageLayout/updateProgrammeSubjectPagination',
            addImageToProgrammeSubjectListById: 'pageLayout/addImageToProgrammeSubjectListById',
            //  人物模块中人物的添加删除
            updateLayoutItemMultiListByIndex: 'pageLayout/updateLayoutItemMultiListByIndex'
            //  人物模块中人物的添加删除结束

        }),
        ...mapActions({
            getProgrammeSubjectList: 'pageLayout/getProgrammeSubjectList',
            updateProgrammeSubjectById: 'pageLayout/updateProgrammeSubjectById'
        }),
        //  弹窗的操作
        showDialog() {
            this.dialogVisible = true;
            this.getProgrammeSubjectList();
        },
        closeDialog() {
            this.dialogVisible = false;
            this.active = 0;
            this.programmeSubjectData = {};
            this.previewImage = {
                title: '',
                display: false,
                uri: ''
            };
        },
        dialogOpenHandler() {
            // let {navbarId} = this.$route.params;
            console.log(this.getSquareProgrammeId);
        },
        // 弹窗的操作结束
        handlePaginationChange(value, key) {
            this.updateProgrammeSubjectPagination({key, value});
            this.getProgrammeSubjectList();
        },
        //  上下步的处理方法
        prevBtnClickHandler() {
            if (this.active > 0) {
                this.active--;
            }
        },
        nextBtnClickHandler() {
            if (this.active < 3) {
                if (this.active === 0) {
                    if (this.getSquareProgrammeId) {
                        this.active++;
                    } else {
                        this.$message.error('请选择节目');
                        return false;
                    }
                } else if (this.active === 1) {
                    if (this.getImageByKey('coverImage')) {
                        this.active++;
                    } else {
                        this.$message.error('请上传非焦点图');
                        return false;
                    }
                } else {
                    this.active++;
                }
            }
        },
        //  节目列表搜索
        searchInputHandler() {},
        setProgrammeSubjectHandler(programmeSubjectData) {
            let {navbarId, index} = this.$route.params;
            let {id, name} = programmeSubjectData;
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.programmeSubjectData = programmeSubjectData;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeId ? 'checked' : '';
        },
        searchEnterHandler() {},
        //  查看图片
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
        },
        //  图片上传成功之后的毁掉
        uploadProgrammeCoverImageSuccessHandler(image) {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemByIndex({
                navbarId,
                index,
                squareIndex: this.squareIndex,
                key: 'coverImage',
                value: image
            });
        },
        uploadProgrammeBgImageSuccessHandler(image) {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemByIndex({
                navbarId,
                index,
                squareIndex: this.squareIndex,
                key: 'coverImageBackground',
                value: image
            });
        },
        //  角标的相关操作
        markChangeHandler() {
            // this.updateProgrammeMark({checked, key});
        },
        //  最后一步的确认处理函数
        enterHandler() {
            let {navbarId, index} = this.$route.params;
            if (this.getSquareProgrammeLayoutItemType) {
                this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'PROGRAMME_SUBJECT' });
                this.closeDialog();
            } else {
                this.$message.error('请选择节目展示方式');
                return false;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.my-el-form {
    overflow: hidden;
    margin-top: 20px;
    .mark-container {
        display: flex;
        flex-wrap: wrap;
        .mark-item {
            font-size: 16px;
            color: #A8ABB3;
            width: 45%;
            .el-checkbox {
                padding: 0;
            }
        }
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #fff!important;
    }
}
</style>
