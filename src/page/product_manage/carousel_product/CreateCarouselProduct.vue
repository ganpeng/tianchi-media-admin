<!--创建轮播频道包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建轮播频道包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <carousel-product-form
                status="0">
            </carousel-product-form>
        </div>
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

    .block-box {
        margin-top: 50px;
    }
</style>
