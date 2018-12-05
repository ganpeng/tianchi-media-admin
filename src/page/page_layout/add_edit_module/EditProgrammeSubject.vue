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
                    <div v-if="showExist">
                        <p class="table-title">已选择的节目专题</p>
                        <el-table
                            :row-class-name="tableRowClassName"
                            :header-row-class-name='"common-table-header"' class="my-table-style" :data="checkedProgrammeSubjectList" border>
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
                        <div class="btn-wrapper text-center">
                            <el-button @click="changeProgrammeHandler" class="btn-style-two">更换专题</el-button>
                        </div>
                    </div>
                    <div v-else class="step-one-wrapper">
                        <el-form class="my-el-form" :inline="true" @submit.native.prevent>
                            <el-form-item>
                                <el-input
                                    placeholder="搜索你想要的信息"
                                    clearable
                                    class="border-input"
                                    :value="programmeSubject.keyword"
                                    @input="searchInputHandler($event, 'keyword')"
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
                                    <el-radio :value="getSquareProgrammeSubjectId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
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
                        <el-col :span="14">
                            <el-form-item label="右上角角标">
                                <div class="mark-container">
                                    <div class="mark-item">
                                        <el-select
                                            @input="customMarkSelectHandler"
                                            :value="rightTop"
                                            value-key="id"
                                            clearable
                                            placeholder="请选择">
                                            <el-option
                                                v-for="item in customMarkOptions"
                                                :key="item.id"
                                                :label="item.caption"
                                                :value="item">
                                            </el-option>
                                        </el-select>
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
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
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
        SingleImageUploader
    },
    data() {
        return {
            navbarId: '',
            index: '',
            showExist: false,
            active: 0,
            dialogVisible: false,
            programmeSubjectData: {},
            customMarkOptions: []
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({
            programmeSubject: 'pageLayout/programmeSubject',
            layout: 'pageLayout/layout',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark'
        }),
        rightTop() {
            let {rightTop} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            return _.isEmpty(rightTop) ? {} : rightTop;
        },
        getImageByKey() {
            return (key) => {
                return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
            };
        },
        getSquareProgrammeSubjectId() {
            return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.id`);
        },
        checkedProgrammeSubjectList() {
            if (this.getSquareProgrammeSubjectId && !_.isEmpty(this.programmeSubjectData)) {
                return [this.programmeSubjectData];
            } else {
                return [];
            }
        }
    },
    methods: {
        ...mapMutations({
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            resetProgrammeSubject: 'pageLayout/resetProgrammeSubject',
            updateProgrammeSubject: 'pageLayout/updateProgrammeSubject',
            updateProgrammeSubjectPagination: 'pageLayout/updateProgrammeSubjectPagination',
            updateLayoutItemCornerMarkByIndex: 'pageLayout/updateLayoutItemCornerMarkByIndex'

        }),
        ...mapActions({
            getProgrammeSubjectList: 'pageLayout/getProgrammeSubjectList',
            getCustomMarkList: 'pageLayout/getCustomMarkList'
        }),
        //  弹窗的操作
        showDialog() {
            this.dialogVisible = true;
            this.getProgrammeSubjectList();
        },
        closeDialog() {
            this.resetProgrammeSubject();
            this.dialogVisible = false;
            this.active = 0;
            this.showExist = false;
            this.programmeSubjectData = {};
        },
        async dialogOpenHandler() {
            try {
                if (this.getSquareProgrammeSubjectId) {
                    let res = await this.$service.getSubjectById(this.getSquareProgrammeSubjectId);
                    if (res && res.code === 0) {
                        this.programmeSubjectData = res.data;
                        this.showExist = true;
                    }
                }
                let markRes = await this.getCustomMarkList();
                if (markRes && markRes.code === 0) {
                    this.customMarkOptions = markRes.data;
                }
            } catch (err) {
                console.log(err);
            }
        },
        changeProgrammeHandler() {
            this.showExist = false;
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
            if (this.active < 2) {
                if (this.active === 0) {
                    if (this.getSquareProgrammeSubjectId) {
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
        searchInputHandler(value, key) {
            this.updateProgrammeSubject({key, value});
        },
        searchEnterHandler() {
            this.getProgrammeSubjectList();
        },
        setProgrammeSubjectHandler(programmeSubjectData) {
            let {id, name} = programmeSubjectData;
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.programmeSubjectData = programmeSubjectData;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeSubjectId ? 'checked' : '';
        },
        //  图片上传成功之后的毁掉
        uploadProgrammeCoverImageSuccessHandler(image) {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'coverImage',
                value: image
            });
        },
        uploadProgrammeBgImageSuccessHandler(image) {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'coverImageBackground',
                value: image
            });
        },
        //  角标的相关操作
        customMarkSelectHandler(mark) {
            this.updateLayoutItemCornerMarkByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'rightTop',
                value: _.isEmpty(mark) ? {} : mark
            });
        },
        //  最后一步的确认处理函数
        enterHandler() {
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'PROGRAMME_SUBJECT' });
            this.closeDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.my-el-form {
    overflow: hidden;
    margin-top: 20px;
}
</style>
