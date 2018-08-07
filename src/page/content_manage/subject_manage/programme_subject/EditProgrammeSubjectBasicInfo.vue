<!--编辑节目专题基本信息组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'专题管理'},
            {name:'编辑基本信息'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <subject-basic-info-form
                ref="subjectbasicInfoForm"
                :subjectInfo="subjectInfo"
                status="2">
            </subject-basic-info-form>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoForm from '../SubjectBasicInfoForm';

    export default {
        name: 'EditProgrammeSubjectBasicInfo',
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
