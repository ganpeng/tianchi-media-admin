<!--管理员列表组件-->
<template>
    <div class="admin-container" @keyup.enter="getAdminList">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
        </div>
        <div class="search-field">
            <div class="field-row">
                <div class="search-field-item">
                    <el-input
                        v-model="keyword"
                        placeholder="请输入关键字"
                        clearable
                        class="border-input">
                    </el-input>
                </div>
                <el-button class="btn-style-one" @click="getAdminList" icon="el-icon-search" type="primary" plain>搜索</el-button>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="table-field">
            <h2 class="content-title">管理员列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left"></div>
                <div class="float-right">
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createAdmin">
                            <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                </div>
            </div>
            <el-table
                :data="adminList"
                border
                header-row-class-name="common-table-header"
                class="my-table-style"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    align="center"
                    label="姓名">
                    <template slot-scope="scope">
                        <span
                            @click="checkDetail(scope.row.id)"
                            class="name">
                            {{scope.row.name | padEmpty}}
                        </span>
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
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        <input
                            class="my-switch switch-anim"
                            type="checkbox"
                            v-if="scope.row.status === 'NORMAL'"
                            :checked="scope.row.status === 'NORMAL'"
                            @click.prevent="disabledConfirm(scope.row.id, scope.row.status)"/>
                        <input
                            class="my-switch switch-anim"
                            type="checkbox"
                            v-if="scope.row.status !== 'NORMAL'"
                            :checked="scope.row.status === 'NORMAL'"
                            @click.prevent="recoverConfirm(scope.row.id, scope.row.status)"/>
                        <i v-if="scope.row.status === 'NORMAL'" class="on-the-shelf">正常</i>
                        <i v-else class="off-the-shelf">禁用</i>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="操作">
                    <template slot-scope="scope">
                        <div class="operator-btn-wrapper">
                            <span class="btn-text" @click="editAdminInfo(scope.row.id)">编辑</span>
                            <!-- <span class="btn-text" @click="checkDetail(scope.row.id)">详情</span> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
<style scoped lang="less">
</style>
