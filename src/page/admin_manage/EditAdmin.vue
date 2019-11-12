<!--编辑管理员的组件-->
<template>
    <div>
        <div class="content-title">编辑管理员</div>
        <admin-form
            status="EDIT_ADMIN">
        </admin-form>
    </div>
</template>

<script>
    import AdminForm from './components/AdminForm';

    export default {
        name: 'EditAdmin',
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
