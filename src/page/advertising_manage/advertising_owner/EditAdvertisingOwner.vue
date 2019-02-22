<template>
    <div class="edit-advertising-owner-container">
        <h2 class="content-title">编辑广告主</h2>
        <div class="seperator-line"></div>
        <advertising-owner-form ref="advertisingOwnerFormComponent"></advertising-owner-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editAdvertisingOwnerHandler">编辑</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import AdvertisingOwnerForm from './AdvertisingOwnerForm';
export default {
    name: 'EditAdvertisingOwner',
    components: { AdvertisingOwnerForm },
    created() {
        let {id} = this.$route.params;
        this.getAdvertisingOwnerById(id);
    },
    methods: {
        ...mapActions({
            getAdvertisingOwnerById: 'advertising/getAdvertisingOwnerById',
            editAdvertisingOwner: 'advertising/editAdvertisingOwner'
        }),
        async editAdvertisingOwnerHandler() {
            try {
                let valid = await this.$refs.advertisingOwnerFormComponent.$refs.advertisingOwnerForm.validate();
                if (valid) {
                    let {id} = this.$route.params;
                    let res = await this.editAdvertisingOwner(id);
                    if (res && res.code === 0) {
                        this.$message.success('编辑成功');
                        this.gotoList();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoList() {
            this.$router.push({name: 'AdvertisingOwnerList'});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
