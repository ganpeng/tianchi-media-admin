<!--编辑屏保广告组件-->
<template>
    <div>
        <div class="content-title">编辑屏保广告</div>
        <ad-form
            :adInfo="adInfo"
            status="EDIT_SCREEN_SAVER_AD">
        </ad-form>
    </div>
</template>

<script>
    import adForm from './ADForm';

    export default {
        name: 'EditScreenSaverAD',
        components: {
            adForm
        },
        data() {
            return {
                adInfo: {
                    adMaterialList: [],
                    adType: 'SCREEN_SAVER'
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
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
