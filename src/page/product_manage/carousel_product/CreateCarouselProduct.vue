<!--创建轮播频道包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建轮播频道包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <create-carousel-product-form
                status="0">
            </create-carousel-product-form>
        </div>
    </div>
</template>

<script>
    import CreateCarouselProductForm from './CreateCarouselProductForm';

    export default {
        name: 'CreateCarouselProduct',
        components: {
            CreateCarouselProductForm
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
