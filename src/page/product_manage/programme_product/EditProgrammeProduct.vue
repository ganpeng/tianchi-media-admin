<!--编辑节目包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'编辑节目包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <edit-programme-product-form>
            </edit-programme-product-form>
        </div>
    </div>
</template>

<script>
    import EditProgrammeProductForm from './EditProgrammeProductForm';

    export default {
        name: 'EditProgrammeProduct',
        components: {
            EditProgrammeProductForm
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
