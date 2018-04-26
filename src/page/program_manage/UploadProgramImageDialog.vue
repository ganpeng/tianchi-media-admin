<!-- 上传节目图片的弹窗组件 -->
<template>
    <el-dialog
        title="上传节目图片"
        :visible.sync="imageUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="form" class="form-block" label-width="100px">
            <el-form-item label="规格尺寸">
                <el-select v-model="form.spec" placeholder="请选择规格尺寸">
                    <el-option
                        v-for="item in imageSizeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" plain @click="imageSizeDialogVisible = true">新增尺寸类型</el-button>
            </el-form-item>
            <el-form-item label="图片名称">
                <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <el-form-item label="图片大小">
                <el-input v-model="form.size" readonly></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button type="primary" @click="successHandler">确 定</el-button>
        </div>

        <image-size-dialog :imageSizeDialogVisible="imageSizeDialogVisible" v-on:changeImageSizeDialogStatus="closeImageSizeDialog($event)"></image-size-dialog>
    </el-dialog>
</template>
<script>

    import ImageSizeDialog from './ImageSizeDialog';

    export default {
        props: ['imageUploadDialogVisible'],
        components: {
            ImageSizeDialog
        },
        data() {
            return {
                form: {
                    name: '',
                    size: '5M',
                    spec: ''
                },
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
                imageSizeDialogVisible: false
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeImageDialogStatus', false);
            },
            successHandler() {
                this.cancelHandler();
            },
            closeImageSizeDialog(res) {
                this.imageSizeDialogVisible = false;
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
