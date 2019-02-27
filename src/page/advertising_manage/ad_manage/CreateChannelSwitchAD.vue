<!--创建换台广告组件-->
<template>
    <div>
        <div class="content-title">添加换台广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_CHANNEL_SWITCH_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreateChannelSwitchAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    adType: 'CHANNEL_SWITCH'
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
