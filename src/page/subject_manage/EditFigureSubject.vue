<!--编辑人物专题信息组件-->
<template>
    <div>
        <div class="content-title">编辑人物专题</div>
        <subject-info-form
            ref="subjectInfoForm"
            :subjectInfo="subjectInfo"
            status="EDIT_FIGURE">
        </subject-info-form>
    </div>
</template>

<script>
    import SubjectInfoForm from './components/SubjectInfoForm';

    export default {
        name: 'EditFigureSubject',
        components: {
            SubjectInfoForm
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
                        this.$nextTick(function () {
                            this.$refs.subjectInfoForm.initProgrammeCatagoryList();
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
