<!--创建用户信息组件-->
<template>
    <div class="create-user-container">
        <h2 class="content-title">创建用户</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-col :span="8">
                <user-info-form
                    status="0">
                </user-info-form>
            </el-col>
        </div>
    </div>
</template>
<script>
    import UserInfoForm from './UserInfoForm';

    export default {
        name: 'CreateUser',
        components: {
            UserInfoForm
        },
        data() {
            return {};
        }
    };
</script>

<style lang="scss" scoped>

    .el-breadcrumb {
        margin-bottom: 60px;
    }

</style>
