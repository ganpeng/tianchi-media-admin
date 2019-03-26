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
                    categoryList: [],
                    adType: 'PROGRAMME_DETAIL',
                    applyBeginDate: '',
                    applyBeginPoint: '',
                    applyEndDate: '',
                    applyEndPoint: ''
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
                        for (let key in response.data) {
                            this.adInfo[key] = response.data[key];
                        }
                        let startDate = new Date(this.adInfo.applyDateBegin);
                        this.adInfo.applyBeginDate = this.adInfo.applyDateBegin - (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                        let currentStartDate = new Date();
                        this.adInfo.applyBeginPoint = currentStartDate.valueOf() - (currentStartDate.getHours() * 60 * 60 + currentStartDate.getMinutes() * 60 + currentStartDate.getSeconds()) * 1000 + (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                        let endDate = new Date(this.adInfo.applyDateEnd);
                        this.adInfo.applyEndDate = this.adInfo.applyDateEnd - (endDate.getHours() * 60 * 60 + endDate.getMinutes() * 60 + endDate.getSeconds()) * 1000;
                        let currentEndDate = new Date();
                        this.adInfo.applyEndPoint = currentEndDate.valueOf() - (currentEndDate.getHours() * 60 * 60 + currentEndDate.getMinutes() * 60 + currentEndDate.getSeconds()) * 1000 + (endDate.getHours() * 60 * 60 + endDate.getMinutes() * 60 + endDate.getSeconds()) * 1000;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
