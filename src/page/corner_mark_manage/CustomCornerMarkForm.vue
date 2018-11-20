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
            <el-input v-model="cornerMarkInfo.caption" placeholder="请填写角标名称"></el-input>
        </el-form-item>
        <el-form-item label="角标图片" prop="imageUri" required>
            <label> (大角标125*99，小角标76*46)</label>
            <div>
                <div class="image-box" v-if="cornerMarkInfo.imageUri">
                    <img :src="cornerMarkInfo.imageUri">
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
            let checkImageUri = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
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
                    imageUri: '',
                    markType: 'CUSTOM'
                },
                infoRules: {
                    caption: [
                        {validator: checkCaption, trigger: 'blur'}
                    ],
                    imageUri: [
                        {validator: checkImageUri, trigger: 'change'}
                    ]
                },
                allowResolutions: CORNER_MARK_DIMENSION
            };
        },
        methods: {
            initCornerMark(cornerMark) {
                this.cornerMarkInfo.caption = cornerMark.caption;
                this.cornerMarkInfo.imageUri = cornerMark.imageUri;
                this.cornerMarkInfo.id = cornerMark.id;
                this.mode = 'EDIT';
            },
            uploadSuccessHandler(image) {
                this.cornerMarkInfo.imageUri = image.uri;
            },
            confirmCornerMark() {
                this.$refs['subjectInfo'].validate((valid) => {
                    if (valid) {
                        if (this.mode === 'CREATE') {
                            this.$service.createCornerMark(this.cornerMarkInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('角标创建成功');
                                    this.$emit('successHandler');
                                }
                            });
                        }
                        if (this.mode === 'EDIT') {
                            this.$service.updateCornerMark(this.cornerMarkInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('角标更新成功');
                                    this.$emit('successHandler');
                                }
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
            position: relative;
            float: left;
            margin-right: 20px;
            width: 100px;
            height: 100px;
            img {
                position: absolute;
                top: 0px;
                left: 0px;
                bottom: 0px;
                right: 0px;
                margin: auto;
                height: 60px;
                width: 60px;
            }
        }
        .single-image-uploader-container {
            float: left;
        }
    }

</style>
