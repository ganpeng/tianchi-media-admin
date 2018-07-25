<!--人物专题详情组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item><label class="subject-name">{{subjectInfo.name}}</label>人物专题详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <subject-basic-info-detail
                :subjectInfo="subjectInfo"
                status="1">
            </subject-basic-info-detail>
            <label class="list-title">专题内人物列表:</label>
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
                    prop="id"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    label="头像">
                    <template slot-scope="scope">
                        <img v-if="scope.row.avatarImage"
                             :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                             @click="displayImage(scope.row.avatarImage)"
                             :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                        <label v-else>------</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="area"
                    label="地区">
                </el-table-column>
            </el-table>
        </div>
        <div class="operate-list">
            <el-button type="primary" @click="editBasicInfo">编辑基本信息</el-button>
            <el-button type="primary" @click="editSubjectPersons">编辑人物</el-button>
            <el-button type="danger" @click="setSubjectVisible">{{subjectInfo.visible ? '下架' : '上架'}}</el-button>
            <el-button type="danger" @click="removeSubject" v-if="!subjectInfo.visible">删 除</el-button>
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
                this.previewImage.uri = image.uri;
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
    }

    .operate-list {
        .el-button {
            margin-right: 30px;
            width: 124px;
        }
    }
</style>
