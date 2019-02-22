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
import {mapActions} from 'vuex';
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
        ...mapActions({
            newAdvertisingOwner: 'advertising/newAdvertisingOwner'
        }),
        async addAdvertisingOwnerHandler() {
            try {
                let valid = await this.$refs.advertisingOwnerFormComponent.$refs.advertisingOwnerForm.validate();
                if (valid) {
                    let res = await this.newAdvertisingOwner();
                    if (res && res.code === 0) {
                        this.$message.success('添加成功');
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
