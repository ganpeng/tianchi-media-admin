<template>
    <div class="edit-advertising-owner-container">
        <h2 class="content-title">编辑广告主</h2>
        <div class="seperator-line"></div>
        <advertising-owner-form ref="advertisingOwnerForm"></advertising-owner-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="addAdvertisingOwnerHandler">创建</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import AdvertisingOwnerForm from './AdvertisingOwnerForm';
export default {
    name: 'EditAdvertisingOwner',
    components: { AdvertisingOwnerForm },
    data() {
        return {};
    },
    created() {},
    computed: {},
    methods: {
        addAdvertisingOwnerHandler() {},
        gotoList() {}
    }
};
</script>
<style lang="scss" scoped>
</style>
