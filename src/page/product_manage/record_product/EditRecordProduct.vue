<!--编辑直播回看包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'编辑直播回看包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <record-product-form
                status="1">
            </record-product-form>
        </div>
    </div>
</template>

<script>
    import RecordProductForm from './RecordProductForm';

    export default {
        name: 'EditRecordProduct',
        components: {
            RecordProductForm
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
