<!--创建节目包组件-->
<template>
    <div>
        <div class="content-title">添加节目包</div>
        <div class="seperator-line"></div>
        <create-programme-product-form>
        </create-programme-product-form>
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

</style>
