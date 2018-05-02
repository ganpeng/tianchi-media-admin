<!--管理员列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input v-model="searchContent" placeholder="搜索你想要的信息">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item class="create-account">
                <el-tag>
                    <router-link to="/admin-manage/create">创建管理员</router-link>
                </el-tag>
            </el-form-item>
        </el-form>
        <el-table
            :data="adminList"
            border
            style="width: 100%">
            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="telephone"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号码">
            </el-table-column>
            <el-table-column
                label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                label="最后登录时间">
                <template slot-scope="scope">
                    {{scope.row.lastLoginAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center"
                             fixed="right"
                             label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="checkDetail(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="editAdminInfo(scope.row.id)">编辑</el-button>
                    <el-button v-if="scope.row.status === 'NORMAL'" type="danger" size="mini" plain
                               @click="disabledConfirm(scope.row.id,scope.row.status)">
                        禁用
                    </el-button>
                    <el-button v-else type="success" size="mini" plain
                               @click="recoverConfirm(scope.row.id,scope.row.status)">
                        恢复
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'AdminList',
        data() {
            return {
                searchContent: '',
                adminList: [],
                currentPage: 1,
                pageSize: 10,
                totalAmount: 0
            };
        },
        mounted() {
            this.getAdminList();
        },
        methods: {
            // 获取管理员列表数据
            getAdminList() {
                this.$service.getAdminList({
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                }).then(response => {
                    if (response) {
                        this.adminList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            // 跳转到详情页面
            checkDetail(userId) {
                this.$router.push({name: 'AdminDetail', params: {id: userId}});
            },
            editAdminInfo(userId) {
                this.$router.push({name: 'EditAdmin', params: {id: userId}});
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getAdminList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getAdminList();
            },
            // 禁用确认
            disabledConfirm(userId, userStatus) {
                this.$confirm('此操作将禁用该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setAdminStatus(userId, userStatus);
                }).catch(() => {
                    this.$message('已取消禁用');
                });
            },
            // 恢复确认
            recoverConfirm(userId, userStatus) {
                this.$confirm('此操作将恢复该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setAdminStatus(userId, userStatus);
                }).catch(() => {
                    this.$message('已取消恢复');
                });
            },
            // 禁用或恢复管理员账号状态
            setAdminStatus(userId, userStatus) {
                let status = userStatus === 'NORMAL' ? 'FORBIDDEN' : 'NORMAL';
                this.$service.setAdminStatus({id: userId, status: status}).then(response => {
                    if (response) {
                        if (userStatus === 'NORMAL') {
                            this.$message({
                                type: 'success',
                                message: '禁用成功!'
                            });
                        } else {
                            this.$message({
                                type: 'success',
                                message: '恢复成功!'
                            });
                        }
                        this.getAdminList();
                    }
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
        }
        .create-account {
            float: right;
            margin-right: 40px;
            i {
                cursor: pointer;
                &:hover {
                    color: #409EFF;
                }
            }
        }
        .el-tag {
            cursor: pointer;
            a {
                display: block;
                height: 100%;
                width: 100%;
            }
        }
    }
</style>
