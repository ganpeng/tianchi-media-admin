<!--专题基本信息表单组件-->
<template>
    <div class="text-left">
        <div class="content-sub-title">专题基本信息</div>
        <el-form
            :model="subjectInfo"
            :rules="infoRules"
            status-icon
            ref="subjectInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="专题名称" prop="name" required>
                <el-input v-model="subjectInfo.name" placeholder="请填写30个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="内容分类" prop="programmeCategoryList" required>
                <el-select v-model="programmeCategoryList" @change="setProgrammeCategoryList" multiple
                           placeholder="请选择内容分类">
                    <el-option
                        v-for="item in programmeCategoryListOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" required>
                <el-radio-group v-model="subjectInfo.visible">
                    <el-radio label="上架"></el-radio>
                    <el-radio label="下架"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="专题封面图" class="cover-image-block">
                <el-button
                    class="create-blue-btn contain-svg-icon" @click="popUploadImage('COVERIMAGE')">
                    <svg-icon icon-class="image"></svg-icon>
                    添加专题封面
                </el-button>
                <thumbnail
                    :imageList="subjectInfo.posterImageList"
                    v-on:removeImage="removePosterImage">
                </thumbnail>
            </el-form-item>
            <div class="content-sub-title">专题内节目
                <el-button @click="linkProgramme" class="page-vice-btn">关联节目</el-button>
            </div>
            <programme-operate-table
                v-if="selectedProgrammeList.length !== 0"
                model="CANCEL"
                v-on:cancelLinkProgramme="cancelLinkProgramme"
                :programmeList="selectedProgrammeList">
            </programme-operate-table>
            <div class="operate">
                <el-button type="primary" @click="operateSubject" class="page-main-btn">
                    {{this.status === '0' || this.status === '1' ? '创建' : '保存'}}
                </el-button>
                <el-button
                    @click="reset"
                    v-if="this.status === '0' || this.status === '1' "
                    class="page-main-btn"
                    type="primary"
                    plain>
                    重置
                </el-button>
                <el-button @click="toSubjectList" class="page-main-btn">返回列表页</el-button>
            </div>
        </el-form>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <el-dialog
            title="关联节目"
            :visible.sync="selectProgrammeVisible"
            width="80%">
            <select-multiple-programme
                v-if="selectProgrammeVisible"
                ref="selectMultipleProgramme"
                :selectedProgrammeList="selectedProgrammeList">
            </select-multiple-programme>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSelectProgramme">取消</el-button>
                <el-button type="primary" @click="confirmLinkProgramme">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Thumbnail from 'sysComponents/custom_components/custom/Thumbnail';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
    import SelectMultipleProgramme from './programme_subject/SelectMultipleProgramme';
    import ProgrammeOperateTable from './programme_subject/ProgrammeOperateTable';
    import {
        PROGRAMME_DIMENSION as SUBJECT_DIMENSION,
        SUBJECT_BACKGROUND_IMAGE_DIMENSION
    } from '@/util/config/dimension';

    export default {
        name: 'CreateSubjectForm',
        components: {
            PreviewMultipleImages,
            Thumbnail,
            SelectMultipleProgramme,
            ProgrammeOperateTable
        },
        /* status: 0代表创建节目专题，1代表创建人物专题，2代表编辑节目专题，3代表编辑人物专题 */
        props: ['status', 'subjectInfo'],
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('专题名称不能为空'));
                } else if (this.$util.trim(value).length > 30) {
                    return callback(new Error('专题名称不能超过30字'));
                } else {
                    callback();
                }
            };
            let checkProgrammeCategoryList = (rule, value, callback) => {
                // 对于创建或者编辑人物专题，不存在当前字段，也不校验
                if (this.status === '1' || this.status === '3') {
                    return;
                }
                if (this.programmeCategoryList.length === 0) {
                    return callback(new Error('请选择节目专题类别'));
                } else {
                    callback();
                }
            };
            return {
                uploadImageMode: 'COVERIMAGE',
                programmeCategoryList: [],
                programmeCategoryListOptions: [],
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    programmeCategoryList: [
                        {validator: checkProgrammeCategoryList, trigger: 'change'}
                    ]
                },
                // 关联节目弹框
                selectProgrammeVisible: false,
                subjectId: '',
                // 已选择的节目列表
                selectedProgrammeList: []
            };
        },
        computed: {
            size() {
                return this.uploadImageMode === 'COVERIMAGE' ? SUBJECT_DIMENSION : SUBJECT_BACKGROUND_IMAGE_DIMENSION;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            // 关联节目
            linkProgramme() {
                this.selectProgrammeVisible = true;
            },
            // 确认关联节目
            confirmLinkProgramme() {
                this.selectedProgrammeList = this.$refs.selectMultipleProgramme.getSelectedProgrammeList();
                this.selectProgrammeVisible = false;
                this.$message.success('成功关联节目');
            },
            // 选择节目取消
            cancelSelectProgramme() {
                this.selectProgrammeVisible = false;
            },
            // 已关联的节目取消节目关联
            cancelLinkProgramme(index) {
                let cancelLinkProgramme = this.selectedProgrammeList.splice(index, 1)[0];
                this.$message.success('"' + cancelLinkProgramme.name + '"' + '成功取消关联');
            },
            // 初始化数据
            init() {
                // 初始化专题类别
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryListOptions = response.data;
                    }
                });
            },
            setProgrammeCategoryList() {
                this.subjectInfo.programmeCategoryList = [];
                this.programmeCategoryList.map(categoryId => {
                    this.programmeCategoryListOptions.map(categoryOption => {
                        if (categoryId === categoryOption.id) {
                            this.subjectInfo.programmeCategoryList.push({
                                id: categoryId,
                                name: categoryOption.name
                            });
                        }
                    });
                });
            },
            // 初始化节目专题类别
            initProgrammeCatagoryList() {
                this.subjectInfo.programmeCategoryList.map(categoryItem => {
                    this.programmeCategoryList.push(categoryItem.id);
                });
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            popUploadImage(mode) {
                this.uploadImageMode = mode;
                this.imageUploadDialogVisible = true;
            },
            // 添加图片
            addPosterImage(newPosterImage) {
                // 添加封面图片
                if (this.uploadImageMode === 'COVERIMAGE') {
                    for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                        if (newPosterImage.posterImage.id === this.subjectInfo.posterImageList[i].id) {
                            this.$message('该图片已经添加到当前专题中');
                            return;
                        }
                    }
                    this.subjectInfo.posterImageList.push(newPosterImage.posterImage);
                    return;
                }
                // 添加背景图片
                if (this.uploadImageMode === 'BACKGROUNDIMAGE') {
                    this.subjectInfo.backgroundImage = newPosterImage.posterImage;
                }
            },
            // 删除封面图片
            removePosterImage(index) {
                this.$confirm('此操作将删除该封面图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.subjectInfo.posterImageList.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 删除背景图片
            removeBackgroundImage() {
                this.$confirm('此操作将删除该背景图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.subjectInfo.backgroundImage = {};
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 创建或更新专题
            operateSubject() {
                this.$refs['subjectInfo'].validate((valid) => {
                    if (valid) {
                        // 创建专题
                        if (this.status === '0' || this.status === '1') {
                            this.subjectInfo.category = this.status === '0' ? 'PROGRAMME' : 'FIGURE';
                            this.$service.createSubject(this.subjectInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.subjectId = response.data.id;
                                    this.dialogVisible = true;
                                }
                            });
                        } else {
                            // 更新专题
                            this.subjectInfo.id = this.$route.params.id;
                            this.$service.updateSubjectBasicInfo(this.subjectInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.subjectId = response.data.id;
                                    this.dialogVisible = true;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.subjectInfo.posterImageList;
                this.previewImage.activeIndex = index;
            },
            reset() {
                this.$refs['subjectInfo'].resetFields();
                this.programmeCategoryList = [];
            },
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .cover-image-block, .bg-box {
        margin-bottom: 40px;
        .el-button {
            margin-bottom: 30px;
        }
    }

    // 图片信息
    .info {
        &.background {
            width: 40%;
        }
        .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        div {
            display: flex;
            justify-content: space-between;
            height: 32px;
        }
        label {
            font-size: 14px;
            &.remove {
                color: #409EFF;
                cursor: pointer;
            }
        }
    }

    .background-image {
        width: 40%;
        padding-top: 23%;
        height: 0px;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }

    .image-box {
        height: 150px;
        width: 150px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        cursor: zoom-in;
    }

    .operate {
        margin-top: 200px;
        margin-bottom: 80px;
    }

</style>
