<!--管理员列表组件-->
<template>
    <div @keyup.enter="getAdminList">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'管理员管理'},
            {name:'管理员列表'}]">
        </custom-breadcrumb>
        <el-form :inline="true" class="search-form">
            <el-form-item class="float-right">
                <el-button
                    class="page-main-btn create-blue-btn contain-svg-icon"
                    @click="createAdmin">
                    <svg-icon icon-class="add"></svg-icon>
                    创建管理员
                </el-button>
            </el-form-item>
            <el-col :span="24">
                <el-form-item>
                    <el-input v-model="keyword" placeholder="搜索你想要的信息" clearable></el-input>
                    <el-input v-show="false"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="page-main-btn" icon="el-icon-search" type="primary" @click="getAdminList" plain>搜索</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <el-table
            :data="adminList"
            border
            header-row-class-name="common-table-header"
            style="width: 100%">
            <el-table-column
                prop="name"
                align="center"
                label="姓名">
                <template slot-scope="scope">
                    {{scope.row.name | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                prop="email"
                align="center"
                label="邮箱">
                <template slot-scope="scope">
                    {{scope.row.email | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                prop="telephone"
                align="center"
                label="电话">
                <template slot-scope="scope">
                    {{scope.row.telephone | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                prop="mobile"
                align="center"
                label="手机号码">
                <template slot-scope="scope">
                    {{scope.row.mobile | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="最后登录时间">
                <template slot-scope="scope">
                    {{scope.row.lastLoginAt | formatDate('yyyy-MM-DD') | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                            width="200"
                            align="center"
                            label="操作">
                <template slot-scope="scope">
                    <el-button class="text-success" type="text" size="small" @click="checkDetail(scope.row.id)">详情</el-button>
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
                keyword: '',
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
                    pageSize: this.pageSize,
                    keyword: this.keyword
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
            createAdmin() {
                this.$router.push({name: 'CreateAdmin'});
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
            // margin-top: 60px;
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
