<!--创建片头广告组件-->
<template>
    <div>
        <div class="content-title">添加片头广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_PREPOSITION_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreatePrepositionAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    adType: 'PREPOSITION'
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
