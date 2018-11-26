<!--站点管理-站点列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'站点管理'},
            {name:'站点列表'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <div @keyup.enter="getSiteList" class="text-left">
                <el-form :inline="true" class="filter-form">
                    <el-form-item>
                        <el-input v-model="listQueryParams.keyword" placeholder="请填写站点名称、token等"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain icon="el-icon-search" @click="getSiteList">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    header-row-class-name="common-table-header"
                    :data="siteList"
                    border
                    row-class-name=subject-row
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        width="200px"
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="140px"
                        prop="token"
                        label="token">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="140px"
                        label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        width="140px"
                        class="operate">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="detail-btn" @click="editSite(scope.row)">编辑
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                class="remove-btn"
                                @click="removeSite(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="listQueryParams.pageNum"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="listQueryParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                <div class="create-item">
                    <el-button class="create-blue-btn contain-svg-icon" @click="createSite">
                        <svg-icon icon-class="add"></svg-icon>
                        创建站点
                    </el-button>
                </div>
            </div>
        </div>
        <el-dialog
            :title="dialogTitle"
            :close-on-click-modal="false"
            :visible.sync="createSiteFormVisible"
            width="50%">
            <create-site-form
                v-if="createSiteFormVisible"
                ref="createSiteDialog"
                :mode="dialogMode"
                :dialogTitle="dialogTitle"
                :originSiteInfo="currentSiteInfo"
                v-on:setSiteDialogVisible="setSiteDialogVisible"
                v-on:getSiteList="getSiteList">
            </create-site-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createSiteFormVisible = false">取消</el-button>
                <el-button type="primary" @click="operateSite">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import CreateSiteForm from './CreateSiteForm';

    export default {
        name: 'SiteList',
        components: {
            CreateSiteForm
        },
        data() {
            return {
                dialogTitle: '创建站点',
                currentSiteInfo: {},
                dialogMode: 'CREATE_SITE',
                createSiteFormVisible: false,
                listQueryParams: {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                siteList: [
                    {
                        name: '北京站',
                        token: 'GTHNBN68hIKn89t54HKLV',
                        createdAt: '34647567686787'
                    }
                ]
            };
        },
        mounted() {
        },
        methods: {
            getSiteList() {
                this.$service.getSiteList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.siteList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getSiteList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getSiteList();
            },
            editSite(item) {
                this.currentSiteInfo = item;
                this.dialogTitle = '编辑站点';
                this.dialogMode = 'EDIT_SITE';
                this.setSiteDialogVisible(true);
            },
            // 删除站点
            removeSite(item) {
                this.$confirm('此操作将删除当前站点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteSite(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: item.name + '站点删除成功!'
                            });
                            this.getSiteList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            createSite() {
                this.currentSiteInfo = {};
                this.dialogTitle = '创建站点';
                this.dialogMode = 'CREATE_SITE';
                this.setSiteDialogVisible(true);
            },
            setSiteDialogVisible(visible) {
                this.createSiteFormVisible = visible;
            },
            operateSite() {
                this.$refs.createSiteDialog.operateSite();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .block-box {
        position: relative;
        padding-top: 55px;
    }

    .el-input {
        width: 400px;
    }

    .create-item {
        position: absolute;
        right: 0px;
        top: 10px;
    }

    .el-table {
        margin-top: 0px;
    }

    .el-pagination {
        margin-bottom: 50px;
    }

    .detail-btn {
        padding-left: 12px;
        margin-right: 12px;
    }

</style>
