<!--编辑节目详情广告组件-->
<template>
    <div>
        <div class="content-title">编辑节目详情广告</div>
        <ad-form
            :adInfo="adInfo"
            status="EDIT_PROGRAMME_DETAIL_AD">
        </ad-form>
    </div>
</template>

<script>
    import adForm from './ADForm';

    export default {
        name: 'EditProgrammeDetailAD',
        components: {
            adForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    effectRangeTime: [],
                    adType: 'PROGRAMME_DETAIL'
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
