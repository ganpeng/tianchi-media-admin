<!--新建部门的组件-->
<template>
    <div>
        <div class="content-title">添加部门</div>
        <department-form
            status="CREATE_DEPARTMENT">
        </department-form>
    </div>
</template>

<script>
    import DepartmentForm from './components/DepartmentForm';

    export default {
        name: 'CreateDepartment',
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
