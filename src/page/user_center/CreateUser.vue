<!--创建用户信息组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'用户管理'},
            {name:'创建用户'}]">
        </custom-breadcrumb>
        <user-info-form
            status="0">
        </user-info-form>
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
