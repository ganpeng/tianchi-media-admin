<!--创建节目包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建节目包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <programme-product-form
                status="0">
            </programme-product-form>
        </div>
    </div>
</template>

<script>
    import ProgrammeProductForm from './ProgrammeProductForm';

    export default {
        name: 'CreateProgrammeProduct',
        components: {
            ProgrammeProductForm
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
