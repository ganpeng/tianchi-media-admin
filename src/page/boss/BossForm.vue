<template>
  <div class="device-enter-form-container">
    <el-col :span="8">
      <el-form
        :model="boss"
        :rules="bossRules"
        ref="bossForm"
        class="form-block my-form"
        label-width="100px"
      >
        <el-form-item label="序列号" prop="stbNo">
          <el-input
            :value="boss.stbNo"
            clearable
            placeholder="请输入设备序列号"
            @input="inputHandler($event, 'stbNo')"
          ></el-input>
        </el-form-item>
        <el-form-item label="到期时间" prop="expiredAt">
          <el-date-picker
            :value="boss.expiredAt"
            value-format="timestamp"
            @input="inputHandler($event, 'expiredAt')"
            type="date"
            placeholder="请选择到期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'BossForm',
  data() {
    return {
      bossRules: {
        stbNo: [{ required: true, message: '请输入设备序列号' }],
        expiredAt: [{ required: true, message: '请选择到期时间' }]
      }
    };
  },
  computed: {
    ...mapGetters({
      boss: 'boss/boss'
    })
  },
  methods: {
    ...mapMutations({
      updateBoss: 'boss/updateBoss'
    }),
    inputHandler(value, key) {
      this.updateBoss({ key, value });
    },
    validate() {
      return this.$refs.bossForm.validate();
    }
  }
};
</script>
