<!--人物专题详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'专题管理'},
            {name:'人物专题详情'}]">
        </custom-breadcrumb>
        <div class="main-block text-left">
            <subject-basic-info-detail
                :subjectInfo="subjectInfo"
                status="1">
            </subject-basic-info-detail>
            <div class="vice-block" id="figure-list">
                <h3 class="block-vice-title">专题内节目列表</h3>
                <el-table
                    :data="subjectInfo.subjectItemList"
                    row-class-name=figure-row
                    header-row-class-name="common-table-header"
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
                        prop="id"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        width="256px"
                        align="center"
                        prop="name"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        width="160px"
                        align="center"
                        label="图片">
                        <template slot-scope="scope">
                            <img :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                                 :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="360px"
                        align="center"
                        prop="area"
                        label="地区">
                    </el-table-column>
                </el-table>
            </div>
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editBasicInfo">编辑基本信息</el-button>
                <el-button type="primary" class="page-main-btn" @click="editSubjectPersons">编辑人物</el-button>
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
                    name: 'EditPersonSubject', params: this.$route.params
                });
            },
            // 编辑当前专题人物信息
            editSubjectPersons() {
                this.$router.push({
                    name: 'EditSubjectPersons', params: this.$route.params
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

    #figure-list {
        margin-bottom: 200px;
        .el-table {
            margin-top: 0px;
            width: 967px;
        }
        img {
            width: 100px;
            height: 100px;
        }
    }

    #operate-list {
        position: absolute;
        right: 0px;
        top: 10px;
        .el-button {
            margin-right: 30px;
            width: 120px;
        }
    }

</style>
