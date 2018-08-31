<!--节目专题详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'专题管理'},
            {name:'节目专题详情'}]">
        </custom-breadcrumb>
        <div class="text-left main-block">
            <subject-basic-info-detail
                :subjectInfo="subjectInfo"
                status="0">
            </subject-basic-info-detail>
            <div class="vice-block" id="programme-list">
                <h3 class="block-vice-title">专题内节目列表</h3>
                <el-table
                    :data="subjectInfo.subjectItemList"
                    header-row-class-name="common-table-header"
                    row-class-name=programme-row
                    border>
                    <el-table-column
                        width="70px"
                        align="center"
                        label="序号">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="120px"
                        align="center"
                        prop="code"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        width="256px"
                        align="center"
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        width="100px"
                        align="center"
                        label="图片">
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                                :alt="scope.row.coverImage.name"
                                v-if="scope.row.coverImage">
                            <label v-else>------</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="360px"
                        align="center"
                        label="主演">
                        <template slot-scope="scope">
                            <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editBasicInfo">编辑基本信息</el-button>
                <el-button type="primary" class="page-main-btn" @click="editSubjectProgrammes">编辑节目</el-button>
                <el-button @click="toSubjectList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import SubjectBasicInfoDetail from '../SubjectBasicInfoDetail';

    export default {
        name: 'PersonSubjectDetail',
        components: {
            SubjectBasicInfoDetail
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
            width: 967px;
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
