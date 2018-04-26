<!-- 上传节目视频的弹窗组件 -->
<template>
    <el-dialog
        title="添加视频"
        :visible.sync="videoUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="form" class="form-block" label-width="100px">
            <el-form-item label="视频名称">
                <el-input v-model="form.name" auto-complete="off" placeholder="请输入子集名称"></el-input>
            </el-form-item>
            <el-form-item label="视频简介">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 14}"
                    placeholder="请输入子集简介"
                    v-model="form.desc">
                </el-input>
            </el-form-item>
            <el-form-item label="视频类型">
                <el-select v-model="form.type" placeholder="请选择视频类型">
                    <el-option
                        v-for="item in videoType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联正片">
                <el-select v-model="form.positive" placeholder="请选择要关联的正片">
                    <el-option
                        v-for="item in videoPositive"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
        props: ['videoUploadDialogVisible'],
        data() {
            return {
                form: {
                    name: '',
                    desc: '',
                    type: '',
                    positive: ''
                },
                videoType: [
                    {
                        value: '正片',
                        label: '正片'
                    },
                    {
                        value: '花絮',
                        label: '花絮'
                    },
                    {
                        value: '看点',
                        label: '看点'
                    },
                    {
                        value: '预告',
                        label: '预告'
                    }
                ],
                videoPositive: [
                    {
                        value: '正片1',
                        label: '正片1'
                    },
                    {
                        value: '正片2',
                        label: '正片2'
                    }
                ]
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeVideoDialogStatus', false);
            },
            successHandler() {
                this.cancelHandler();
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
