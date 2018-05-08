<!-- 开机广告组件 -->
<template>
    <div class="bootstrp-advert-group-list-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>广告投放</el-breadcrumb-item>
            <el-breadcrumb-item>开机广告</el-breadcrumb-item>
        </el-breadcrumb>
        <advert-group-table></advert-group-table>
    </div>
</template>
<script>
import AdvertGroupTable from './AdvertGroupTable';
export default {
    name: 'StartingAdvertGroupList',
    components: {
        AdvertGroupTable
    }
};
</script>
<style lang="less" scoped>
</style>
