<!--站点配置中心组件-->
<template>
    <div>
        <div class="content-title">配置站点</div>
        <div class="seperator-line"></div>
        <el-form
            ref="siteInfo"
            :rules="infoRules"
            label-width="130px"
            :model="siteInfo"
            class="form-block fill-form">
            <el-form-item
                label="站点名称"
                prop="name">
                <label class="site-name">{{siteInfo.siteName}}</label>
            </el-form-item>
            <el-form-item
                label="站点token配置"
                required
                prop="siteToken">
                <el-input
                    size="medium"
                    v-model="siteInfo.siteToken"
                    placeholder="请填写子站token进行配置">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="operate-block text-center">
            <el-button type="primary" @click="configSite" class="btn-style-two">保存</el-button>
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
            configSite() {
                if (!this.$authority.isHasAuthority('sys:sysConfig:patch')) {
                    return;
                }
                this.$refs['siteInfo'].validate((valid) => {
                    if (valid) {
                        this.$service.configSiteToken({siteToken: this.siteInfo.siteToken}).then(response => {
                            if (response && response.code === 0) {
                                this.$message.success('成功配置站点，将重新更新页面以更新配置');
                                // 保存到localStorage
                                this.$wsCache.localStorage.set('siteInfo', response.data);
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
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
        margin-top: 30px;
    }

    .el-input {
        width: 400px;
    }

    .site-name {
        color: #fff;
    }

    // 操作
    .operate-block {
        position: fixed;
        bottom: 10px;
        left: 0px;
        right: 0px;
        margin: auto;
        width: 500px;
        height: 80px;
        line-height: 90px;
        z-index: 600;
    }

</style>
