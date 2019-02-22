<!--创建屏保广告组件-->
<template>
    <div>
        <div class="content-title">添加屏保广告</div>
        <ad-form
            :adInfo="adInfo"
            status="CREATE_SCREEN_SAVER_AD">
        </ad-form>
    </div>
</template>

<script>
    import AdForm from './ADForm';

    export default {
        name: 'CreateScreenSaverAD',
        components: {
            AdForm
        },
        data() {
            return {
                adInfo: {
                    posterImageList: [],
                    effectRangeTime: [],
                    videoResource: {},
                    imageResourceList: []
                }
            };
        },
        methods: {}
    };
</script>

<style lang="less" scoped>

</style>
