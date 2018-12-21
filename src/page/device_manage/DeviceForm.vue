<!-- 设备表单组件 -->
<template>
    <div class="device-form-container form-container">
        <el-col :span="8">
            <el-form :model="device" :rules="deviceRules" ref="deviceForm" class="form-block my-form" label-width="100px">
                <el-form-item label="CA卡号" prop="caNo">
                    <el-input
                        :value="device.caNo"
                        clearable
                        placeholder="请输入设备CA卡号"
                        @input="inputHandler($event, 'caNo')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="hardWareId">
                    <el-select
                        :value="device.hardWareId"
                        clearable
                        placeholder="请选择内容类型"
                        @input="inputHandler($event, 'hardWareId')"
                    >
                        <el-option
                            v-for="item in hardwareTypeOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备状态">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        :checked="device.status === 'NORMAL'"
                        @click.prevent="toggleDeviceStatus"/>
                    <i v-if="device.status === 'NORMAL'" class="on-the-shelf inline">正常</i>
                    <i v-else class="off-the-shelf inline">禁用</i>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import role from '@/util/config/role';
export default {
    name: 'DeviceForm',
    data() {
        return {
            hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
            deviceRules: {
                caNo: [
                    { required: true, message: '请输入设备CA卡号' }
                ],
                hardWareId: [
                    { required: true, message: '请选择设备类型' }
                ]
            }
        };
    },
    computed: {
        ...mapGetters({
            device: 'device/device'
        })
    },
    methods: {
        ...mapMutations({
            updateDevice: 'device/updateDevice'
        }),
        inputHandler(value, key) {
            this.updateDevice({key, value});
        },
        toggleDeviceStatus() {
            let value = this.device.status === 'FORBIDDEN' ? 'NORMAL' : 'FORBIDDEN';
            this.updateDevice({key: 'status', value});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
