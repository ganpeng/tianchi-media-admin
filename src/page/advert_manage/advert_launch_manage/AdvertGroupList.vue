<!-- 广告组列表页组件 -->
<template>
    <div class="bootstrp-advert-group-list-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>广告投放</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
        <advert-group-table :type="type"></advert-group-table>
    </div>
</template>
<script>
import AdvertGroupTable from './AdvertGroupTable';
export default {
    name: 'AdvertGroupList',
    props: {
        type: {
            type: Number
        }
    },
    components: {
        AdvertGroupTable
    },
    computed: {
        breadcrumbTitle() {
            switch (Number(this.type)) {
                case 1:
                    return '开机广告';
                case 2:
                    return '节目前置广告';
                case 3:
                    return '屏保广告';
                case 4:
                    return '暂停广告';
                case 5:
                    return '直播换台广告';
                case 6:
                    return '音量条广告';
                case 7:
                    return '弹窗广告';
                case 8:
                    return '节目详情页广告';
                default:
                    return '';
            }
        }
    }
};
</script>
<style lang="less" scoped>
</style>
