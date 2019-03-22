<!--创建暂停广告组件-->
<template>
    <div>
        <div class="content-title">添加暂停广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_PAUSE_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreatePauseAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    categoryList: [],
                    adType: 'PAUSE'
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
