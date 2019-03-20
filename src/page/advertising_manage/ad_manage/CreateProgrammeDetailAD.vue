<!--创建节目详情广告组件-->
<template>
    <div>
        <div class="content-title">添加节目详情广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_PROGRAMME_DETAIL_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreateProgrammeDetailAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    categoryList: [],
                    adType: 'PROGRAMME_DETAIL'
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
