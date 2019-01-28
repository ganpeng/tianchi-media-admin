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
            <label> (大角标125*99，小角标76*46)</label>
            <div>
                <div class="image-box" v-if="cornerMarkInfo.image && cornerMarkInfo.image.uri">
                    <img :src="cornerMarkInfo.image ? cornerMarkInfo.image.uri : '' | imageUrl"
                         :class="{little:cornerMarkInfo.image.width.toString() === '76'}">
                </div>
                <single-image-uploader
                    :allowResolutions="allowResolutions"
                    :uploadSuccessHandler="uploadSuccessHandler">
                </single-image-uploader>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
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
                if (this.$util.isEmpty(this.cornerMarkInfo.image.uri)) {
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
                allowResolutions: CORNER_MARK_DIMENSION
            };
        },
        methods: {
            initCornerMark(cornerMark) {
                this.cornerMarkInfo.caption = cornerMark.caption;
                this.cornerMarkInfo.image.uri = cornerMark.image.uri;
                this.cornerMarkInfo.image.width = cornerMark.image.width;
                this.cornerMarkInfo.image.height = cornerMark.image.height;
                this.cornerMarkInfo.id = cornerMark.id;
                this.mode = 'EDIT';
            },
            uploadSuccessHandler(image) {
                this.cornerMarkInfo.image = image;
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
        .image-box {
            float: left;
            margin-right: 20px;
            width: 37.5px;
            height: 29.7px;
            img {
                height: 100%;
                width: 100%;
                &.little {
                    margin-top: 3px;
                    width: 100%;
                    height: 76%;
                }
            }
        }
        .single-image-uploader-container {
            float: left;
        }
    }

</style>
