<!--编辑轮播频道包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'编辑轮播频道包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <edit-carousel-product-form
                status="1">
            </edit-carousel-product-form>
        </div>
    </div>
</template>

<script>
    import EditCarouselProductForm from './EditCarouselProductForm';

    export default {
        name: 'EditCarouselProduct',
        components: {
            EditCarouselProductForm
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
