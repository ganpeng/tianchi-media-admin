<!-- 创建设备页面  -->
<template>
    <div class="create-device-container">
        <h2 class="content-title">添加设备</h2>
        <div class="seperator-line"></div>
        <device-form ref="deviceFormComponent" :status="0"></device-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createDeviceHandler">创建</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapMutations, mapActions} from 'vuex';
import DeviceForm from './DeviceForm';
export default {
    name: 'CreateDevice',
    components: {
        DeviceForm
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    created() {
        this.resetDevice();
    },
    methods: {
        ...mapMutations({
            resetDevice: 'device/resetDevice'
        }),
        ...mapActions({
            addDevice: 'device/addDevice'
        }),
        async createDeviceHandler() {
            try {
                let valid = await this.$refs.deviceFormComponent.$refs.deviceForm.validate();
                if (valid) {
                    let res = await this.addDevice();
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
