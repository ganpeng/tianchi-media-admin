<!--编辑节目专题信息组件-->
<template>
    <div>
        <div class="content-title">编辑节目专题</div>
        <div class="block-box">
            <subject-basic-info-form
                ref="subjectbasicInfoForm"
                :subjectInfo="subjectInfo"
                status="EDIT_PROGRAMME">
            </subject-basic-info-form>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from './components/SubjectInfoForm';

    export default {
        name: 'EditProgrammeSubject',
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
                        this.$nextTick(function () {
                            this.$refs.subjectbasicInfoForm.initProgrammeCatagoryList();
                        });
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
