<template>
    <div class="app-navbar-form-container">
        <div class="form-container">
            <el-form :model="navbar" :rules="inputRules" status-icon
                label-width="120px" @submit.native.prevent class="form-block my-form">
                <el-col :span="8">
                    <el-form-item label="栏目名称" prop="name">
                        <el-input v-model="navbar.name" placeholder="请输入栏目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目板式" prop="layoutTemplate">
                        <el-radio v-model="navbar.layoutTemplate" label="M_FS_0">&nbsp;</el-radio>
                        <svg-icon icon-class="model_child"></svg-icon>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppNavBarForm',
    data() {
        return {
            navbar: {
                name: '',
                layoutTemplate: 'M_FS_0'
            },
            inputRules: {}
        };
    }
};
</script>
<style lang="scss" scoped>
.app-navbar-form-container {

}
</style>
