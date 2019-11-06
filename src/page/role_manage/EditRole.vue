<!--编辑角色的组件-->
<template>
    <div>
        <div class="content-title">编辑角色</div>
        <role-form
            status="EDIT_ROLE">
        </role-form>
    </div>
</template>

<script>
    import RoleForm from './components/RoleForm';

    export default {
        name: 'EditRole',
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
