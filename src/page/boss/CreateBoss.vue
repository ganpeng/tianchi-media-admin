<template>
  <div class="create-device-enter-container">
    <h2 class="content-title">添加设备</h2>
    <div class="seperator-line"></div>
    <boss-form ref="bossFormComponent" :status="0"></boss-form>
    <div class="fixed-btn-container">
        <el-button class="btn-style-two" type="primary" @click="createBossHandler">创建</el-button>
        <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
    </div>
  </div>
</template>
<script>
import {mapMutations, mapActions} from 'vuex';
import BossForm from './BossForm';
export default {
  name: 'CreateBoss',
  components: {
      BossForm
  },
  mounted() {
      this.$util.toggleFixedBtnContainer();
  },
  created() {
      this.resetBoss();
  },
  methods: {
      ...mapMutations({
          resetBoss: 'boss/resetBoss'
      }),
      ...mapActions({
          addBoss: 'boss/addBoss'
      }),
      async createBossHandler() {
          try {
              let valid = await this.$refs.bossFormComponent.validate();
              if (valid) {
                  let res = await this.addBoss();
                  if (res && res.code === 0) {
                      this.gotoList();
                  }
              }
          } catch (err) {
              console.log(err);
          }
      },
      gotoList() {
        this.$router.push({name: 'BossList'});
      }
  }
};
</script>
<style lang="scss" scoped>
</style>
