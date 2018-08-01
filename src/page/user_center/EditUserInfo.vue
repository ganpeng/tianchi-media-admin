<!--编辑用户信息组件-->
<template>
    <div>
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

</style>
