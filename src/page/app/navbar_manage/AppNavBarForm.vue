<template>
    <div class="app-navbar-form-container">
        <div class="form-container">
            <el-form :model="navbar" ref="navbarForm" :rules="inputRules" status-icon
                label-width="120px" @submit.native.prevent class="form-block my-form">
                <el-col :span="8">
                    <el-form-item label="栏目名称" prop="name">
                        <el-input v-model="navbar.name" placeholder="请输入栏目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目分类" prop="signCode">
                        <el-select
                            v-model="navbar.signCode"
                            clearable
                            size="medium"
                            placeholder="请选择栏目分类">
                            <el-option
                                v-for="item in programmeCategoryListOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.signCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="栏目板式" prop="layoutTemplate">
                        <el-radio v-model="navbar.layoutTemplate" label="M_FS_1">首页板式</el-radio><br>
                        <svg-icon icon-class="app_navbar_layouttemplate"></svg-icon>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createAppNavBar">保存</el-button>
            <el-button class="btn-style-three" @click="toAppNavBarSetting">返回</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppNavBarForm',
    props: ['status'],
    data() {
        return {
            navbar: {
                name: '',
                type: 'SYSTEM', //  SYSTEM, CUSTOM
                layoutTemplate: 'M_FS_1',
                signCode: '',
                applicableClientList: ['APP']
            },
            inputRules: {
                name: [
                    {required: true, message: '请输入栏目名称'},
                    {min: 1, max: 10, message: '栏目名称应在10字以内'}
                ]
            },
            programmeCategoryListOptions: []
        };
    },
    async created() {
        try {
            let categoryRes = await this.$service.getProgrammeCategory();
            if (categoryRes && categoryRes.code === 0) {
                this.programmeCategoryListOptions = categoryRes.data;
            }
            if (this.status === 'EDIT') {
                let {id} = this.$route.params;
                let res = await this.$service.getAppNavBarById(id);
                if (res && res.code === 0) {
                    this.navbar = res.data;
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        async createAppNavBar() {
            try {
                let valid = await this.$refs.navbarForm.validate();
                if (valid) {
                    if (this.status === 'CREATE') {
                        let res = await this.$service.createAppNavBar(this.navbar);
                        if (res && res.code === 0) {
                            this.toAppNavBarSetting();
                        } else {
                            this.$message.error(`栏目保存失败`);
                        }
                    } else {
                        let res = await this.$service.patchAppNavBar(this.navbar);
                        if (res && res.code === 0) {
                            this.toAppNavBarSetting();
                        } else {
                            this.$message.error(`栏目保存失败`);
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        toAppNavBarSetting() {
            this.$router.push({name: 'AppNavBarSetting'});
        }
    }
};
</script>
<style lang="scss" scoped>
.app-navbar-form-container {
    .svg-icon {
        width: 130px;
        height: 234px;
    }
}
</style>
