<!--  设置为节目的弹窗 -->
<template>
    <div class="edit-programme-container">
        <el-dialog
            title="设置为节目"
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
                    <el-step title="选择节目"></el-step>
                    <el-step title="选择图片"></el-step>
                    <el-step title="设置角标"></el-step>
                    <el-step title="设置展示方式"></el-step>
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
                        ref="multipleTable"
                        header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                        <el-table-column  align="center" label="选择">
                            <template slot-scope="scope">
                                <el-radio :value="getSquareProgrammeId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" align="center" width="120px" label="节目编号">
                            <template slot-scope="scope">
                                {{scope.row.code | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center" min-width="100px" label="节目名称">
                            <template slot-scope="scope">
                                {{scope.row.name | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column label="节目图片" width="100px" align="center" >
                            <template slot-scope="scope">
                                <img style="width:70px;height:auto;" @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                            </template>
                        </el-table-column>
                        <el-table-column prop="featureVideoCount" width="100px" align="center" label="正片数量">
                            <template slot-scope="scope">
                                {{scope.row.featureVideoCount | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" width="100px" label="分类">
                            <template slot-scope="scope">
                                <span class="ellipsis four">
                                    {{categoryListString(scope.row.categoryList) | padEmpty}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100px" label="类型">
                            <template slot-scope="scope">
                                <span class="ellipsis four">
                                    {{typeList(scope.row.id) | padEmpty}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100px" label="演员">
                            <template slot-scope="scope">
                                <span class="ellipsis four">
                                    {{getChiefActor(scope.row.id) | padEmpty}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="releaseStatus" min-width="100px" align="center" label="状态">
                            <template slot-scope="scope">
                                <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                                <i v-else class="off-the-shelf">已下架</i>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100px" label="更新时间">
                            <template slot-scope="scope">
                                {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handlePaginationChange($event, 'pageSize')"
                        @current-change="handlePaginationChange($event, 'pageNum')"
                        :current-page="programmePagination.pageNum"
                        :page-sizes="[5, 10, 20, 30, 50]"
                        :page-size="programmePagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="programmePagination.total">
                    </el-pagination>
                </div>
                <div v-show="active === 1" class="step-two">
                    <el-form class="my-el-form" status-icon label-width="120px" @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="非焦点图" required>
                                <single-image-uploader
                                    id="programmeImageUploaderOne"
                                    :uri="getImageByKey('coverImage') || ''"
                                    :uploadSuccessHandler="uploadProgrammeCoverImageSuccessHandler"
                                    :dimension="{width: 260, height: 260}"
                                    :allowResolutions="[{width: 260, height: 260}]"
                                ></single-image-uploader>
                            </el-form-item>
                            <el-form-item label="焦点图">
                                <single-image-uploader
                                    id="programmeImageUploaderTwo"
                                    :uri="getImageByKey('coverImageBackground') || ''"
                                    :uploadSuccessHandler="uploadProgrammeBgImageSuccessHandler"
                                    :dimension="{width: 260, height: 260}"
                                    :allowResolutions="[{width: 260, height: 260}]"
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
                                        <el-checkbox @change="markChangeHandler($event, 'leftTop')" :disabled="leftTopDisabled">
                                            左上角：播放平台
                                        </el-checkbox>
                                    </div>
                                    <div class="mark-item">
                                        <el-checkbox @change="markChangeHandler($event, 'rightTop')" :disabled="rightTopDisabled">
                                            右上角：
                                        </el-checkbox>
                                        <!--  此处需要增加一个选择框 -->
                                    </div>
                                    <div class="mark-item">
                                        <el-checkbox @change="markChangeHandler($event, 'leftBottom')" :disabled="leftBottomDisabled">
                                            左下角：更新
                                        </el-checkbox>
                                    </div>
                                    <div class="mark-item">
                                        <el-checkbox @change="markChangeHandler($event, 'rightBottom')" :disabled="rightBottomDisabled">
                                            右下角：评分
                                        </el-checkbox>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div v-show="active === 3" class="step-three">
                    <el-form status-icon label-width="120px" class="my-el-form" @submit.native.prevent>
                        <el-col :span="12">
                            <el-form-item label="节目展示方式">
                                    <el-radio @input="setSquareProgrammeLayoutItemType('PROGRAMME')" :value="getSquareProgrammeLayoutItemType" label="PROGRAMME">进入节目详情页</el-radio>
                                    <el-radio @input="setSquareProgrammeLayoutItemType('PROGRAMME_LIST')" :value="getSquareProgrammeLayoutItemType" label="PROGRAMME_LIST">进入节目列表页</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 3" class="btn-style-three" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 3" type="primary" @click="enterHandler">确 定</el-button>
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
    name: 'EditProgramme',
    props: {
        squareIndex: {
            type: Number,
            default: 0
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
            programme: {},
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
            list: 'programme/programmeList',
            programmePagination: 'programme/programmePagination',
            categoryListString: 'programme/categoryListString',
            typeList: 'programme/typeList',
            getChiefActor: 'programme/getChiefActor',
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
        leftTopDisabled() {
            return _.get(this.programme, 'platformList.length') === 0;
        },
        rightTopDisabled() {
            return false;
        },
        leftBottomDisabled() {
            return !(this.programme && this.programme.totalSets);
        },
        rightBottomDisabled() {
            return !(this.programme && this.programme.score);
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
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex'
        }),
        ...mapActions({
            getProgrammeList: 'programme/getProgrammeList',
            getProgrammeListByNews: 'programme/getProgrammeListByNews',
            getProgrammeCategory: 'programme/getProgrammeCategory'
        }),
        //  弹窗的操作
        async showDialog(category) {
            try {
                this.dialogVisible = true;
                await this.getProgrammeCategory();
                if (category) {
                    await this.getProgrammeListByNews();
                } else {
                    await this.getProgrammeList();
                }
            } catch (err) {
                console.log(err);
            }
        },
        closeDialog() {
            this.dialogVisible = false;
            this.active = 0;
            this.programme = {};
            this.previewImage = {
                title: '',
                display: false,
                uri: ''
            };
        },
        dialogOpenHandler() {
            // let {navbarId} = this.$route.params;
        },
        // 弹窗的操作结束
        handlePaginationChange(value, key) {
            this.updateProgrammePagination({key, value});
            this.getProgrammeList();
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
        setProgrammeSubjectHandler(programme) {
            let {navbarId, index} = this.$route.params;
            let {id, name} = programme;
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.programme = programme;
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
        //  节目展示的相关操作
        setSquareProgrammeLayoutItemType(layoutItemType) {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: layoutItemType });
        },
        //  最后一步的确认处理函数
        enterHandler() {
            let {navbarId, index} = this.$route.params;
            if (this.getSquareProgrammeLayoutItemType) {
                this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'PROGRAMME' });
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
