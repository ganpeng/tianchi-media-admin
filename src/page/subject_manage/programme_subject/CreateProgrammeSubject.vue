<!--创建节目专题组件-->
<template>
    <div>
        <div class="content-title">添加节目专题</div>
        <div class="block-box">
            <subject-basic-info-form
                :subjectInfo="subjectInfo"
                status="0">
            </subject-basic-info-form>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from '../SubjectBasicInfoForm';

    export default {
        name: 'CreateProgrammeSubject',
        components: {
            SubjectBasicInfoForm
        },
        data() {
            return {
                subjectInfo: {posterImageList: []}
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 60px;
    }
</style>
