<!--编辑商品的组件-->
<template>
    <div>
        <div class="content-title">编辑商品</div>
        <goods-form
            status="EDIT_GOODS">
        </goods-form>
    </div>
</template>

<script>
    import GoodsForm from './components/RoleForm';

    export default {
        name: 'EditGoods',
        components: {
            GoodsForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
