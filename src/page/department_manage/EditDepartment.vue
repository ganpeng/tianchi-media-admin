<!--编辑部门的组件-->
<template>
    <div>
        <div class="content-title">编辑部门</div>
        <department-form
            status="EDIT_DEPARTMENT">
        </department-form>
    </div>
</template>

<script>
    import DepartmentForm from './components/DepartmentForm';

    export default {
        name: 'EditDepartment',
        components: {
            DepartmentForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
