<!--编辑音量条广告组件-->
<template>
    <div>
        <div class="content-title">编辑音量条广告</div>
        <ad-form
            :adInfo="adInfo"
            status="EDIT_VOLUME_AD">
        </ad-form>
    </div>
</template>

<script>
    import adForm from './ADForm';

    export default {
        name: 'EditVolumeAD',
        components: {
            adForm
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
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getADDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.adInfo = response.data;
                        this.adInfo.effectRangeTime = [];
                        this.adInfo.effectRangeTime[0] = this.adInfo.applyDateBegin;
                        this.adInfo.effectRangeTime[1] = this.adInfo.applyDateEnd;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
