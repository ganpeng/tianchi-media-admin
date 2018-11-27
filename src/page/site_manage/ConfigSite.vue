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
            :model="siteInfo">
            <el-form-item
                label="站点名称"
                label-width="120px"
                prop="name">
                <label>{{siteInfo.name}}</label>
            </el-form-item>
            <el-form-item
                label="站点token配置"
                label-width="120px"
                prop="token">
                <el-input v-model="siteInfo.token" readonly></el-input>
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
            return {
                siteInfo: {
                    name: '北京站',
                    token: 'GIJIHBFHFLJF7856656FTDRT'
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            configSite() {
                this.$refs['siteInfo'].validate((valid) => {
                    if (valid) {
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
