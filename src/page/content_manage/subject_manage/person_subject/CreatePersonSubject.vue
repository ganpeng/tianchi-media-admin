<!--创建人物专题表单组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>创建人物专题</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <subject-basic-info-form
                :subjectInfo="subjectInfo"
                status="1">
            </subject-basic-info-form>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from '../SubjectBasicInfoForm';

    export default {
        name: 'CreatePersonSubject',
        components: {
            SubjectBasicInfoForm
        },
        data() {
            return {
                subjectInfo: {}
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }
</style>
