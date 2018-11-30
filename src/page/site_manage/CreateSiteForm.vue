<!--创建站点表单组件-->
<template>
    <el-form
        class="text-left"
        ref="site"
        :model="site">
        <el-form-item
            label="站点名称"
            label-width="120px"
            required
            prop="name">
            <el-input v-model="site.name" placeholder="请填写站点名称，15字以内" clearable></el-input>
        </el-form-item>
        <el-form-item
            label="站点token"
            label-width="120px"
            required
            prop="token">
            <el-input v-model="site.token" placeholder="点击按钮获取该站点安全访问token" readonly clearable></el-input>
            <el-button
                v-if="mode==='CREATE_SITE'"
                type="primary"
                @click="getSiteToken"
                class="token-btn">
                点击生成token
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>

    export default {
        name: 'CreateSiteForm',
        props: {
            // 创建：'CREATE_SITE',编辑：'EDIT_SITE'
            mode: {
                type: String,
                default: 'CREATE_SITE'
            },
            // 编辑状态的初始化数据
            originSiteInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('站点名称不能为空'));
                } else if (this.$util.trim(value).length > 15) {
                    return callback(new Error('站点名称不能超过15字'));
                } else {
                    callback();
                }
            };
            let checkToken = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('站点token不能为空'));
                } else {
                    callback();
                }
            };
            return {
                site: {
                    name: '',
                    token: ''
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    token: [
                        {validator: checkToken, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originSiteInfo.name) {
                    this.site.name = this.originSiteInfo.name;
                    this.site.token = this.originSiteInfo.token;
                }
            },
            getSiteToken() {

            },
            // 创建或更新站点
            operateSite() {
                this.$refs['site'].validate((valid) => {
                    if (valid) {
                        // 创建
                        if (this.mode === 'CREATE_SITE') {
                            this.$service.createChildSite(this.site).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建站点');
                                    this.setDialogVisible(false);
                                    this.$emit('getSiteList');
                                }
                            });
                        } else {
                            // 更新
                            this.$service.updateSiteInfo(this.site).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新站点');
                                    this.setDialogVisible(false);
                                    this.$emit('getSiteList');
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            setDialogVisible(visible) {
                this.$emit('setSiteDialogVisible', visible);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .token-btn {
        margin-top: 20px;
    }

</style>
