<!--运营角标表单组件-->
<template>
    <el-form
        :model="cornerMarkInfo"
        :rules="infoRules"
        status-icon
        ref="subjectInfo"
        label-width="120px"
        class="form-block fill-form">
        <el-form-item label="角标类型">
            <label class="type">运营角标</label>
        </el-form-item>
        <el-form-item label="角标名称" prop="caption" required>
            <el-input
                v-model="cornerMarkInfo.caption"
                size="medium"
                placeholder="请填写角标名称">
            </el-input>
        </el-form-item>
        <el-form-item label="角标图片" prop="image" required>
            <!--TV端-->
            <div v-if="visibleTvImage" class="upload-container tv">
                <div>TV端角标：大角标124*98，小角标76*46</div>
                <div class="upload-box" @click="uploadImage('TV')">
                    <i class="el-icon-plus"></i>
                </div>
                <div class="image-box" v-if="cornerMarkInfo.image && cornerMarkInfo.image.uri">
                    <img :src="cornerMarkInfo.image ? cornerMarkInfo.image.uri : '' | imageUrl">
                    <label class="remove-btn" @click="removeImage('TV')">删除</label>
                </div>
            </div>
            <!--APP端-->
            <div v-if="visibleAppImage" class="upload-container app">
                <div>移动端角标：小角标90*48</div>
                <div class="upload-box" @click="uploadImage('APP')">
                    <i class="el-icon-plus"></i>
                </div>
                <div class="image-box" v-if="cornerMarkInfo.appImage && cornerMarkInfo.appImage.uri">
                    <img :src="cornerMarkInfo.appImage ? cornerMarkInfo.appImage.uri : '' | imageUrl">
                    <label class="remove-btn" @click="removeImage('APP')">删除</label>
                </div>
            </div>
            <single-image-uploader
                ref="singleImageUploader"
                :allowResolutions="allowResolutions"
                :uploadSuccessHandler="uploadSuccessHandler">
            </single-image-uploader>
        </el-form-item>
    </el-form>
</template>

<script>
    import _ from 'lodash';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
    import {CORNER_MARK_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'CustomCornerMarkForm',
        components: {
            SingleImageUploader
        },
        data() {
            let checkCaption = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('角标名称不能为空'));
                } else if (this.$util.trim(value).length > 30) {
                    return callback(new Error('角标名称不能超过30字'));
                } else {
                    callback();
                }
            };
            let checkImage = (rule, value, callback) => {
                if (this.$util.isEmpty(this.cornerMarkInfo.image.uri) && this.$util.isEmpty(this.cornerMarkInfo.appImage.uri)) {
                    return callback(new Error('请上传角标图片'));
                } else {
                    callback();
                }
            };
            return {
                mode: 'CREATE',
                cornerMarkInfo: {
                    id: '',
                    caption: '',
                    image: {
                        id: '',
                        name: '',
                        uri: '',
                        width: '',
                        height: ''
                    },
                    appImage: {
                        id: '',
                        name: '',
                        uri: '',
                        width: '',
                        height: ''
                    },
                    markType: 'CUSTOM'
                },
                infoRules: {
                    caption: [
                        {validator: checkCaption, trigger: 'blur'}
                    ],
                    image: [
                        {validator: checkImage, trigger: 'change'}
                    ]
                },
                allowResolutions: CORNER_MARK_DIMENSION.tv
            };
        },
        computed: {
            visibleTvImage() {
                let width = _.get(this.cornerMarkInfo, 'appImage.width');
                let height = _.get(this.cornerMarkInfo, 'appImage.height');

                return !(parseInt(width) === 90 && parseInt(height) === 48);
            },
            visibleAppImage() {
                let width = _.get(this.cornerMarkInfo, 'image.width');
                let height = _.get(this.cornerMarkInfo, 'image.height');

                return !(parseInt(width) === 124 && parseInt(height) === 98);
            }
        },
        methods: {
            initCornerMark(cornerMark) {
                this.cornerMarkInfo.caption = cornerMark.caption;
                this.cornerMarkInfo.image.uri = cornerMark.image.uri;
                this.cornerMarkInfo.image.width = cornerMark.image.width;
                this.cornerMarkInfo.image.height = cornerMark.image.height;
                this.cornerMarkInfo.appImage.uri = cornerMark.appImage.uri;
                this.cornerMarkInfo.appImage.width = cornerMark.appImage.width;
                this.cornerMarkInfo.appImage.height = cornerMark.appImage.height;
                this.cornerMarkInfo.id = cornerMark.id;
                this.mode = 'EDIT';
            },
            uploadSuccessHandler(image) {
                if (this.allowResolutions === CORNER_MARK_DIMENSION.tv) {
                    this.cornerMarkInfo.image = image;
                    this.cornerMarkInfo.appImage = {};
                } else {
                    this.cornerMarkInfo.appImage = image;
                    this.cornerMarkInfo.image = {};
                }
            },
            removeImage(endName) {
                switch (endName) {
                    case 'TV':
                        this.cornerMarkInfo.image = {};
                        break;
                    case 'APP':
                        this.cornerMarkInfo.appImage = {};
                        break;
                    default:
                        break;
                }
            },
            uploadImage(endName) {
                switch (endName) {
                    case 'TV':
                        this.allowResolutions = CORNER_MARK_DIMENSION.tv;
                        break;
                    case 'APP':
                        this.allowResolutions = CORNER_MARK_DIMENSION.app;
                        break;
                    default:
                        break;
                }
                this.$refs.singleImageUploader.$refs.singleImageUploader.click();
            },
            confirmCornerMark() {
                this.$refs['subjectInfo'].validate((valid) => {
                    if (valid) {
                        this.$emit('setIsLoadingStatus', true);
                        if (this.mode === 'CREATE') {
                            this.$service.createCornerMark(this.cornerMarkInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('角标创建成功');
                                    this.$emit('successHandler');
                                }
                                this.$emit('setIsLoadingStatus', false);
                            });
                        }
                        if (this.mode === 'EDIT') {
                            this.$service.updateCornerMark(this.cornerMarkInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('角标更新成功');
                                    this.$emit('successHandler');
                                }
                                this.$emit('setIsLoadingStatus', false);
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        min-height: 350px;
        .type {
            font-size: 16px;
            color: #6F7480;
        }
        .single-image-uploader-container {
            display: inline-block;
            visibility: hidden;
        }
    }

    .upload-container {
        overflow: hidden;
        .image-box {
            float: left;
            display: flex;
            position: relative;
            margin-left: 20px;
            width: 100px;
            height: 100px;
            line-height: 100px;
            justify-content: center;
            align-items: center;
            img {
                transform: scale(0.35, 0.35);
            }
            .remove-btn {
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                position: absolute;
                bottom: 0px;
                left: 40px;
                color: #f56c6c;
                cursor: pointer;
            }
        }
        .upload-box {
            float: left;
            padding: 0px 10px;
            width: 130px;
            height: 100px;
            border: 1px solid #3E495E;
            border-radius: 4px;
            line-height: 100px;
            cursor: pointer;
            text-align: center;
            i {
                font-size: 24px;
                color: #3E495E;
            }
            &:hover {
                border-color: #1989FA;
                i {
                    color: #1989FA;
                }
            }
        }
        &.app {
            margin-top: 40px;
        }
    }

</style>
