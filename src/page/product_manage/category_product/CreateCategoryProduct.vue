<!--创建类型包组件-->
<template>
    <div>
        <div class="content-title">添加类别包</div>
        <div class="seperator-line"></div>
        <category-product-form
            status="CREATE_PRODUCT">
        </category-product-form>
    </div>
</template>

<script>
    import CategoryProductForm from './CategoryProductForm';

    export default {
        name: 'CreateCategoryProduct',
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

</style>
