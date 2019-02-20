<!--广告信息表单组件-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            :model="adInfo"
            :rules="infoRules"
            status-icon
            ref="adInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="广告名称" prop="name" required>
                <el-input
                    v-model="adInfo.name"
                    size="medium"
                    placeholder="请填写20个字以内的名称">
                </el-input>
            </el-form-item>
            <el-form-item label="广告描述" prop="desc" required>
                <el-input
                    v-model="adInfo.desc"
                    size="medium"
                    type="textarea"
                    :rows="6"
                    placeholder="请填写100个字以内的描述">
                </el-input>
            </el-form-item>
            <el-form-item label="广告类型" prop="category" required>
                <label>开机广告</label>
            </el-form-item>
            <el-form-item label="起止时间" prop="effectTime" required>
                <el-date-picker
                    v-model="effectRangeTime"
                    type="datetimerange"
                    clearable
                    value-format="timestamp"
                    range-separator="至"
                    :default-time="['12:00:00']"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="总时长" prop="totalTime">
                <label>30秒</label>
            </el-form-item>
            <el-form-item label="总体积" prop="totalSize">
                <label>700M</label>
            </el-form-item>
            <el-form-item label="广告主" prop="resource">
                <el-tag>一重</el-tag>
                <el-tag>二重</el-tag>
            </el-form-item>
            <el-form-item label="广告资源" prop="resource" required>
                <el-button @click="selectADResourceVisible = true" class="contain-svg-icon btn-style-four">
                    <svg-icon icon-class="link_programme"></svg-icon>
                    关联资源
                </el-button>
                <thumbnail
                    :imageList="adInfo.posterImageList">
                </thumbnail>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateAD" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toADList" plain>返回列表</el-button>
        </div>
        <el-dialog
            title="关联资源"
            :visible.sync="selectADResourceVisible"
            :close-on-click-modal=false
            custom-class="normal-dialog"
            width="80%">
            <select-ad-image-resource>
            </select-ad-image-resource>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectADResourceVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmLinkADResource">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Thumbnail from 'sysComponents/custom_components/custom/Thumbnail';
    import SelectAdImageResource from './SelectADImageResource';

    export default {
        name: 'ADForm',
        components: {
            Thumbnail,
            SelectAdImageResource
        },
        /* status: 'CREATE_BOOT_AD'代表创建开机广告 */
        props: {
            status: {
                type: String,
                default: ''
            },
            adInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('广告名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('广告名称不能超过20字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('广告描述不能为空'));
                } else if (this.$util.trim(value).length > 100) {
                    return callback(new Error('广告描述不能超过100字'));
                } else {
                    callback();
                }
            };
            let checkEffectTime = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('起止时间不能为空'));
                } else {
                    callback();
                }
            };
            return {
                selectADResourceVisible: false,
                isLoading: false,
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    desc: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    effectTime: [
                        {validator: checkEffectTime, trigger: 'blur'}
                    ]
                },
                effectRangeTime: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
            },
            confirmLinkADResource() {

            },
            operateAD() {
                this.$refs['adInfo'].validate((valid) => {
                    if (valid) {
                        if (!this.adInfo.subjectItemList || this.adInfo.subjectItemList.length === 0) {
                            this.$message.warning('请关联相关节目');
                            return;
                        }
                        // 设置节目专题的背景图片
                        if (this.status === 'CREATE_PROGRAMME' || this.status === 'EDIT_PROGRAMME') {
                            this.adInfo.posterImageList.map(image => {
                                if (image.width.toString() === '1920' && image.height.toString() === '1080') {
                                    this.adInfo.backgroundImage = image;
                                }
                            });
                        }
                        this.isLoading = true;
                        // 创建专题
                        if (this.status === 'CREATE_PROGRAMME' || this.status === 'CREATE_FIGURE') {
                            this.adInfo.category = this.status === 'CREATE_PROGRAMME' ? 'PROGRAMME' : 'FIGURE';
                            this.$service.createSubject(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建专题');
                                    this.toADList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        } else {
                            this.$service.updateSubjectInfo(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新专题');
                                    this.toADList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            toADList() {
                this.$router.push({name: 'ADList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
