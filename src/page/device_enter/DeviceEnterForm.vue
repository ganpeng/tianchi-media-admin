<template>
  <div class="device-enter-form-container">
    <el-col :span="8">
        <el-form :model="deviceEnter" :rules="deviceRules" ref="deviceForm" class="form-block my-form" label-width="100px">
            <el-form-item label="序列号" prop="caNo">
                <el-input
                    :value="deviceEnter.caNo"
                    clearable
                    placeholder="请输入设备CA卡号"
                    @input="inputHandler($event, 'caNo')"
                ></el-input>
            </el-form-item>
            <el-form-item label="到期时间" prop="endedAt">
                <el-date-picker
                    :value="deviceEnter.endedAt"
                    @input="inputHandler($event, 'endedAt')"
                    type="date"
                    placeholder="请选择到期时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
    </el-col>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
export default {
  name: 'DeviceEnterForm',
  data() {
      return {
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
          deviceEnter: 'deviceEnter/device'
      })
  },
  methods: {
      ...mapMutations({
          updateDevice: 'deviceEnter/updateDevice'
      }),
      inputHandler(value, key) {
          this.updateDevice({key, value});
      }
  }
};
</script>
