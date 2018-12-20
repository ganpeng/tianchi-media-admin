<!--2.0添加栏目组件-->
<template>
    <div>
        <div class="content-title">添加栏目</div>
        <div class="seperator-line"></div>
        <el-form
            ref="navBarInfo"
            :model="navBarInfo"
            :rules="infoRules"
            status-icon
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="栏目标题类型" prop="type" class="title-type" required>
                <el-radio-group v-model="navBarInfo.type">
                    <el-radio :label="0">文字
                        <el-input v-model="navBarInfo.name" placeholder="请输入栏目标题，10字以内"></el-input>
                    </el-radio>
                    <el-radio :label="1">图片
                        <div class="image-box">
                            <div class="upload-box">
                                <div @click="uploadImage('FOCUS')">
                                    <img v-if="navBarInfo.focalImage.uri" :src="navBarInfo.focalImage.uri | imageUrl">
                                    <i v-else class="el-icon-plus"></i>
                                </div>
                                <p>
                                    <label>100-500 * 42</label>
                                    <span>落焦图</span>
                                </p>
                            </div>
                            <div class="upload-box">
                                <div @click="uploadImage('NONE_FOCUS')">
                                    <img v-if="navBarInfo.image.uri" :src="navBarInfo.image.uri | imageUrl">
                                    <i v-else class="el-icon-plus"></i>
                                </div>
                                <p>
                                    <label>100-500 * 42</label>
                                    <span>非落焦图</span>
                                </p>
                            </div>
                            <div class="upload-box">
                                <single-image-uploader
                                    ref="singleImageUploader"
                                    :uploadSuccessHandler="uploadSuccessHandler"
                                    :allowResolutions="allowResolutions"
                                    :allowFileList="getAllowFileList">
                                </single-image-uploader>
                            </div>
                        </div>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="栏目分类" prop="signCode">
                <el-select
                    v-model="navBarInfo.signCode"
                    clearable
                    placeholder="请选择栏目分类">
                    <el-option
                        v-for="item in programmeCategoryListOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.signCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="栏目板式" class="nav-bar-model" prop="layoutTemplate" required>
                <el-radio-group v-model="navBarInfo.layoutTemplate">
                    <el-radio label="FS_3">新闻板式类
                        <svg-icon icon-class="model_news"></svg-icon>
                    </el-radio>
                    <el-radio label="FS_2">电影板式类
                        <svg-icon icon-class="model_movie"></svg-icon>
                    </el-radio>
                    <el-radio label="FS_1">电视剧板式类
                        <svg-icon icon-class="model_TV_drama"></svg-icon>
                    </el-radio>
                    <el-radio label="FS_4">专题板式类
                        <svg-icon icon-class="model_subject"></svg-icon>
                    </el-radio>
                    <el-radio label="FS_5">儿童板式（只适用于儿童栏目）
                        <svg-icon icon-class="model_child"></svg-icon>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="operate-block">
            <el-button type="primary" class="btn-style-two" @click="createNavBar">保存</el-button>
            <el-button type="primary" plain class="btn-style-three" @click="toNavBarSetting">返回</el-button>
        </div>
    </div>
</template>

<script>
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';

    export default {
        name: 'CreateNavNarForm',
        components: {
            SingleImageUploader
        },
        data() {
            let checkType = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目标题类型'));
                } else if (value === 0 && this.$util.isEmpty(this.navBarInfo.name)) {
                    return callback(new Error('请选择填写栏目名称'));
                } else if (value === 0 && this.navBarInfo.name.length > 10) {
                    return callback(new Error('栏目名称应在10字以内'));
                } else if (value === 1 && !(this.navBarInfo.focalImage.uri && this.navBarInfo.image.uri)) {
                    return callback(new Error('请上传对应的图片'));
                } else {
                    callback();
                }
            };
            let checkLayoutTemplate = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目板式'));
                } else {
                    callback();
                }
            };
            return {
                uploadMode: '',
                allowResolutions: [{width: 100, height: 42}],
                navBarInfo: {
                    type: '',
                    name: '',
                    // 落焦图
                    focalImage: {},
                    // 非落焦图
                    image: {},
                    signCode: '',
                    layoutTemplate: ''
                },
                programmeCategoryListOptions: [],
                infoRules: {
                    type: [
                        {validator: checkType, trigger: 'change'}
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
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryListOptions = response.data;
                    }
                });
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
            createNavBar() {
                this.$refs['navBarInfo'].validate((valid) => {
                    if (valid) {
                        // 清空对应的数据
                        if (this.navBarInfo.type.toString() === '0') {
                            this.navBarInfo.image = {};
                            this.navBarInfo.focalImage = {};
                        } else {
                            this.navBarInfo.name = '';
                        }
                        this.$service.createNavBar(this.navBarInfo).then(response => {
                            if (response && response.code === 0) {
                                this.$message.success('成功创建栏目');
                                this.toNavBarSetting();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            toNavBarSetting() {
                this.$router.push({name: 'NavBarSetting'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        margin-top: 25px;
        .el-form-item {
            padding-bottom: 10px;
        }
        /*标题类型*/
        .title-type {
            .el-radio-group {
                width: 1200px;
            }
            .el-radio {
                display: block;
                margin-left: 0px;
                overflow: hidden;
                &:last-child {
                    position: relative;
                    margin-top: 25px;
                    height: 88px;
                }
            }
            .el-input {
                margin-left: 20px;
                width: 300px;
            }
            .image-box {
                position: absolute;
                display: inline-block;
                margin-left: 24px;
            }
            /*上传框*/
            .upload-box {
                display: inline-block;
                &:first-child {
                    margin-right: 30px;
                }
                .single-image-uploader-container {
                    display: none;
                }
                div {
                    width: 100px;
                    height: 42px;
                    border: 1px solid #3E495E;
                    line-height: 42px;
                    border-radius: 4px;
                    text-align: center;
                    cursor: pointer;
                    overflow: hidden;
                    img {
                        height: 42px;
                    }
                    i {
                        font-size: 20px;
                        color: #3E495E;
                    }
                }
                p {
                    margin-top: 7px;
                    label, span {
                        display: block;
                        text-align: center;
                        font-size: 12px;
                        line-height: 17px;
                    }
                }
            }
        }
    }

    .nav-bar-model {
        .el-radio-group {
            margin-top: 12px;
            width: 900px;
            .el-radio:nth-child(3) {
                margin-left: 0px;
                margin-top: 26px;
            }
            .el-radio:nth-child(4) {
                margin-top: 26px;
            }
            .el-radio:nth-child(5) {
                margin-top: 26px;
                margin-left: 0px;
            }
        }
        .svg-icon {
            display: block;
            margin-top: 10px;
            width: 370px !important;
            height: 158px !important;
        }
    }

    // 操作
    .operate-block {
        position: fixed;
        bottom: 10px;
        left: 0px;
        right: 0px;
        margin: auto;
        width: 500px;
        height: 80px;
        line-height: 90px;
        background: #293550;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.20);
        border-radius: 8px;
        z-index: 600;
        .el-button:last-child {
            margin-left: 40px;
        }
    }

</style>
