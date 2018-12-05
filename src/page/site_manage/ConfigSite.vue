<!--站点配置中心组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'站点管理'},
            {name:'配置站点'}]">
        </custom-breadcrumb>
        <el-form
            class="text-left"
            ref="siteInfo"
            :rules="infoRules"
            :model="siteInfo">
            <el-form-item
                label="站点名称"
                label-width="120px"
                prop="name">
                <label>{{siteInfo.siteName}}</label>
            </el-form-item>
            <el-form-item
                label="站点token配置"
                label-width="120px"
                required
                prop="siteToken">
                <el-input
                    v-model="siteInfo.siteToken"
                    placeholder="请填写子站token进行配置"
                    @blur="getSiteNameByToken">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="operate">
            <el-button @click="configSite" type="primary" class="page-main-btn">保存</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ConfigSite',
        data() {
            let checkSiteToken = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('站点token不能为空'));
                } else {
                    callback();
                }
            };
            return {
                siteInfo: {
                    siteName: '',
                    siteToken: ''
                },
                infoRules: {
                    token: [
                        {validator: checkSiteToken, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.siteInfo.siteName = (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteName) ? this.$wsCache.localStorage.get('siteInfo').siteName : '站点未配置,请输入token进行配置';
                this.siteInfo.siteToken = (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteName) ? this.$wsCache.localStorage.get('siteInfo').siteToken : '';
            },
            getSiteNameByToken() {

            },
            configSite() {
                this.$refs['siteInfo'].validate((valid) => {
                    if (valid) {
                        this.$service.configSiteToken({siteToken: this.siteInfo.siteToken}).then(response => {
                            if (response && response.code === 0) {
                                this.$message.success('成功配置站点');
                                // 保存到localStorage
                                this.$wsCache.localStorage.set('siteInfo', response.data);
                                window.location.reload();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        margin-top: 50px;
    }

    .el-input {
        width: 400px;
    }

    .operate {
        margin-top: 200px;
        margin-bottom: 80px;
    }

</style>
