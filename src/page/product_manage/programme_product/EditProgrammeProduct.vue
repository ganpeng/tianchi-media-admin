<!--编辑节目包组件-->
<template>
    <div>
        <div class="content-title">编辑节目包</div>
        <div class="seperator-line"></div>
        <edit-programme-product-form>
        </edit-programme-product-form>
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

</style>
