<!--创建节目专题组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>创建节目专题</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <create-subject-form
                status="0">
            </create-subject-form>
        </div>
    </div>
</template>

<script>
    import CreateSubjectForm from './CreateSubjectForm';

    export default {
        name: 'CreateProgrammeSubject',
        components: {
            CreateSubjectForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }
</style>
