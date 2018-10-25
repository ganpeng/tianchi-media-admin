<!--创建直播回看包组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'创建直播回看包'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <look-back-product-form
                status="0">
            </look-back-product-form>
        </div>
    </div>
</template>

<script>
    import LookBackProductForm from './LookBackProductForm';

    export default {
        name: 'CreateLookBackProduct',
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
