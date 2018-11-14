<!--创建人物专题组件-->
<template>
    <div>
        <div class="content-title">添加人物专题</div>
        <div class="block-box">
            <subject-basic-info-form
                :subjectInfo="subjectInfo"
                status="CREATE_FIGURE">
            </subject-basic-info-form>
        </div>
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
                    posterImageList: [
                        {width: 560, height: 600, uri: '/group6/M00/00/2D/CgEBK1uvQ8iAZArbAAAgmokEc3s29.webp'},
                        {width: 240, height: 350, uri: '/group5/M00/00/2D/CgEBKVuvQ1-AcNERAAAn7p1gftA26.webp'}
                    ]
                }
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
