<!-- 上传节目视频的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="videoUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="video" :rules="uploadVideoRules" ref="uploadVideoForm" class="form-block" label-width="100px">
            <el-form-item label="视频ID">
                <el-input :value="video.commonId" disabled></el-input>
            </el-form-item>
            <el-form-item label="视频名称" prop="name">
                <el-input
                    :disabled="readonly"
                    :value="video.name"
                    auto-complete="off"
                    placeholder="请输入子集名称"
                    @input="inputHandler($event, 'name')"
                ></el-input>
            </el-form-item>
            <el-form-item label="视频简介" prop="description">
                <el-input
                    :disabled="readonly"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 14}"
                    placeholder="请输入子集简介"
                    :value="video.description"
                    @input="inputHandler($event, 'description')"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="内容类型" prop="type">
                <el-select
                    :disabled="readonly"
                    :value="video.type"
                    placeholder="请选择内容类型"
                    @change="inputHandler($event, 'type')"
                >
                    <el-option
                        v-for="item in videoType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择视频">
                <el-col :span="3">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/"
                        :auto-upload="false"
                        :http-request="uploadRequest"
                        :show-file-list="false"
                        :with-credentials="true">
                            <el-button size="small" type="primary">选择视频</el-button>
                    </el-upload>
                </el-col>
                <el-button size="small" type="primary" @click="submitUpload">点击上传</el-button>
            </el-form-item>
            <el-form-item label="视频时长">
                <el-input
                    :value="video.takeTimeInSec"
                    :disabled="readonly"
                ></el-input>
            </el-form-item>
            <el-form-item
                v-if="video.type === 'FEATURE' && isTvPlay"
                label="视频排序" prop="sort">
                <el-input
                    :disabled="readonly"
                    :value="video.sort"
                    auto-complete="off"
                    type="number"
                    placeholder="请输入排序编号"
                    @input="inputHandler($event, 'sort')"
                ></el-input>
            </el-form-item>
            <el-form-item
                v-if="video.type !== 'FEATURE'"
                label="关联正片" prop="parentId">
                <el-select
                    :disabled="readonly"
                    :value="video.parentId"
                    placeholder="请选择要关联的正片"
                    @change="inputHandler($event, 'parentId')"
                >
                    <el-option
                        v-for="item in featureVideoList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频类型" prop="quality">
                <el-select
                    :disabled="readonly"
                    :value="video.quality"
                    placeholder="请选择视频类型"
                    @change="inputHandler($event, 'quality')"
                >
                    <el-option
                        v-for="item in qualityType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否付费" prop="free">
                <el-radio-group
                    :disabled="readonly"
                    :value="video.free"
                    @input="inputHandler($event, 'free')"
                >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button
                v-if="videoStatus !== 2"
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import role from '@/util/config/role';

    export default {
        props: {
            videoUploadDialogVisible: {
                type: Boolean,
                default: false
            },
            videoStatus: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isLoading: false,
                videoType: role.VIDEO_TYPE,
                qualityType: role.QUALITY_TYPE,
                uploadVideoRules: {
                    name: [{ required: true, message: '请输入视频名称', trigger: 'blur, change' }],
                    description: [{ required: true, message: '请输入视频简介', trigger: 'blur, change' }],
                    type: [{ required: true, message: '请选择视频内容类型', trigger: 'blur' }],
                    takeTimeInSec: [{ required: true, message: '请选择要关联的正片', trigger: 'blur, change' }],
                    sort: [{ required: true, message: '请输入视频的排序', trigger: 'blur, change' }],
                    quality: [{ required: true, message: '请选择视频类型', trigger: 'blur' }],
                    free: [{ required: true, message: '请选择是否付费', trigger: 'blur, change' }]
                }
            };
        },
        computed: {
            ...mapGetters({
                video: 'programmeVideo/currentProgrammeVideo',
                featureVideoList: 'programmeVideo/featureVideoList',
                isTvPlay: 'programme/isTvPlay'
            }),
            title() {
                switch (parseInt(this.videoStatus)) {
                    case 0:
                        return '创建视频';
                    case 1:
                        return '编辑视频';
                    case 2:
                        return '显示视频';
                    default:
                        return '创建视频';
                }
            },
            readonly() {
                return this.videoStatus === 2;
            }
        },
        methods: {
            ...mapMutations({
                updateCurrentProgrammeVideo: 'programmeVideo/updateCurrentProgrammeVideo',
                resetProgrammeVideo: 'programmeVideo/resetProgrammeVideo',
                addVideoToList: 'programmeVideo/addVideoToList',
                updateCurrentProgrammeVideoItem: 'programme/updateCurrentProgrammeVideoItem'
            }),
            ...mapActions({
                updateProgrammeVideo: 'programmeVideo/updateProgrammeVideo',
                getVideoFeatureList: 'programmeVideo/getVideoFeatureList'
            }),
            cancelHandler() {
                this.$emit('changeVideoDialogStatus', false);
                // 清楚校验的规则
                this.$refs.uploadVideoForm.clearValidate();
                // 清楚表单中的数据
                setTimeout(() => {
                    this.resetProgrammeVideo();
                }, 100);
            },
            successHandler() {
                this.$refs.uploadVideoForm.validate(value => {
                    if (value) {
                        if (parseInt(this.videoStatus) !== 1) {
                            this.addVideoToList();
                            this.cancelHandler();
                        } else {
                            this.updateProgrammeVideo()
                                .then((res) => {
                                    this.updateCurrentProgrammeVideoItem({video: res.data});
                                    this.cancelHandler();
                                });
                        }
                    }
                });
            },
            async uploadRequest(obj) {
                let formData = new FormData();
                formData.append('file', obj.file);
                this.$service.uploadVideo({formData, fileName: this.form.name})
                    .then((res) => {
                        if (res && res.code === 0) {
                        }
                    }).finally(() => {
                        this.isLoading = false;
                    });
            },
            submitUpload() {

            },
            inputHandler(value, key) {
                this.updateCurrentProgrammeVideo({[key]: value});
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
