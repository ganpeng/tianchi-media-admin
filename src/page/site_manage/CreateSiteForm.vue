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
            return {
                site: {
                    id: '',
                    name: ''
                },
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
                if (this.originSiteInfo.name) {
                    this.site.id = this.originSiteInfo.id;
                    this.site.name = this.originSiteInfo.name;
                }
            },
            // 创建或更新站点
            operateSite() {
                this.$refs['site'].validate((valid) => {
                    if (valid) {
                        // 创建
                        if (this.mode === 'CREATE_SITE') {
                            this.$service.createChildSite({name: this.site.name}).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建站点');
                                    this.setDialogVisible(false);
                                    this.$emit('getSiteList');
                                }
                            });
                        } else {
                            // 更新
                            this.$service.updateChildSite(this.site).then(response => {
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

</style>
