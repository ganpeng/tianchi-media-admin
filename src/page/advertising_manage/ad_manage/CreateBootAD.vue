<!--创建开机广告组件-->
<template>
    <div>
        <div class="content-title">添加开机广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_BOOT_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreateBootAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    categoryList: [],
                    adType: 'BOOT'
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
