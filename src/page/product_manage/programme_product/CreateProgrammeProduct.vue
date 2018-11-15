<!--创建节目包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建节目包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <create-programme-product-form>
            </create-programme-product-form>
        </div>
    </div>
</template>

<script>
    import CreateProgrammeProductForm from './CreateProgrammeProductForm';

    export default {
        name: 'CreateProgrammeProduct',
        components: {
            CreateProgrammeProductForm
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
