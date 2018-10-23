<!--创建类型包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建类型包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <type-product-form
                status="0">
            </type-product-form>
        </div>
    </div>
</template>

<script>
    import TypeProductForm from './TypeProductForm';

    export default {
        name: 'CreateTypeProduct',
        components: {
            TypeProductForm
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
