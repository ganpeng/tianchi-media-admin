<!-- 编辑设备页面  -->
<template>
    <div class="edit-device-container">
        <h2 class="content-title">编辑设备</h2>
        <div class="seperator-line"></div>
        <device-form ref="deviceFormComponent" :status="1"></device-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editDeviceHandler">保存</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import DeviceForm from './DeviceForm';
export default {
    name: 'EditDevice',
    components: {
        DeviceForm
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    created() {
        let {id} = this.$route.params;
        this.getDeviceById(id);
    },
    methods: {
        ...mapActions({
            getDeviceById: 'device/getDeviceById',
            updateDeviceById: 'device/updateDeviceById'
        }),
        async editDeviceHandler() {
            try {
                let valid = await this.$refs.deviceFormComponent.$refs.deviceForm.validate();
                let {id} = this.$route.params;
                if (valid) {
                    let res = await this.updateDeviceById(id);
                    if (res && res.code === 0) {
                        this.gotoList();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoList() {
            this.$router.push({name: 'DeviceList'});
        }
    }
};
</script>
<style lang="scss" scoped>

</style>
