<!--编辑类型包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'编辑类型包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <category-product-form
                status="1">
            </category-product-form>
        </div>
    </div>
</template>

<script>
    import CategoryProductForm from './CategoryProductForm';

    export default {
        name: 'EditCategoryProduct',
        components: {
            CategoryProductForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }
</style>
