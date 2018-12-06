<!--创建直播回看包组件-->
<template>
    <div>
        <div class="content-title">添加直播回看包</div>
        <div class="seperator-line"></div>
        <record-product-form
            status="0">
        </record-product-form>
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

</style>
