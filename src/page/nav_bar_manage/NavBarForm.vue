<!--2.0栏目表单组件-->
<template>
    <div>
        <el-form
            ref="navBarInfo"
            :model="navBarInfo"
            :rules="infoRules"
            status-icon
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="栏目标题类型" prop="type" class="title-type" required>
                <el-radio-group v-model="navBarInfo.type" @change="pickNavBarInfoType">
                    <el-radio label="WORDS">文字</el-radio>
                    <el-radio label="IMAGES">图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--栏目标题-->
            <el-form-item prop="name" class="words-box" label-width="0px" ref="wordsInfo">
                <el-input
                    size="medium"
                    v-model="navBarInfo.name"
                    :disabled="navBarInfo.type === 'IMAGES' || !navBarInfo.type"
                    placeholder="请输入栏目标题，10字以内">
                </el-input>
            </el-form-item>
            <!--栏目图片-->
            <el-form-item prop="uri" class="image-box" label-width="0px" ref="imageInfo">
                <div class="upload-box">
                    <div @click="uploadImage('FOCUS')"
                         :class="{disabled:navBarInfo.type === 'WORDS' || !navBarInfo.type}">
                        <i class="el-icon-plus"></i>
                    </div>
                    <p>
                        <label>100-500 * 42</label>
                        <span>半落焦图</span>
                    </p>
                    <img v-if="navBarInfo.focalImage.uri" :src="navBarInfo.focalImage.uri | imageUrl">
                </div>
                <div class="upload-box">
                    <div @click="uploadImage('NONE_FOCUS')"
                         :class="{disabled:navBarInfo.type === 'WORDS' || !navBarInfo.type}">
                        <i class="el-icon-plus"></i>
                    </div>
                    <p>
                        <label>100-500 * 42</label>
                        <span>非落焦图</span>
                    </p>
                    <img v-if="navBarInfo.image.uri" :src="navBarInfo.image.uri | imageUrl">
                </div>
                <div class="upload-box">
                    <single-image-uploader
                        ref="singleImageUploader"
                        :uploadSuccessHandler="uploadSuccessHandler"
                        :allowResolutions="allowResolutions"
                        :allowFileList="getAllowFileList">
                    </single-image-uploader>
                </div>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item
                v-show="navBarInfo.type === 'IMAGES'"
                ref="picRemarkItem"
                style="padding-top: 22px;margin-bottom: 0"
                label="备注" label-width="200px"
                prop="picRemark"
                required>
                <el-input
                    size="medium"
                    v-model="navBarInfo.picRemark"
                    :disabled="navBarInfo.type !== 'IMAGES'"
                    placeholder="请填写栏目备注，10字以内">
                </el-input>
            </el-form-item>
            <el-form-item style="padding-top: 26px;" label="栏目分类" prop="signCode">
                <el-select
                    v-model="navBarInfo.signCode"
                    clearable
                    size="medium"
                    placeholder="请选择栏目分类">
                    <el-option
                        v-for="item in programmeCategoryListOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.signCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="栏目版式" class="nav-bar-model" prop="layoutTemplate" required>
                <el-radio-group v-model="navBarInfo.layoutTemplate">
                    <el-radio
                        label="FS_3"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_3')">
                        新闻类版式
                        <svg-icon icon-class="model_news"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_2"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_2')">
                        电影类版式
                        <svg-icon icon-class="model_movie"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_1"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_1')">
                        电视剧类版式
                        <svg-icon icon-class="model_TV_drama"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_4"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_4')">
                        专题类版式
                        <svg-icon icon-class="model_subject"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_8"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_8')">
                        教育类版式
                        <svg-icon icon-class="model_edu"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_7"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_7')">
                        党建类版式
                        <svg-icon icon-class="model_party"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_6"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_6')">
                        分类版式
                        <svg-icon icon-class="model_category"></svg-icon>
                    </el-radio>
                    <el-radio
                        label="FS_5"
                        v-if="status === 'CREATE' || (status === 'EDIT' && navBarInfo.layoutTemplate === 'FS_5')">
                        少儿栏目板式
                        <svg-icon icon-class="model_child"></svg-icon>
                        <label class="notice">*仅限少儿栏目使用</label>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createNavBar" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toNavBarSetting" plain>返回</el-button>
        </div>
    </div>
</template>

<script>
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';

    export default {
        name: 'NavNarForm',
        props: {
            status: {
                type: String,
                default: ''
            }
        },
        components: {
            SingleImageUploader
        },
        data() {
            // 检测类型
            let checkType = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目标题类型'));
                } else {
                    callback();
                }
            };
            // 检测栏目标题
            let checkName = (rule, value, callback) => {
                if (this.navBarInfo.type === 'WORDS' && this.$util.isEmpty(this.navBarInfo.name)) {
                    return callback(new Error('请选择填写栏目名称'));
                } else if (this.navBarInfo.type === 'WORDS' && this.navBarInfo.name.length > 10) {
                    return callback(new Error('栏目名称应在10字以内'));
                } else if (this.navBarInfo.type === '' && this.$util.isEmpty(this.navBarInfo.name)) {
                    return '';
                } else if (this.navBarInfo.type === 'IMAGES' && this.navBarInfo.name.length > 10) {
                    return callback(new Error('栏目名称应在10字以内'));
                } else if (this.navBarInfo.type === 'IMAGES' && this.$util.isEmpty(this.navBarInfo.name)) {
                    return callback(new Error('请选择填写栏目名称'));
                } else {
                    callback();
                }
            };
            // 检测图片备注
            let checkPicRemark = (rule, value, callback) => {
                if (this.navBarInfo.type === 'IMAGES' && this.$util.isEmpty(this.navBarInfo.picRemark)) {
                    return callback(new Error('请选择填写备注'));
                } else if (this.navBarInfo.type === 'IMAGES' && this.navBarInfo.picRemark.length > 10) {
                    return callback(new Error('备注应在10字以内'));
                } else {
                    callback();
                }
            };
            // 检测标题图片
            let checkImageUri = (rule, value, callback) => {
                if (this.navBarInfo.type === 'IMAGES' && !(this.navBarInfo.focalImage.uri && this.navBarInfo.image.uri)) {
                    return callback(new Error('请上传对应的图片'));
                } else {
                    callback();
                }
            };
            let checkLayoutTemplate = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目版式'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                uploadMode: '',
                allowResolutions: [{width: 100, height: 42}],
                navBarInfo: {
                    type: '',
                    name: '',
                    // 半落焦图
                    focalImage: {},
                    // 非落焦图
                    image: {},
                    picRemark: '',
                    signCode: '',
                    layoutTemplate: '',
                    applicableClientList: ['TV']
                },
                programmeCategoryListOptions: [],
                infoRules: {
                    type: [
                        {validator: checkType, trigger: 'change'}
                    ],
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    picRemark: [
                        {validator: checkPicRemark, trigger: 'blur'},
                        {validator: checkPicRemark, trigger: 'change'}
                    ],
                    uri: [
                        {validator: checkImageUri, trigger: 'change'}
                    ],
                    layoutTemplate: [
                        {validator: checkLayoutTemplate, trigger: 'change'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryListOptions = response.data;
                    }
                });
                if (this.status === 'EDIT') {
                    this.$service.getNavBarDetail(this.$route.params.id).then(response => {
                        if (response && response.code === 0) {
                            this.navBarInfo = response.data;
                            this.navBarInfo.type = this.navBarInfo.name ? 'WORDS' : 'IMAGES';
                        }
                    });
                }
            },
            pickNavBarInfoType() {
                if (this.navBarInfo.type === 'WORDS') {
                    this.navBarInfo.focalImage = {};
                    this.navBarInfo.image = {};
                    this.navBarInfo.picRemark = '';
                    this.$nextTick(function () {
                        this.$refs['picRemarkItem'].clearValidate();
                        this.$refs['imageInfo'].clearValidate();
                    });
                } else {
                    this.navBarInfo.name = '';
                    this.$refs['wordsInfo'].clearValidate();
                }
            },
            uploadImage(mode) {
                this.uploadMode = mode;
                this.$refs.singleImageUploader.$refs.singleImageUploader.click();
            },
            // 过滤上传的图片
            getAllowFileList(images) {
                if (images[0].demension.height === 42 && images[0].demension.width <= 500 && images[0].demension.width >= 100) {
                    return images;
                }
                return [];
            },
            uploadSuccessHandler(image) {
                switch (this.uploadMode) {
                    case 'FOCUS':
                        this.navBarInfo.focalImage = image;
                        break;
                    case 'NONE_FOCUS':
                        this.navBarInfo.image = image;
                        break;
                    default:
                        break;
                }
            },
            // 添加或者更新栏目信息
            saveNavBarInfo() {
                // 清空对应的数据
                if (this.navBarInfo.type.toString() === 'WORDS') {
                    this.navBarInfo.image = {};
                    this.navBarInfo.focalImage = {};
                    this.navBarInfo.picRemark = '';
                } else {
                    this.navBarInfo.name = '';
                }
                this.isLoading = true;
                if (this.status === 'CREATE') {
                    this.$service.createNavBar(this.navBarInfo).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('成功创建栏目');
                            this.toNavBarSetting();
                        } else {
                            this.isLoading = false;
                        }
                    });
                } else {
                    this.$service.updateNavBar(this.navBarInfo).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('成功更新栏目');
                            this.toNavBarSetting();
                        } else {
                            this.isLoading = false;
                        }
                    });
                }
            },
            createNavBar() {
                let that = this;
                // layoutTemplate
                // 栏目标题类型是文字模式
                if (this.navBarInfo.type.toString() === '') {
                    this.$refs['navBarInfo'].validateField('type');
                    this.$refs['navBarInfo'].validateField('layoutTemplate');
                } else if (this.navBarInfo.type.toString() === 'WORDS') {
                    let wordsCount = 0;
                    this.$refs['navBarInfo'].validateField('name', function (validate) {
                        if (!validate) {
                            wordsCount++;
                            if (wordsCount === 2) {
                                that.saveNavBarInfo();
                            }
                        }
                    });
                    this.$refs['navBarInfo'].validateField('layoutTemplate', function (validate) {
                        if (!validate) {
                            wordsCount++;
                            if (wordsCount === 2) {
                                that.saveNavBarInfo();
                            }
                        }
                    });
                } else if (this.navBarInfo.type.toString() === 'IMAGES') {
                    let imagesCount = 0;
                    this.$refs['navBarInfo'].validateField('uri', function (validate) {
                        if (!validate) {
                            imagesCount++;
                            if (imagesCount === 3) {
                                that.saveNavBarInfo();
                            }
                        }
                    });
                    this.$refs['navBarInfo'].validateField('layoutTemplate', function (validate) {
                        if (!validate) {
                            imagesCount++;
                            if (imagesCount === 3) {
                                that.saveNavBarInfo();
                            }
                        }
                    });
                    this.$refs['navBarInfo'].validateField('picRemark', function (validate) {
                        if (!validate) {
                            imagesCount++;
                            if (imagesCount === 3) {
                                that.saveNavBarInfo();
                            }
                        }
                    });
                }
            },
            toNavBarSetting() {
                this.$router.push({name: 'NavBarSetting'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        position: relative;
        margin-top: 25px;
        .el-form-item {
            padding-bottom: 10px;
        }
        /* 标题名称框 */
        .words-box {
            position: absolute;
            left: 33px;
            top: 0px;
            margin-left: 170px;
            .el-input {
                width: 300px;
            }
            .info-error {
                color: red;
                height: 30px;
                line-height: 30px;
            }
        }
        /* 图片上传框 */
        .image-box {
            position: absolute;
            left: 82px;
            top: 62px;
            margin-left: 120px;
            /*上传框*/
            .upload-box {
                position: relative;
                margin-bottom: 15px;
                &:first-child {
                    margin-right: 30px;
                }
                .single-image-uploader-container {
                    display: none;
                }
                img {
                    position: absolute;
                    height: 42px;
                    top: 0px;
                    left: 120px;
                }
                div {
                    width: 100px;
                    height: 42px;
                    border: 1px solid #3E495E;
                    line-height: 44px;
                    border-radius: 4px;
                    text-align: center;
                    cursor: pointer;
                    overflow: hidden;
                    i {
                        font-size: 20px;
                        color: #3E495E;
                    }
                    &:hover {
                        border-color: #1989FA;
                        i {
                            color: #1989FA;
                        }
                    }
                    &.disabled {
                        pointer-events: none;
                        cursor: not-allowed;
                    }
                }
                p {
                    margin-top: 7px;
                    width: 100px;
                    label, span {
                        display: block;
                        text-align: center;
                        font-size: 12px;
                        color: #A8ABB3;
                        line-height: 17px;
                    }
                }
            }
        }
        /*标题类型*/
        .title-type {
            position: relative;
            margin-bottom: 0px;
            .el-radio-group {
                margin-top: 14px;
                margin-bottom: 170px;
                width: 60px;
            }
            .el-radio {
                display: block;
                margin-left: 0px;
                &:first-child {
                    margin-bottom: 34px;
                }
            }
        }
    }

    .nav-bar-model {
        .el-radio-group {
            margin-top: 12px;
            width: 1000px;
            .el-radio:nth-child(3) {
                margin-bottom: 26px;
            }
            .el-radio:nth-child(4), .el-radio:nth-child(7) {
                margin-bottom: 26px;
                margin-left: 0;
            }
            .el-radio:nth-child(5) {
                margin-bottom: 26px;
            }
            .el-radio__label {
                position: relative;
                .notice {
                    position: absolute;
                    left: 90px;
                    bottom: -20px;
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(111, 116, 128, 1);
                }
            }
        }
        .svg-icon {
            display: block;
            margin-top: 10px;
            width: 281px !important;
            height: 158px !important;
        }
    }

</style>
