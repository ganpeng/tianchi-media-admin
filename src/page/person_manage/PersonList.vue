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
                <el-button type="primary" @click="searchHandler">搜索</el-button>
            </el-form-item>
            <el-form-item label="地区">
                <el-select
                    v-model="area"
                    filterable
                    clearable
                    placeholder="请选择地区"
                    @change="searchHandler"
                    >
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
            <el-table-column prop="name" align="center" width="200px" label="名字"></el-table-column>
            <el-table-column prop="description" align="center" width="300px" label="人物简介"></el-table-column>
            <el-table-column prop="area" align="center" label="地区">
                <template slot-scope="scope">
                    {{areaLabel(scope.row.area)}}
                </template>
            </el-table-column>
            <el-table-column prop="birthday" align="center" label="出生日期">
                <template slot-scope="scope">
                    {{scope.row.birthday | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column prop="height" align="center" label="身高"></el-table-column>
            <el-table-column prop="weight" align="center" label="体重"></el-table-column>
            <el-table-column prop="mainRole" align="center" label="职业">
                <template slot-scope="scope">
                    {{mainRoleLabel(scope.row.mainRole)}}
                </template>
            </el-table-column>
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
            :page-sizes="[5, 10, 20, 30, 50]"
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
                pageSize: 5,
                totalAmount: 0,
                areaOptions: this.$util.countryList(),
                selectFlag: false,
                mainRoleOptions: [
                    {
                        value: 'DIRECTOR',
                        label: '导演'
                    },
                    {
                        value: 'VICE_DIRECTOR',
                        label: '副导演'
                    },
                    {
                        value: 'CHIEF_ACTOR',
                        label: '主演'
                    },
                    {
                        value: 'ACTOR',
                        label: '演员'
                    }
                ]
            };
        },
        mounted() {
            this.getPersonList({pageSize: this.pageSize, pageNum: this.currentPage});
        },
        methods: {
            // 获取人物列表
            getPersonList({pageSize, pageNum, name, area}) {
                this.$service.getPersonList({pageSize, pageNum, name, area})
                    .then((res) => {
                        if (res && res.code === 0) {
                            this.personList = res.data.list;
                            this.totalAmount = res.data.total;
                        }
                    });
            },
            areaLabel(areaValue) {
                return this.areaOptions.find((areaItem) => areaItem.value === areaValue).label;
            },
            mainRoleLabel(mainRoleValue) {
                return this.mainRoleOptions.find((mainRoleItem) => mainRoleItem.value === mainRoleValue).label;
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
                this.getPersonList({pageSize: this.pageSize, pageNum: this.currentPage, name: this.searchContent ? this.searchContent : undefined, area: this.area ? this.area : undefined});
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getPersonList({pageSize: this.pageSize, pageNum: this.currentPage, name: this.searchContent ? this.searchContent : undefined, area: this.area ? this.area : undefined});
            },
            searchHandler() {
                this.currentPage = 1;
                this.getPersonList({pageSize: this.pageSize, pageNum: this.currentPage, name: this.searchContent ? this.searchContent : undefined, area: this.area ? this.area : undefined});
            }
        }
    };
</script>
<style scoped lang="less">
</style>
