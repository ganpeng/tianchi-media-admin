<!--创建轮播频道包组件-->
<template>
    <div>
        <div class="content-title">添加轮播频道包</div>
        <div class="seperator-line"></div>
        <carousel-product-form
            status="CREATE_PRODUCT">
        </carousel-product-form>
    </div>
</template>

<script>
    import CarouselProductForm from './CarouselProductForm';

    export default {
        name: 'CreateCarouselProduct',
        components: {
            CarouselProductForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
