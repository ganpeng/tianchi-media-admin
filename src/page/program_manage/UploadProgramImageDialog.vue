<!-- 上传节目图片的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="imageUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <el-form :model="form" :rules="imageUploadRules" ref="uploadImageForm" class="form-block" label-width="100px">
            <el-form-item label="规格尺寸" prop="spec">
                <el-select v-model="form.spec" clearable placeholder="请选择规格尺寸">
                    <el-option
                        v-for="item in imageSizeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" plain @click="imageSizeDialogVisible = true">新增尺寸类型</el-button>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
                <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="imageFiles">
                <el-col :span="10">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        v-model="form.imageFiles"
                        :file-list="form.imageFiles"
                        :on-success="uploadSuccessHandler"
                        list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                    </el-upload>
                </el-col>
            </el-form-item>
            <el-form-item label="图片大小">
                <el-input v-model="form.size" readonly></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
        <image-size-dialog :imageSizeDialogVisible="imageSizeDialogVisible" v-on:changeImageSizeDialogStatus="closeImageSizeDialog($event)"></image-size-dialog>
    </el-dialog>
</template>
<script>

    import ImageSizeDialog from './ImageSizeDialog';

    export default {
        props: ['imageUploadDialogVisible', 'title'],
        components: {
            ImageSizeDialog
        },
        data() {
            return {
                form: {
                    name: '',
                    size: '5M',
                    spec: '',
                    imageFiles: []
                },
                isLoading: false,
                imageSizeOptions: [
                    {
                        value: '0',
                        label: '123 * 345'
                    },
                    {
                        value: '1',
                        label: '345 * 123'
                    },
                    {
                        value: '2',
                        label: '222 * 555'
                    }
                ],
                imageUploadRules: {
                    name: [ { required: true, message: '请输入图片名称', trigger: 'change' } ],
                    spec: [ { required: true, message: '请选择图片规格尺寸', trigger: 'change' } ]
                },
                imageSizeDialogVisible: false
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeImageDialogStatus', false);
            },
            successHandler() {
                // 增加post请求的loading
                this.$refs.uploadImageForm.validate(value => {
                    if (value) {
                        this.isLoading = true;
                        setTimeout(() => {
                            this.isLoading = false;
                            this.cancelHandler();
                        }, 3000);
                    } else {
                        return false;
                    }
                });
            },
            closeImageSizeDialog(res) {
                this.imageSizeDialogVisible = false;
            },
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
            uploadSuccessHandler(res, file, fileList) {
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
