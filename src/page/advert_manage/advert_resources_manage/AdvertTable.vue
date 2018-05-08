<!-- 广告资源管理列表页的表格组件 -->
<template>
    <div class="advert-table-container">
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input v-model="filter.name" placeholder="请输入素材名称">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchHandler">搜索</el-button>
            </el-form-item>
            <el-form-item label="素材格式">
                <el-select
                    v-model="filter.format"
                    filterable
                    clearable
                    placeholder="请选择素材格式"
                    @change="searchHandler"
                    >
                    <el-option
                        v-for="item in formatOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="素材尺寸">
                <el-select
                    v-model="filter.dimension"
                    filterable
                    clearable
                    placeholder="请选择素材尺寸"
                    @change="searchHandler"
                    >
                    <el-option
                        v-for="item in dimensionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button @click="createAdvert">新增广告资源</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="advertList" border style="width:100%">
            <el-table-column prop="id" align="center" label="编号"></el-table-column>
            <el-table-column label="素材预览" align="center" >
                <template slot-scope="scope">
                    <img class="person-image" :src="scope.row.avatar" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="素材名称"></el-table-column>
            <el-table-column prop="format" align="center" width="300px" label="素材格式"></el-table-column>
            <el-table-column prop="dimension" align="center" label="素材尺寸"></el-table-column>
            <el-table-column prop="size" align="center" label="素材大小"></el-table-column>
            <el-table-column align="center" label="上传时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
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
    name: 'AdvertTable',
    data() {
        return {

        };
    }
};
</script>
<style lang="less" scoped>
</style>
