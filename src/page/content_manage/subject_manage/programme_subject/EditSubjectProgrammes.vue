<!--编辑节目专题内的节目组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑专题中的节目</el-breadcrumb-item>
        </el-breadcrumb>
        <set-subject-programmes
            status="1">
        </set-subject-programmes>
    </div>
</template>

<script>
    import SetSubjectProgrammes from './SetSubjectProgrammes';

    export default {
        name: 'EditSubjectProgrammes',
        components: {
            SetSubjectProgrammes
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="less" scoped>
</style>
