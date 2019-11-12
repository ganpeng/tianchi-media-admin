<!--新建管理员的组件-->
<template>
    <div>
        <div class="content-title">添加管理员</div>
        <admin-form
            status="CREATE_ADMIN">
        </admin-form>
    </div>
</template>

<script>
    import AdminForm from './components/AdminForm';

    export default {
        name: 'CreateAdmin',
        components: {
            AdminForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
