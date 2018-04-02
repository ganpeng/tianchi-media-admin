<!--管理员列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" :model="queryForm" class="demo-form-inline search-form">
            <el-form-item label="部门">
                <el-select v-model="queryForm.department" placeholder="请选择部门">
                    <el-option label="剪辑部" value="0"></el-option>
                    <el-option label="录入部" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职位">
                <el-select v-model="queryForm.position" placeholder="请选择职位">
                    <el-option label="剪辑师" value="0"></el-option>
                    <el-option label="文字专员" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="queryForm.createTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-tag @click="onSubmit">创建管理员</el-tag>
            </el-form-item>
            <el-form-item class="search">
                <el-input v-model="searchContent" placeholder="搜索你想要的信息">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="department"
                label="部门">
            </el-table-column>
            <el-table-column
                prop="position"
                label="职位">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="220">
            </el-table-column>
            <el-table-column
                prop="telephone"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号码">
            </el-table-column>
            <el-table-column
                prop="date"
                label="创建日期"
                width="180">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="180">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="checkDetail">查看</el-button>
                    <el-button type="text" size="small" @click="checkDetail">编辑</el-button>
                    <el-button type="danger" size="mini" plain @click="confirm">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'adminList',
        data() {
            return {
                queryForm: {
                    department: '',
                    position: '',
                    createTime: ''
                },
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
                searchContent: '',
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    department: '编辑部',
                    position: '编辑师',
                    email: 'liuxiaofei@tianchimedia.com',
                    telephone: '010-76654387',
                    phone: '150225456787'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    department: '编辑部',
                    position: '编辑师',
                    email: 'liuxiaofei@tianchimedia.com',
                    telephone: '010-76654387',
                    phone: '150225456787'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    department: '编辑部',
                    position: '编辑师',
                    email: 'liuxiaofei@tianchimedia.com',
                    telephone: '010-76654387',
                    phone: '150225456787'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    department: '编辑部',
                    position: '编辑师',
                    email: 'liuxiaofei@tianchimedia.com',
                    telephone: '010-76654387',
                    phone: '150225456787'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    department: '编辑部',
                    position: '编辑师',
                    email: 'liuxiaofei@tianchimedia.com',
                    telephone: '010-76654387',
                    phone: '150225456787'
                }],
                currentPage: 3
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!')
            },
            checkDetail() {
                this.$router.push({name: 'adminDetail'})
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`)
            },
            confirm() {
                this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
        }
        .search, .create-account {
            float: right;
            margin-right: 40px;
            i {
                cursor: pointer;
                &:hover {
                    color: #409EFF;
                }
            }
        }
        .create-account {
            float: right;
        }
        .el-tag {
            cursor: pointer;
        }
    }

    .el-table {
        margin: 20px 10px;
        text-align: left;
        td {
            text-align: left;
        }
    }

    .el-pagination {
        text-align: right;
    }
</style>
