<!--编辑轮播频道包组件-->
<template>
    <div>
        <div class="content-title">编辑轮播频道包</div>
        <div class="seperator-line"></div>
        <carousel-product-form
            status="1">
        </carousel-product-form>
    </div>
</template>

<script>
    import CarouselProductForm from './CarouselProductForm';

    export default {
        name: 'EditCarouselProduct',
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
