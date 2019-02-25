<!--创建音量条广告组件-->
<template>
    <div>
        <div class="content-title">添加音量条广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_VOLUME_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreateVolumeAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    effectRangeTime: [],
                    adType: 'VOLUME'
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
