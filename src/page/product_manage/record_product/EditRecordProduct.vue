<!--编辑直播回看包组件-->
<template>
    <div>
        <div class="content-title">编辑直播回看包</div>
        <div class="seperator-line"></div>
        <record-product-form
            status="1">
        </record-product-form>
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

</style>
