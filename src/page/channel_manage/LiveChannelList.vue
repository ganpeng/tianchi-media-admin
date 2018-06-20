<!--视频列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>直播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>直播频道列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input
                    placeholder="支持频道名称，编号搜索"
                    clearable
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" border style="width:100%;margin:20px 0;">
            <el-table-column prop="id" align="center" width="240px" label="直播频道编号"></el-table-column>
            <el-table-column prop="showId" align="center" width="240px" label="直播频道展示编号"></el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="直播频道名称"></el-table-column>
            <el-table-column prop="showName" align="center" width="200px" label="直播频道展示名"></el-table-column>
            <el-table-column prop="type" align="center" label="频道类别"></el-table-column>
            <el-table-column prop="ip" align="center" label="频道IP"></el-table-column>
            <el-table-column prop="port" align="center" label="频道端口"></el-table-column>
            <el-table-column align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">节目单下载</el-button>
                    <el-button type="text" size="small">更新节目单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'LiveChannelList',
        data() {
            return {};
        },
        computed: {
            ...mapGetters({
                list: 'live/list',
                pagination: 'live/pagination'
            })
        },
        methods: {
            handleSizeChange(pageSize) {
            },
            handleCurrentChange(pageNum) {
            }
        }
    };
</script>
<style scoped lang="less">
</style>
