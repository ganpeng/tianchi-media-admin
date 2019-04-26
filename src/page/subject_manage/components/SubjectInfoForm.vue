<!--专题信息表单组件-->
<template>
    <div id="subject-container">
        <div class="seperator-line"></div>
        <div class="content-sub-title">专题基本信息</div>
        <el-form
            :model="subjectInfo"
            :rules="infoRules"
            status-icon
            ref="subjectInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="专题名称" prop="name" required>
                <el-input
                    v-model="subjectInfo.name"
                    size="medium"
                    placeholder="请填写30个字以内的名称">
                </el-input>
            </el-form-item>
            <el-form-item label="内容分类" prop="programmeCategoryList" required>
                <el-select
                    v-model="programmeCategoryList"
                    @change="setProgrammeCategoryList"
                    multiple
                    size="medium"
                    placeholder="请选择专题内容分类">
                    <el-option
                        v-for="item in programmeCategoryListOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="专题标签" prop="tagList">
                <el-select
                    v-model="subjectInfo.tagList"
                    multiple
                    class="multiple-select"
                    size="medium"
                    placeholder="请选择专题标签">
                    <el-option
                        v-for="item in tagOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-button
                    type="primary"
                    class="btn-style-four min"
                    @click="addSubjectTag">
                    新增
                </el-button>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="subjectInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="适用客户端" prop="applicableClientList" required>
                <el-checkbox-group v-model="subjectInfo.applicableClientList">
                    <el-checkbox label="TV"></el-checkbox>
                    <el-checkbox label="APP"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <!--设置节目专题封面图片-->
            <el-form-item
                label="TV端海报"
                required
                prop="posterImageList"
                class="image-setting-box"
                v-if="status === 'CREATE_PROGRAMME' || status === 'EDIT_PROGRAMME'">
                <label class="tips"> (1920*1080 背景图必传)</label>
                <multi-image-uploader
                    id="subject-programme-tv"
                    :imageList="subjectInfo.posterImageList"
                    :deleteImageHandler="removePosterImageForTV"
                    :imageUploadedHandlerForTV="imageUploadedHandlerForTV"
                    :allowResolutions="programmeAllowResolutionsForTV"
                    :validator="imageUploadValidatorForTV">
                </multi-image-uploader>
            </el-form-item>
            <el-form-item
                label="APP端海报"
                required
                prop="posterImageListForApp"
                class="image-setting-box"
                v-if="status === 'CREATE_PROGRAMME' || status === 'EDIT_PROGRAMME'">
                <label class="tips"> (1125*2436 图必传)</label>
                <multi-image-uploader
                    id="subject-programme-app"
                    :imageList="subjectInfo.posterImageListForApp"
                    :deleteImageHandler="removePosterImageForApp"
                    :imageUploadedHandler="imageUploadedHandlerForApp"
                    :allowResolutions="programmeAllowResolutionsForApp"
                    :validator="imageUploadValidatorForApp">
                </multi-image-uploader>
            </el-form-item>
            <!--设置人物专题封面图片-->
            <el-form-item
                label="TV端海报"
                required
                prop="posterImageList"
                class="image-setting-box"
                v-if="status === 'CREATE_FIGURE' || status === 'EDIT_FIGURE'">
                <label class="tips"> (260*600 专题E 必传)</label>
                <multi-image-uploader
                    id="subject-figure-tv"
                    :imageList="subjectInfo.posterImageList"
                    :dimension="{width:'168',height:'180'}"
                    :deleteImageHandler="removePosterImageForTV"
                    :imageUploadedHandler="imageUploadedHandlerForTV"
                    :allowResolutions="figureAllowResolutionsForTV"
                    :validator="imageUploadValidatorForTV">
                </multi-image-uploader>
            </el-form-item>
            <el-form-item
                label="APP端海报"
                required
                prop="posterImageListForApp"
                class="image-setting-box"
                v-if="status === 'CREATE_FIGURE' || status === 'EDIT_FIGURE'">
                <label class="tips"> (1125*786 图必传)</label>
                <multi-image-uploader
                    id="subject-figure-app"
                    :imageList="subjectInfo.posterImageListForApp"
                    :deleteImageHandler="removePosterImageForApp"
                    :imageUploadedHandler="imageUploadedHandlerForApp"
                    :allowResolutions="figureAllowResolutionsForApp"
                    :validator="imageUploadValidatorForApp">
                </multi-image-uploader>
            </el-form-item>
            <!--专题关联节目-->
            <div class="content-sub-title subject-programme-list">专题内节目
                <el-button @click="selectProgrammeVisible = true" class="contain-svg-icon btn-style-four">
                    <svg-icon icon-class="link_programme"></svg-icon>
                    关联节目
                </el-button>
            </div>
            <programme-operate-table
                v-if="subjectInfo.subjectItemList && subjectInfo.subjectItemList.length !== 0"
                model="CANCEL"
                v-on:cancelLinkProgramme="cancelLinkProgramme"
                :programmeList="subjectInfo.subjectItemList">
            </programme-operate-table>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateSubject" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toSubjectList" plain>返回列表</el-button>
        </div>
        <el-dialog
            title="关联节目"
            :visible.sync="selectProgrammeVisible"
            :close-on-click-modal=false
            custom-class="normal-dialog"
            top="13vh"
            width="80%">
            <select-multiple-programme
                v-if="selectProgrammeVisible"
                ref="selectMultipleProgramme"
                :selectedProgrammeList="subjectInfo.subjectItemList">
            </select-multiple-programme>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectProgrammeVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmLinkProgramme">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import SelectMultipleProgramme from './SelectMultipleProgramme';
    import ProgrammeOperateTable from './ProgrammeOperateTable';
    import MultiImageUploader from 'sysComponents/custom_components/custom/MultiImageUploader';
    import {
        PROGRAMME_SUBJECT_DIMENSION,
        FIGURE_SUBJECT_DIMENSION
    } from '@/util/config/dimension';
    import _ from 'lodash';

    export default {
        name: 'SubjectInfoForm',
        components: {
            SelectMultipleProgramme,
            ProgrammeOperateTable,
            MultiImageUploader
        },
        /* status: 'CREATE_PROGRAMME'代表创建节目专题，'CREATE_FIGURE'代表创建人物专题，'EDIT_PROGRAMME'代表编辑节目专题，'EDIT_FIGURE'代表编辑人物专题 */
        props: {
            status: {
                type: String,
                default: ''
            },
            subjectInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
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
                if (this.programmeCategoryList.length === 0) {
                    return callback(new Error('请选择专题内容分类'));
                } else {
                    callback();
                }
            };
            let checkVisible = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择专题状态'));
                } else {
                    callback();
                }
            };
            let checkApplicableClientList = (rule, value, callback) => {
                if (!value[0]) {
                    return callback(new Error('请选择适用客户端'));
                } else {
                    callback();
                }
            };
            let checkPosterImageListForTV = (rule, value, callback) => {
                if (this.subjectInfo.posterImageList.length === 0) {
                    return callback(new Error('请添加TV端海报'));
                }
                if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                    // 有且只有一个背景图
                    let m = 0;
                    this.subjectInfo.posterImageList.map(posterImage => {
                        if (posterImage.width.toString() === '1920' && posterImage.height.toString() === '1080') {
                            m++;
                        }
                    });
                    switch (m) {
                        case 0:
                            return callback(new Error('请上传1920*1080TV端专题背景图'));
                        case 1:
                            callback();
                            break;
                        default:
                            return callback(new Error('1920*1080TV端专题背景图有且只能有一张'));
                    }
                }
                if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                    // 有且只有一个
                    let i = 0;
                    this.subjectInfo.posterImageList.map(posterImage => {
                        if (posterImage.width.toString() === '260' && posterImage.height.toString() === '600') {
                            i++;
                        }
                    });
                    switch (i) {
                        case 0:
                            return callback(new Error('请上传260*600TV端专题E图'));
                        case 1:
                            callback();
                            break;
                        default:
                            return callback(new Error('260*600TV端专题E图有且只能有一张'));
                    }
                }
            };
            let checkPosterImageListForApp = (rule, value, callback) => {
                if (this.subjectInfo.posterImageListForApp.length === 0) {
                    return callback(new Error('请添加App端海报'));
                }
                if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                    let m = 0;
                    this.subjectInfo.posterImageListForApp.map(posterImage => {
                        if (posterImage.width.toString() === '1125' && posterImage.height.toString() === '2436') {
                            m++;
                        }
                    });
                    switch (m) {
                        case 0:
                            return callback(new Error('请上传1125*2436App端专题海报'));
                        case 1:
                            callback();
                            break;
                        default:
                            return callback(new Error('1125*2436App端专题海报有且只能有一张'));
                    }
                }
                if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                    // 有且只有一个
                    let i = 0;
                    this.subjectInfo.posterImageListForApp.map(posterImage => {
                        if (posterImage.width.toString() === '1125' && posterImage.height.toString() === '786') {
                            i++;
                        }
                    });
                    switch (i) {
                        case 0:
                            return callback(new Error('请上传1125*786App端专题海报'));
                        case 1:
                            callback();
                            break;
                        default:
                            return callback(new Error('1125*786App端专题海报有且只能有一张'));
                    }
                }
            };
            return {
                isLoading: false,
                programmeAllowResolutionsForTV: PROGRAMME_SUBJECT_DIMENSION.tv,
                programmeAllowResolutionsForApp: PROGRAMME_SUBJECT_DIMENSION.app,
                figureAllowResolutionsForTV: FIGURE_SUBJECT_DIMENSION.tv,
                figureAllowResolutionsForApp: FIGURE_SUBJECT_DIMENSION.app,
                programmeCategoryList: [],
                programmeCategoryListOptions: [],
                tagOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    programmeCategoryList: [
                        {validator: checkProgrammeCategoryList, trigger: 'change'}
                    ],
                    visible: [
                        {validator: checkVisible, trigger: 'change'}
                    ],
                    applicableClientList: [
                        {validator: checkApplicableClientList, trigger: 'change'}
                    ],
                    posterImageList: [
                        {validator: checkPosterImageListForTV, trigger: 'blur'}
                    ],
                    posterImageListForApp: [
                        {validator: checkPosterImageListForApp, trigger: 'blur'}
                    ]
                },
                selectProgrammeVisible: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                // 初始化专题标签列表
                this.$service.getSubjectTagList().then(response => {
                    if (response) {
                        this.tagOptions = response.data;
                    }
                });
                // 初始化专题类别
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryListOptions = response.data;
                    }
                });
            },
            // 初始化节目专题类别
            initProgrammeCatagoryList() {
                this.subjectInfo.programmeCategoryList.map(categoryItem => {
                    this.programmeCategoryList.push(categoryItem.id);
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
            // 确认关联节目
            confirmLinkProgramme() {
                this.subjectInfo.subjectItemList = this.$refs.selectMultipleProgramme.getSelectedProgrammeList();
                this.selectProgrammeVisible = false;
                this.$message.success('成功关联节目');
            },
            // 已关联的节目取消节目关联
            cancelLinkProgramme(index) {
                let cancelLinkProgramme = this.subjectInfo.subjectItemList.splice(index, 1)[0];
                this.$message.success('"' + cancelLinkProgramme.name + '"' + '成功取消关联');
            },
            // 添加专题的标签
            addSubjectTag() {
                this.$prompt('请输入专题标签', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '专题标签不能为空'
                }).then(({value}) => {
                    let sign = true;
                    this.tagOptions.map(tag => {
                        if (tag === value) {
                            sign = false;
                        }
                    });
                    if (sign) {
                        this.tagOptions.push(value);
                        this.$message.success(value + '标签已添加');
                    } else {
                        this.$message.warning(value + '标签重复');
                    }
                });
            },
            // 成功上传图片
            imageUploadedHandlerForTV(image) {
                // 人物专题的唯一尺寸图片的替换
                if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                    if (image.width.toString() === '260' && image.height.toString() === '600') {
                        let tag = false;
                        for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                            if (this.subjectInfo.posterImageList[i].width.toString() === '260' && this.subjectInfo.posterImageList[i].height.toString() === '600') {
                                this.subjectInfo.posterImageList[i] = image;
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.subjectInfo.posterImageList.push(image);
                        }
                    } else {
                        this.subjectInfo.posterImageList.push(image);
                    }
                }
                // 节目专题的唯一尺寸图片的替换
                if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                    if (image.width.toString() === '1920' && image.height.toString() === '1080') {
                        let tag = false;
                        for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                            if (this.subjectInfo.posterImageList[i].width.toString() === '1920' && this.subjectInfo.posterImageList[i].height.toString() === '1080') {
                                this.subjectInfo.posterImageList[i] = image;
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.subjectInfo.posterImageList.push(image);
                        }
                    } else {
                        this.subjectInfo.posterImageList.push(image);
                    }
                }
                this.subjectInfo.posterImageList = _.uniqBy(this.subjectInfo.posterImageList, 'id');
                if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                    this.resortImageList('260', '600', 'TV');
                } else {
                    this.resortImageList('1920', '1080', 'TV');
                }
            },
            // 成功上传图片
            imageUploadedHandlerForApp(image) {
                // 人物专题的唯一尺寸图片的替换
                if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                    if (image.width.toString() === '1125' && image.height.toString() === '786') {
                        let tag = false;
                        for (let i = 0; i < this.subjectInfo.posterImageListForApp.length; i++) {
                            if (this.subjectInfo.posterImageListForApp[i].width.toString() === '1125' && this.subjectInfo.posterImageListForApp[i].height.toString() === '786') {
                                this.subjectInfo.posterImageListForApp[i] = image;
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.subjectInfo.posterImageListForApp.push(image);
                        }
                    } else {
                        this.subjectInfo.posterImageListForApp.push(image);
                    }
                }
                // 节目专题的唯一尺寸图片的替换
                if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                    if (image.width.toString() === '1125' && image.height.toString() === '2436') {
                        let tag = false;
                        for (let i = 0; i < this.subjectInfo.posterImageListForApp.length; i++) {
                            if (this.subjectInfo.posterImageListForApp[i].width.toString() === '1125' && this.subjectInfo.posterImageListForApp[i].height.toString() === '2436') {
                                this.subjectInfo.posterImageListForApp[i] = image;
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.subjectInfo.posterImageListForApp.push(image);
                        }
                    } else {
                        this.subjectInfo.posterImageListForApp.push(image);
                    }
                }
                this.subjectInfo.posterImageListForApp = _.uniqBy(this.subjectInfo.posterImageListForApp, 'id');
                if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                    this.resortImageList('1125', '786', 'APP');
                } else {
                    this.resortImageList('1125', '2436', 'APP');
                }
            },
            resortImageList(width, height, endName) {
                let featureImageArray = [];
                switch (endName) {
                    case 'TV':
                        // 人物专题根据尺寸将260*600的图片放置在数组前面,节目专题将1920*1080放在前面
                        for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                            if (this.subjectInfo.posterImageList[i].width.toString() === width && this.subjectInfo.posterImageList[i].height.toString() === height) {
                                featureImageArray.push(this.subjectInfo.posterImageList[i]);
                            }
                        }
                        this.removeFeatureImage(width, height, endName);
                        this.subjectInfo.posterImageList = featureImageArray.concat(this.subjectInfo.posterImageList);
                        break;
                    case 'APP':
                        for (let i = 0; i < this.subjectInfo.posterImageListForApp.length; i++) {
                            if (this.subjectInfo.posterImageListForApp[i].width.toString() === width && this.subjectInfo.posterImageListForApp[i].height.toString() === height) {
                                featureImageArray.push(this.subjectInfo.posterImageListForApp[i]);
                            }
                        }
                        this.removeFeatureImage(width, height, endName);
                        this.subjectInfo.posterImageListForApp = featureImageArray.concat(this.subjectInfo.posterImageListForApp);
                        break;
                    default:
                        break;
                }
            },
            removeFeatureImage(width, height, endName) {
                switch (endName) {
                    case 'TV':
                        for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                            if (this.subjectInfo.posterImageList[i].width.toString() === width && this.subjectInfo.posterImageList[i].height.toString() === height) {
                                this.subjectInfo.posterImageList.splice(i, 1);
                                this.removeFeatureImage(width, height, endName);
                                return;
                            }
                        }
                        break;
                    case 'APP':
                        for (let i = 0; i < this.subjectInfo.posterImageListForApp.length; i++) {
                            if (this.subjectInfo.posterImageListForApp[i].width.toString() === width && this.subjectInfo.posterImageListForApp[i].height.toString() === height) {
                                this.subjectInfo.posterImageListForApp.splice(i, 1);
                                this.removeFeatureImage(width, height, endName);
                                return;
                            }
                        }
                        break;
                    default:
                        break;
                }
            },
            imageUploadValidatorForTV(fileList) {
                let onlyFileListOne = fileList.filter((item) => {
                    let {width, height} = item.demension;
                    if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                        return parseInt(width) === 260 && parseInt(height) === 600;
                    } else {
                        return parseInt(width) === 1920 && parseInt(height) === 1080;
                    }
                });
                if (onlyFileListOne.length > 1) {
                    this.$message.error(this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE' ? '260*600专题E图只能上传一张' : '1920*1080专题背景图只能有上传一张');
                    return false;
                }
                return true;
            },
            imageUploadValidatorForApp(fileList) {
                let onlyFileListOne = fileList.filter((item) => {
                    let {width, height} = item.demension;
                    if (this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE') {
                        return parseInt(width) === 1125 && parseInt(height) === 786;
                    } else {
                        return parseInt(width) === 1125 && parseInt(height) === 2436;
                    }
                });
                if (onlyFileListOne.length > 1) {
                    this.$message.error(this.status === 'CREATE_FIGURE' || this.status === 'EDIT_FIGURE' ? '1125*786图只能上传一张' : '1125*2436图只能有上传一张');
                    return false;
                }
                return true;
            },
            // 删除封面图片
            removePosterImageForTV(imageId) {
                let index;
                for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                    if (this.subjectInfo.posterImageList[i].id === imageId) {
                        index = i;
                    }
                }
                this.subjectInfo.posterImageList.splice(index, 1);
                this.$message.success('图片删除成功!');
            },
            // 删除封面图片
            removePosterImageForApp(imageId) {
                let index;
                for (let i = 0; i < this.subjectInfo.posterImageListForApp.length; i++) {
                    if (this.subjectInfo.posterImageListForApp[i].id === imageId) {
                        index = i;
                    }
                }
                this.subjectInfo.posterImageListForApp.splice(index, 1);
                this.$message.success('图片删除成功!');
            },
            // 创建或更新专题
            operateSubject() {
                this.$refs['subjectInfo'].validate((valid) => {
                    if (valid) {
                        if (!this.subjectInfo.subjectItemList || this.subjectInfo.subjectItemList.length === 0) {
                            this.$message.warning('请关联相关节目');
                            return;
                        }
                        // 设置节目专题的背景图片
                        if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                            this.subjectInfo.posterImageList.map(image => {
                                if (image.width.toString() === '1920' && image.height.toString() === '1080') {
                                    this.subjectInfo.backgroundImage = image;
                                }
                            });
                        }
                        this.isLoading = true;
                        // 创建专题
                        if (this.status === 'CREATE_PROGRAMME' || this.status === 'CREATE_FIGURE') {
                            this.subjectInfo.category = this.status === 'CREATE_PROGRAMME' ? 'PROGRAMME' : 'FIGURE';
                            this.$service.createSubject(this.subjectInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建专题');
                                    this.toSubjectList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        } else {
                            this.$service.updateSubjectInfo(this.subjectInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新专题');
                                    this.toSubjectList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-radio-group {
        .el-radio {
            padding: 0px;
        }
    }

    .add-tag {
        margin-left: 20px;
    }

    .image-setting-box {
        margin-bottom: 30px;
        .tips {
            color: #A8ABB3;
        }
        .multi-image-uploader-container {
            float: none;
        }
    }

    .subject-programme-list {
        padding-bottom: 20px;
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid #252D3F;
    }

    .btn-style-two {
        &.contain-svg-icon {
            padding: 4px 12px;
            line-height: 34px;
        }
        span {
            display: flex;
            align-items: center;
        }
        * {
            color: #1989FA;
        }
        .svg-icon {
            margin-right: 8px;
            width: 20px !important;
            height: 20px !important;
            fill: #1989FA;
        }
    }

    .el-checkbox-group {
        .el-checkbox {
            padding: 0;
        }
    }

</style>

<style lang="scss">

    #subject-container {
        .el-radio__label {
            padding-left: 20px;
        }
        .el-radio + .el-radio {
            margin-left: 38px;
        }
        .el-checkbox__label {
            padding-left: 20px;
        }
        .el-checkbox + .el-checkbox {
            margin-left: 50px;
        }
    }

</style>
