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
                <el-button type="primary" @click="editBasicInfo">编辑基本信息</el-button>
                <el-button type="primary" @click="editSubjectPersons">编辑人物</el-button>
                <el-button type="danger" @click="setSubjectVisible">{{subjectInfo.visible ? '下架' : '上架'}}</el-button>
                <el-button type="danger" @click="removeSubject" v-if="!subjectInfo.visible">删 除</el-button>
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
            // 设置专题的上下架
            setSubjectVisible() {
                this.$confirm('此操作将' + (this.subjectInfo.visible ? '下架该专题' : '上架该专题') + ', 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    this.$service.setSubjectVisible(this.subjectInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message(this.subjectInfo.visible ? '下架成功' : '上架成功');
                            this.subjectInfo.visible = !this.subjectInfo.visible;
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + (this.subjectInfo.visible ? '下架该专题' : '上架该专题')
                    });
                });
            },
            // 删除当前专题，并跳转专题列表页面
            removeSubject() {
                this.$confirm('此操作将删除当前专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteSubject(this.$route.params.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$router.push({name: 'SubjectList'});
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
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
