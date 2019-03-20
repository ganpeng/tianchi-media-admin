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
                        this.adInfo.applyDateEnd = new Date(this.adInfo.applyDateEnd);
                        this.adInfo.applyDateBegin = new Date(this.adInfo.applyDateBegin);
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
