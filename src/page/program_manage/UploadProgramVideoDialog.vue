<!-- 上传节目视频的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="videoUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="form" :rules="uploadVideoRules" ref="uploadVideoForm" class="form-block" label-width="100px">
            <el-form-item label="视频ID">
                <el-input v-model="form.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="视频名称" prop="name">
                <el-input v-model="form.name" auto-complete="off" placeholder="请输入子集名称"></el-input>
            </el-form-item>
            <el-form-item label="视频排序" prop="sortNumber">
                <el-select v-model="form.sortNumber" placeholder="请选择视频排序">
                    <el-option
                        v-for="item in videoSortOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频简介" prop="desc">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 14}"
                    placeholder="请输入子集简介"
                    v-model="form.desc">
                </el-input>
            </el-form-item>
            <el-form-item label="视频时长">
                <el-input v-model="form.duration" readonly></el-input>
            </el-form-item>
            <el-form-item label="关联正片" prop="positive">
                <el-select v-model="form.positive" placeholder="请选择要关联的正片">
                    <el-option
                        v-for="item in videoPositive"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容类型" prop="contentType">
                <el-select v-model="form.contentType" placeholder="请选择内容类型">
                    <el-option
                        v-for="item in contentTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择视频类型">
                    <el-option
                        v-for="item in videoType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否付费" prop="needPay">
                <el-radio v-model="form.needPay" label="1">是</el-radio>
                <el-radio v-model="form.needPay" label="2">否</el-radio>
            </el-form-item>
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
        props: {
            videoUploadDialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '编辑视频'
            }
        },
        data() {
            return {
                isLoading: false,
                form: {
                    id: '2018040405573345',
                    name: '',
                    desc: '',
                    type: '',
                    duration: '1:20:30',
                    positive: '',
                    sortNumber: '',
                    contentType: '1',
                    needPay: '1'
                },
                videoType: [
                    {
                        value: '1',
                        label: '高清'
                    },
                    {
                        value: '2',
                        label: '标清'
                    },
                    {
                        value: '3',
                        label: '3d'
                    },
                    {
                        value: '4',
                        label: '杜比'
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
                ],
                videoSortOptions: [
                    {
                        value: '1',
                        label: '1'
                    },
                    {
                        value: '2',
                        label: '2'
                    }
                ],
                contentTypeOptions: [
                    {
                        value: '1',
                        label: '正片'
                    },
                    {
                        value: '2',
                        label: '花絮'
                    },
                    {
                        value: '3',
                        label: '看点'
                    },
                    {
                        value: '4',
                        label: '预告'
                    }
                ],
                uploadVideoRules: {
                    name: [{ required: true, message: '请输入视频名称', trigger: 'change' }],
                    description: [{ required: true, message: '请输入视频简介', trigger: 'change' }],
                    type: [{ required: true, message: '请选择视频类型', trigger: 'change' }],
                    duration: '1:20:30',
                    positive: [{ required: true, message: '请选择要关联的正片', trigger: 'change' }],
                    sortNumber: [{ required: true, message: '请选择视频的排序', trigger: 'change' }],
                    contentType: [{ required: true, message: '请选择视频内容类型', trigger: 'change' }],
                    needPay: [{ required: true, message: '请选择是否付费', trigger: 'change' }]
                }
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeVideoDialogStatus', false);
            },
            successHandler() {
                this.$refs.uploadVideoForm.validate(value => {
                    if (value) {
                        this.isLoading = true;
                        setTimeout(() => {
                            this.isLoading = false;
                            this.cancelHandler();
                            this.$refs.uploadVideoForm.resetFields();
                        }, 3000);
                    } else {

                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
