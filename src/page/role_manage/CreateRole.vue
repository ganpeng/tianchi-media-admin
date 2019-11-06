<!--新建角色的组件-->
<template>
    <div>
        <div class="content-title">添加角色</div>
        <role-form
            status="CREATE_ROLE">
        </role-form>
    </div>
</template>

<script>
    import RoleForm from './components/RoleForm';

    export default {
        name: 'CreateRole',
        components: {
            RoleForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
