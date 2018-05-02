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
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item label="地区">
                <el-select v-model="area" filterable clearable placeholder="请选择">
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="create-account">
                <el-tag>
                    <router-link to="/person-manage/create">新增人物</router-link>
                </el-tag>
                <el-tag>导入</el-tag>
                <el-tag>导出</el-tag>
            </el-form-item>
        </el-form>
        <el-table :data="personList" border style="width:100%">
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
            <el-table-column align="center" label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="displayPerson(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="editPerson(scope.row.id)">编辑</el-button>
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
                area: '',
                personList: [],
                currentPage: 1,
                pageSize: 10,
                totalAmount: 0,
                areaOptions: this.$util.countryList()
            };
        },
        mounted() {
            this.getPersonList();
        },
        methods: {
            // 获取人物列表
            getPersonList() {
                this.$axios.post('/v1/figure/list', {}, {
                    params: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize
                    }
                }).then((res) => {
                });
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
                this.getPersonList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getPersonList();
            }
        }
    };
</script>
<style scoped lang="less">
</style>
