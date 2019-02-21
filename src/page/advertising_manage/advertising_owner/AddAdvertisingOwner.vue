<template>
    <div class="add-advertising-owner-container">
        <h2 class="content-title">添加广告主</h2>
        <div class="seperator-line"></div>
        <advertising-owner-form ref="advertisingOwnerFormComponent"></advertising-owner-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="addAdvertisingOwnerHandler">创建</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import AdvertisingOwnerForm from './AdvertisingOwnerForm';
export default {
    name: 'AddAdvertisingOwner',
    components: { AdvertisingOwnerForm },
    data() {
        return {};
    },
    created() {},
    computed: {},
    methods: {
        async addAdvertisingOwnerHandler() {
            try {
                let valid = await this.$refs.advertisingOwnerFormComponent.$refs.advertisingOwnerForm.validate();
                if (valid) {
                    console.log('aaaa');
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoList() {}
    }
};
</script>
<style lang="scss" scoped>

</style>
