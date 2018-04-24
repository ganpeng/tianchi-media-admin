<!--人物列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input v-model="searchContent" placeholder="搜索你想要的信息">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item class="create-account">
                <el-tag>
                    <router-link to="/person-manage/create">新增人物</router-link>
                </el-tag>
                <el-tag>导入</el-tag>
                <el-tag>导出</el-tag>
            </el-form-item>
        </el-form>
        <el-table :data="personList" border style="width: 100%">
            <el-table-column prop="id" align="center" label="编号"></el-table-column>
            <el-table-column label="照片" align="center" >
                <template slot-scope="scope">
                    <img class="person-image" :src="scope.row.avatar" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="名字"></el-table-column>
            <el-table-column prop="profile" align="center" width="300px" label="人物简介"></el-table-column>
            <el-table-column prop="area" align="center" label="地区"></el-table-column>
            <el-table-column prop="birthday" align="center" label="出生日期"></el-table-column>
            <el-table-column prop="height" align="center" label="身高"></el-table-column>
            <el-table-column prop="weight" align="center" label="体重"></el-table-column>
            <el-table-column prop="mainRole" align="center" label="职业"></el-table-column>
            <el-table-column align="center" label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="最后登录时间">
                <template slot-scope="scope">
                    {{scope.row.lastLoginAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="displayPerson(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="editPerson(scope.row.id)">编辑</el-button>
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
        name: 'PersonList',
        data() {
            return {
            searchContent: '',
            personList: [],
            currentPage: 1,
            pageSize: 10,
            totalAmount: 0
            };
        },
        mounted() {
            this.getPersonList();
        },
        methods: {
            // 获取用户列表
            getPersonList() {
            },
            // 跳转到详情页面
            displayPerson(userId) {
                this.$router.push({ name: 'DisplayPerson', params: { id: userId } });
            },
            editPerson(userId) {
                this.$router.push({ name: 'EditPerson', params: { id: userId } });
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this._getPersonList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this._getPersonList();
            },
            // 禁用确认
            disabledConfirm(userId, userStatus) {
                this.$confirm('此操作将禁用该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setPersonStatus(userId, userStatus);
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
                    this.setPersonStatus(userId, userStatus);
                }).catch(() => {
                    this.$message('已取消恢复');
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
                    color: #409eff;
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

    .el-table {
        text-align: left;
        margin: 20px 10px;
    }

    .el-pagination {
        text-align: right;
    }

    .person-image {
        display: inline-block;
        width: 60px;
        height: 60px;
    }
</style>
