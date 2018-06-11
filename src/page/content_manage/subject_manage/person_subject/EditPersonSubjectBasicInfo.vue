<!--编辑人物专题基本信息组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑<label class="subject-name">{{subjectInfo.name}}</label>人物专题基本信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <subject-basic-info-form
                :subjectInfo="subjectInfo"
                status="3">
            </subject-basic-info-form>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from '../SubjectBasicInfoForm';

    export default {
        name: 'EditPersonSubjectBasicInfo',
        components: {
            SubjectBasicInfoForm
        },
        data() {
            return {
                subjectInfo: {}
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getSubjectDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.subjectInfo = response.data;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    .subject-name {
        font-style: italic;
        font-weight: bold;
        font-size: 16px;
    }

    .block-box {
        margin-top: 50px;
    }
</style>
