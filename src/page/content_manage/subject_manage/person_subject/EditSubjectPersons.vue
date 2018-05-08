<!--编辑人物专题中的人物组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑专题中的人物</el-breadcrumb-item>
        </el-breadcrumb>
        <set-subject-persons
            status="1">
        </set-subject-persons>
    </div>
</template>

<script>
    import SetSubjectPersons from './SetSubjectPersons';

    export default {
        name: 'EditSubjectPersons',
        components: {
            SetSubjectPersons
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="less" scoped>
</style>
