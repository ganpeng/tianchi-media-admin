<!--人物专题详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'专题管理'},
            {name:'人物专题详情'}]">
        </custom-breadcrumb>
        <div class="text-left main-block">
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editBasicInfo">编辑基本信息</el-button>
                <el-button type="primary" class="page-main-btn" @click="editSubjectProgrammes">编辑节目</el-button>
                <el-button @click="toSubjectList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'FigureSubjectDetail',
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
            },
            // 编辑当前专题基本信息
            editBasicInfo() {
                this.$router.push({
                    name: 'EditProgrammeSubject', params: this.$route.params
                });
            },
            // 编辑当前专题节目信息
            editSubjectProgrammes() {
                this.$router.push({
                    name: 'EditSubjectProgrammes', params: this.$route.params
                });
            },
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .main-block {
        position: relative;
        padding-top: 80px;
    }

    #programme-list {
        margin-bottom: 200px;
        .el-table {
            margin-top: 0px;
            width: 908px;
        }
        img {
            width: 70px;
        }
    }

    #operate-list {
        position: absolute;
        right: 0px;
        top: 10px;
    }
</style>
