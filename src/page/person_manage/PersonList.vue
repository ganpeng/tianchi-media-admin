<!--人物列表组件-->
<template>
    <div>
        <el-breadcrumb class="gp-breadcrumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form text-left">
            <el-form-item label="地区">
                <el-select
                    :value="searchFields.area"
                    filterable
                    clearable
                    placeholder="请选择地区"
                    @input="inputHandler($event, 'area')">
                    <el-option
                        v-for="(item, index) in areaOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="search">
                <el-input
                    :value="searchFields.name"
                    @input="inputHandler($event, 'name')"
                    placeholder="搜索你想要的信息"
                    clearable
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getPersonList">搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-tag>
                    <router-link to="/person-manage/create">
                        <i class="el-icon-circle-plus-outline"></i>
                        新增人物
                    </router-link>
                </el-tag>
                <el-button size="small" type="primary" plain @click="showFileUploadDialog">导入人物</el-button>
            </el-form-item>
        </el-form>
        <el-table class="my-table-style" :data="list" border>
            <el-table-column prop="id" align="center" width="240px" label="编号"></el-table-column>
            <el-table-column label="照片" align="center" >
                <template slot-scope="scope">
                    <img @click="displayImage(scope.row.avatarImage ? scope.row.avatarImage : {} )" width="80px" height="80px" class="person-image pointer" :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="名字"></el-table-column>
            <el-table-column prop="description" align="center" width="300px" label="人物简介"></el-table-column>
            <el-table-column prop="area" width="120px" align="center" label="地区">
                <template slot-scope="scope">
                    {{areaLabel(scope.row.area)}}
                </template>
            </el-table-column>
            <el-table-column prop="birthday" width="120px" align="center" label="出生日期">
                <template slot-scope="scope">
                    {{scope.row.birthday | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column prop="height" align="center" label="身高"></el-table-column>
            <el-table-column prop="weight" align="center" label="体重"></el-table-column>
            <el-table-column prop="mainRole" align="center" min-width="150" label="职业">
                <template slot-scope="scope">
                    {{mainRoleLabel(scope.row.mainRoleList)}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button class="text-success" type="text" size="small" @click="displayPerson(scope.row.id)">详情</el-button>
                    <el-button type="text" size="small" @click="editPerson(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
        <el-dialog
            title="上传人物表格"
            :visible.sync="fileUploadDialogVisible"
            :headers="uploadHeaders"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                :headers="uploadHeaders"
                accept=".xlsx, .xls"
                action="/admin/v1/content/figure/import"
                :auto-upload="false"
                :file-list="fileList"
                :on-success="uploadSuccessHandler"
                :with-credentials="true">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" @click="submitUpload" type="success">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFileUploadDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';
    export default {
        name: 'PersonList',
        components: {
            PreviewSingleImage
        },
        data() {
            return {
                areaOptions: store.get('areaList'),
                previewImage: {
                    title: '',
                    display: false,
                    uri: ''
                },
                //  人物导入
                fileUploadDialogVisible: false,
                fileList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token)
            };
        },
        created() {
            this.resetPerson();
            this.getPersonList({isProgramme: false});
        },
        computed: {
            ...mapGetters({
                list: 'person/list',
                searchFields: 'person/searchFields',
                pagination: 'person/pagination',
                mainRoleLabel: 'person/mainRoleLabel'
            })
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'person/updateSearchFields',
                updatePagination: 'person/updatePagination',
                resetPerson: 'person/resetPerson'
            }),
            ...mapActions({
                getPersonList: 'person/getPersonList'
            }),
            areaLabel(code) {
                let area = this.areaOptions.find((area) => area.code === code);
                return area ? area.name : '';
            },
            // 跳转到详情页面
            displayPerson(userId) {
                this.$router.push({ name: 'DisplayPerson', params: { id: userId } });
            },
            editPerson(userId) {
                this.$router.push({ name: 'EditPerson', params: { id: userId } });
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                this.getPersonList({isProgramme: false});
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
            },
            //  人物导入
            submitUpload() {
                this.$refs.upload.submit();
            },
            closeFileUploadDialog() {
                this.fileUploadDialogVisible = false;
                this.fileList = [];
            },
            showFileUploadDialog() {
                this.fileUploadDialogVisible = true;
            },
            uploadSuccessHandler(res, file, fileList) {
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '人物导入成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '人物导入失败'
                    });
                }
                this.closeFileUploadDialog();
            }
        }
    };
</script>
<style scoped lang="less">
</style>
