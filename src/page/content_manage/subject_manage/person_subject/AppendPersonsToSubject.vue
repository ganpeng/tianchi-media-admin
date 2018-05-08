<!--添加人物到专题组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加专题人物</el-breadcrumb-item>
        </el-breadcrumb>
        <set-subject-persons
            status="0">
        </set-subject-persons>
    </div>
</template>

<script>
    import SetSubjectPersons from './SetSubjectPersons';

    export default {
        name: 'AppendPersonsToSubject',
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
