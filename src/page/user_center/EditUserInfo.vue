<!--编辑用户信息组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'用户管理'},
            {name:'编辑用户信息'}]">
        </custom-breadcrumb>
        <user-info-form
            status="1">
        </user-info-form>
    </div>
</template>

<script>

    import UserInfoForm from './UserInfoForm';

    export default {
        name: 'EditUserInfo',
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
