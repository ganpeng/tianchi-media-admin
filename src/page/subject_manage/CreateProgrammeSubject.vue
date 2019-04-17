<!--创建节目专题组件-->
<template>
    <div>
        <div class="content-title">添加节目专题</div>
        <subject-basic-info-form
            :subjectInfo="subjectInfo"
            status="CREATE_PROGRAMME">
        </subject-basic-info-form>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from './components/SubjectInfoForm';

    export default {
        name: 'CreateProgrammeSubject',
        components: {
            SubjectBasicInfoForm
        },
        data() {
            return {
                subjectInfo: {
                    posterImageList: [],
                    posterImageListForApp: [],
                    applicableClientList: []
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
