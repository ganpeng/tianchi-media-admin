<!--添加节目-->
<template>
    <el-dialog
        title="新增图片尺寸"
        :visible.sync="imageSizeDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <el-form :model="form" ref="imageSizeForm" :rules="imageSizeRules" class="form-block" label-width="100px">
            <el-form-item label="规格名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入规格名称，如今日推荐轮播图"></el-input>
            </el-form-item>
            <el-col :span="24">
                <el-col :span="6">
                    <el-form-item label="规格尺寸" prop="width">
                        <el-input class="size-input" v-model="form.width" placeholder="宽"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="height" label-width="30px">
                        <el-input class="size-input" v-model="form.height" placeholder="高"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props: ['imageSizeDialogVisible'],
        data() {
            return {
                form: {
                    name: '',
                    width: '',
                    height: ''
                },
                imageSizeRules: {
                    name: [{ required: true, message: '请输入规格名称', trigger: 'change' }],
                    width: [{ required: true, message: '请输入宽度', trigger: 'change' }],
                    height: [{ required: true, message: '请输入高度', trigger: 'change' }]
                },
                isLoading: false
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeImageSizeDialogStatus', false);
            },
            successHandler() {
                this.$refs.imageSizeForm.validate(value => {
                    if (value) {
                        this.isLoading = true;
                        setTimeout(() => {
                            this.isLoading = false;
                            this.cancelHandler();
                            this.$refs.imageSizeForm.resetFields();
                        }, 3000);
                    } else {

                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .size-input {
        width: 100px;
    }
</style>
