<!--新建商品的组件-->
<template>
    <div>
        <div class="content-title">添加商品</div>
        <goods-form
            status="CREATE_GOODS">
        </goods-form>
    </div>
</template>

<script>
    import GoodsForm from './components/RoleForm';

    export default {
        name: 'CreateGoods',
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
