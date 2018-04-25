<!--添加节目-->
<template>
    <el-dialog
        title="新增图片尺寸"
        :visible.sync="imageSizeDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <el-form :model="form" class="form-block" label-width="100px">
            <el-form-item label="规格名称">
                <el-input v-model="form.name" placeholder="请输入规格名称，如今日推荐轮播图"></el-input>
            </el-form-item>
            <el-form-item label="规格尺寸">
                <el-input class="size-input" v-model="form.leftSize" placeholder="宽"></el-input>
                <span> * </span>
                <el-input class="size-input" v-model="form.rightSize" placeholder="高"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button type="primary" @click="successHandler">确 定</el-button>
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
                    leftSize: '',
                    rightSize: ''
                }
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeImageSizeDialogStatus', false);
            },
            successHandler() {
                this.cancelHandler();
            }
        }
    };
</script>
<style lang="less" scoped>
    .size-input {
        width: 100px;
    }
</style>
