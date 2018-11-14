<!--编辑人物专题信息组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'专题管理'},
            {name:'编辑人物专题信息'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <subject-basic-info-form
                ref="subjectbasicInfoForm"
                :subjectInfo="subjectInfo"
                status="EDIT_FIGURE">
            </subject-basic-info-form>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from './components/SubjectInfoForm';

    export default {
        name: 'EditFigureSubject',
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
