<!--人物列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'人物资源管理'},
            {name:'人物列表-查询重复'}]">
        </custom-breadcrumb>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left">
            <el-form-item class="float-right">
                <el-button class="page-main-btn" @click="goBack" plain>返回人物列表</el-button>
            </el-form-item>
            <el-col :span="24">
                <el-form-item class="search">
                    <el-input
                        :value="duplicate.searchFields.name"
                        @input="inputHandler($event, 'name')"
                        placeholder="搜索你想要的信息"
                        clearable
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="page-main-btn" type="primary" @click="getDuplicateListHandler" icon="el-icon-search" plain>搜索</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <el-table :row-class-name='"figure-row"' :header-row-class-name='"common-table-header"' class="my-table-style" :data="duplicate.list" border>
            <el-table-column prop="id" align="center" width="120px" label="编号">
                <template slot-scope="scope">
                    {{scope.row.id | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="名字">
                <template slot-scope="scope">
                    <span class="ellipsis three">
                        {{scope.row.name | padEmpty}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="照片" width="120px" align="center" >
                <template slot-scope="scope">
                    <img v-if="scope.row.avatarImage" @click="displayImage(scope.row.avatarImage ? scope.row.avatarImage : {} )" width="100px" height="100px" class="pointer" :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
                    <span v-else>------</span>
                </template>
            </el-table-column>
            <el-table-column prop="area" align="center" label="地区">
                <template slot-scope="scope">
                    {{areaLabel(scope.row.area) | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column prop="mainRole" align="center" label="职业">
                <template slot-scope="scope">
                    <span class="ellipsis three">
                        {{mainRoleLabel(scope.row.mainRoleList).join(', ') | padEmpty}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <i v-if="scope.row.visible" class="status-normal">已上架</i>
                    <i v-else class="status-abnormal">已下架</i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" label="操作">
                <template slot-scope="scope">
                    <div class="btn-wrapper">
                        <el-button class="text-success" type="text" size="small" @click="displayPerson(scope.row.id)">详情</el-button>
                        <el-button type="text" size="small" @click="editPerson(scope.row.id)">编辑</el-button>
                        <el-button type="text" size="small" @click="_lowerFramePerson(scope.row)">
                            {{scope.row.visible ? '下架' : '上架'}}
                        </el-button>
                        <el-button class="text-danger" type="text" size="small" @click="_deletePerson(scope.row.id)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="duplicate.pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="duplicate.pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="duplicate.pagination.total">
        </el-pagination>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
    import role from '../../util/config/role';
    export default {
        name: 'DuplicateList',
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
                }
            };
        },
        created() {
            this.getDuplicateList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        beforeRouteLeave(to, from, next) {
            let {name} = to;
            if (name !== 'DisplayPerson' && name !== 'EditPerson') {
            }
            next();
        },
        computed: {
            ...mapGetters({
                duplicate: 'person/duplicate',
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
                resetSearchFields: 'person/resetSearchFields',
                resetPagination: 'person/resetPagination',
                // 人物去重部分
                setDuplicateList: 'person/setDuplicateList',
                setDuplicatePagination: 'person/setDuplicatePagination',
                updateDuplicatePagination: 'person/updateDuplicatePagination',
                updateDuplicateSearchFields: 'person/updateDuplicateSearchFields'
            }),
            ...mapActions({
                lowerFramePerson: 'person/lowerFramePerson',
                deletePerson: 'person/deletePerson',
                getDuplicateList: 'person/getDuplicateList'
            }),
            clearSearchFields() {
                this.resetSearchFields();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.getDuplicateList();
                }
            },
            createPerson() {
                this.$router.push({ name: 'CreatePerson' });
            },
            areaLabel(code) {
                let reg = /^\d+(\.\d+)?$/;
                if (reg.test(code)) {
                    let area = this.areaOptions.find((area) => area.code === code);
                    return area ? area.name : '';
                } else {
                    return code;
                }
            },
            // 跳转到详情页面
            displayPerson(userId) {
                this.$router.push({ name: 'DisplayPerson', params: { id: userId } });
            },
            editPerson(userId) {
                this.$router.push({ name: 'EditPerson', params: { id: userId } });
            },
            handlePaginationChange(value, key) {
                this.updateDuplicatePagination({value, key});
                this.getDuplicateList();
            },
            inputHandler(value, key) {
                this.updateDuplicateSearchFields({key, value});
            },
            _lowerFramePerson(person) {
                let {id, visible} = person;
                this.$confirm(`您确定要${visible ? '下架人物' : '上架人物'}吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.lowerFramePerson(id)
                            .then((res) => {
                                if (res && res.code === 0) {
                                    this.$message.success(`人物${visible ? '下架' : '上架'}成功`);
                                    this.getDuplicateList();
                                } else {
                                    this.$message.error(this.lowerFramePersonErrorHandler(res));
                                }
                            });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            lowerFramePersonErrorHandler(res) {
                let {code, data, message} = res;
                let msg = '';
                switch (code) {
                    case 3206:
                        msg = data.map((item) => {
                            return item ? `"${item}"` : '';
                        }).join(',');
                        return `人物包含在如下${msg}专题中`;
                    case 3207:
                        msg = data.map((item) => {
                            return item ? `"${item}"` : '';
                        }).join(',');
                        return `人物包含在如下${msg}推荐位`;
                    case 3208:
                        msg = data.map((item) => {
                            let obj = role.RECOMMEND_OPTIONS.find((ele) => ele.value === item);
                            return obj ? `"${obj.name}"` : '';
                        }).join(', ');
                        return `人物在以下栏目${msg}中是热门人物`;
                    default:
                        return message;
                }
            },
            _deletePerson(id) {
                this.$confirm(`您确定要删除该人物吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.deletePerson(id)
                            .then((res) => {
                                if (res && res.code === 0) {
                                    this.$message.success('人物删除成功');
                                    this.getDuplicateList();
                                } else {
                                    let msg = res.message || '人物删除失败';
                                    this.$message.error(msg);
                                }
                            });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            // 重复人物查询
            getDuplicateListHandler() {
                this.getDuplicateList();
            },
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
            },
            goBack() {
                this.$router.back();
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
.btn-wrapper .el-button {
    &:nth-of-type(2n + 1) {
        margin-left: 10px;
    }
}
</style>
