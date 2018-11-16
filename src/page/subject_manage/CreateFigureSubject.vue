<!--创建人物专题组件-->
<template>
    <div>
        <div class="content-title">添加人物专题</div>
        <subject-basic-info-form
            :subjectInfo="subjectInfo"
            status="CREATE_FIGURE">
        </subject-basic-info-form>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from './components/SubjectInfoForm';

    export default {
        name: 'CreateFigureSubject',
        components: {
            SubjectBasicInfoForm
        },
        data() {
            return {
                subjectInfo: {
                    posterImageList: []
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
