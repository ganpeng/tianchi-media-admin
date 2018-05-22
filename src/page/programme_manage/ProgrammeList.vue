<!-- 节目列表页组件 -->
<template>
    <div class="program-list-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="table-container">
            <el-form :inline="true" class="demo-form-inline search-form">
                <el-form-item class="search">
                    <el-input
                        :value="searchFields.figure"
                        placeholder="搜索你想要的信息">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="clearSearchFields">清空筛选条件</el-button>
                </el-form-item>
                <el-form-item class="create-account">
                    <el-tag>
                        <router-link to="/programme-manage/create">新增节目</router-link>
                    </el-tag>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <span class="search-title">筛选条件：</span>
                <el-form-item label="上映时间">
                    <el-date-picker
                        :value="searchFields.releaseAt"
                        type="year"
                        placeholder="请选择上映时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="地区">
                    <el-select
                        :value="searchFields.releaseArea"
                        clearable
                        filterable
                        placeholder="请选择制片地区"
                    >
                        <el-option
                            v-for="item in areaOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select
                        :value="searchFields.programmeCategory"
                        clearable
                        placeholder="请选择分类"
                    >
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select
                        :value="searchFields.programmeType"
                        clearable
                        placeholder="请选择类型"
                    >
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        :value="searchFields.releaseStatus"
                        clearable
                        placeholder="请选择状态"
                    >
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="programmeList" border style="width: 100%">
                <el-table-column prop="id" align="center" label="节目编号"></el-table-column>
                <el-table-column label="节目图片" width="200px" align="center" >
                    <template slot-scope="scope">
                        <img class="" :src="scope.row.avatar" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" label="节目名称"></el-table-column>
                <el-table-column prop="description" align="center" width="300px" label="节目简介"></el-table-column>
                <el-table-column prop="" align="center" label="正片数量"></el-table-column>
                <el-table-column prop="" align="center" label="相关视频数量"></el-table-column>
                <el-table-column prop="releaseAt" align="center" width="200px" label="上映时间">
                </el-table-column>
                <el-table-column prop="area" align="center" label="地区"></el-table-column>
                <el-table-column prop="area" align="center" label="分类"></el-table-column>
                <el-table-column prop="area" align="center" label="类型"></el-table-column>
                <el-table-column prop="" align="center" label="主演"></el-table-column>
                <el-table-column prop="" align="center" label="导演"></el-table-column>
                <el-table-column prop="area" align="center" label="状态"></el-table-column>
                <el-table-column align="center" label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" align="center" width="120px" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="displayProgramme(scope.row.id)">查看</el-button>
                        <el-button type="text" size="small" @click="editProgramme(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'ProgrammeList',
    data() {
        return {
            programmeList: [
                {
                    id: '1',
                    code: '000000001',
                    name: '战狼1',
                    description: '战狼1的介绍吴京扮演的军人',
                    releaseAt: '2018-05-02T06:24:08.555Z',
                    area: '香港',
                    typeId: ''
                },
                {
                    id: '2',
                    code: '00l000002',
                    name: '战狼2',
                    description: '战狼1的介绍吴京扮演的军人',
                    releaseAt: '2018-05-02T06:24:08.555Z',
                    area: '香港',
                    typeId: ''
                }
            ],
            areaOptions: this.$util.countryList()
        };
    },
    created() {
        this.getProgrammeList();
    },
    computed: {
        ...mapGetters({
            list: 'programme/list',
            pagination: 'programme/pagination',
            searchFields: 'programme/searchFields'
        })
    },
    methods: {
        ...mapActions({
            getProgrammeList: 'programme/getProgrammeList'
        }),
        clearSearchFields() {},
        editProgramme(id) {
            this.$router.push({ name: 'EditProgramme', params: { id } });
        },
        displayProgramme(id) {
            this.$router.push({ name: 'DisplayProgramme', params: { id } });
        },
        handleSizeChange() {},
        handleCurrentChange() {}
    }
};
</script>
<style lang="less" scoped>
.search-title {
    display: inline-block;
    font-size: 20px;
    line-height: 40px
}
</style>
