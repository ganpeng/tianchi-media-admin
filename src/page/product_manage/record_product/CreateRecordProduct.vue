<!--创建直播回看包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建直播回看包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <record-product-form
                status="0">
            </record-product-form>
        </div>
    </div>
</template>

<script>
    import RecordProductForm from './RecordProductForm';

    export default {
        name: 'CreateRecordProduct',
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
