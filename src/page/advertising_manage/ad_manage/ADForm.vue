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
                    placeholder="请填写100个字以内的描述">
                </el-input>
            </el-form-item>
            <el-form-item label="广告类型" prop="category" required>
                <label>开机广告</label>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateSubject" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toSubjectList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ADForm',
        components: {},
        /* status: 'CREATE_POWER_ON_AD'代表创建开机广告 */
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
            return {
                isLoading: false,
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
            },
            operateSubject() {
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
                                    this.toSubjectList();
                                } else {
                                    this.isLoading = false;
                                }
                            });
                        } else {
                            this.$service.updateSubjectInfo(this.adInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新专题');
                                    this.toSubjectList();
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
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .btn-style-two {
        &.contain-svg-icon {
            padding: 4px 12px;
            line-height: 34px;
        }
        span {
            display: flex;
            align-items: center;
        }
        * {
            color: #1989FA;
        }
        .svg-icon {
            margin-right: 8px;
            width: 20px !important;
            height: 20px !important;
            fill: #1989FA;
        }
    }

</style>
