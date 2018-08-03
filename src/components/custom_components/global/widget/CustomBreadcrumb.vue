<!--创建节目专题组件-->
<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item
            v-for="(item ,index) in breadcrumbList"
            :key="index">
            {{item.name}}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>

    export default {
        name: 'CustomBreadcrumb',
        props: {
            breadcrumbList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
</style>
