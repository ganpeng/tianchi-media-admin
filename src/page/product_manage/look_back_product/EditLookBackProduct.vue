<!--编辑直播回看包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'编辑直播回看包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <look-back-product-form
                status="1">
            </look-back-product-form>
        </div>
    </div>
</template>

<script>
    import LookBackProductForm from './LookBackProductForm';

    export default {
        name: 'EditLookBackProduct',
        components: {
            LookBackProductForm
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
