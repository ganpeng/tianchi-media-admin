<!--节目专题详情组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item><label class="subject-name">{{subjectInfo.name}}</label>节目专题详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <subject-basic-info-detail
                :subjectInfo="subjectInfo"
                status="0">
            </subject-basic-info-detail>
            <label class="list-title">专题内节目列表:</label>
            <el-table
                :data="subjectInfo.subjectItemList"
                border
                style="width: 100%">
                <el-table-column
                    label="序号">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="图片">
                    <template slot-scope="scope">
                        <img
                            :src="scope.row.coverImage ? scope.row.coverImage.uri : ''"
                            :alt="scope.row.coverImage.name"
                            @click="displayImage(scope.row)"
                            v-if="scope.row.coverImage">
                        <label v-else>------</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="chiefActor"
                    label="主演">
                    <template slot-scope="scope">
                        <label v-if="scope.row.chiefActor && scope.row.chiefActor.length !== 0">{{scope.row.chiefActor |
                            jsonJoin('name')}}</label>
                        <label v-else>------</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="director"
                    label="导演">
                    <template slot-scope="scope">
                        <label v-if="scope.row.director && scope.row.director.length !== 0">{{scope.row.director |
                            jsonJoin('name')}}</label>
                        <label v-else>------</label>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="operate-list">
            <el-button type="primary" @click="editBasicInfo">编辑基本信息</el-button>
            <el-button type="primary" @click="editSubjectProgrammes">编辑节目</el-button>
            <el-button type="danger" @click="removeSubject">删 除</el-button>
        </div>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>

<script>
    import SubjectBasicInfoDetail from '../SubjectBasicInfoDetail';
    import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';

    export default {
        name: 'PersonSubjectDetail',
        components: {
            SubjectBasicInfoDetail,
            PreviewSingleImage
        },
        data() {
            return {
                previewImage: {
                    title: '',
                    display: false,
                    url: ''
                },
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
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.url = image.uri;
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
                    name: 'EditProgrammeSubject', params: this.$route.params
                });
            },
            // 编辑当前专题节目信息
            editSubjectProgrammes() {
                this.$router.push({
                    name: 'EditSubjectProgrammes', params: this.$route.params
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

    .list-title {
        margin-left: 20px;
    }

    .el-table {
        margin-top: 20px;
        margin-bottom: 40px;
        img {
            width: 120px;
            cursor: zoom-in;
        }
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }
    }

    .operate-list {
        .el-button {
            margin-right: 30px;
            width: 124px;
        }
    }
</style>
