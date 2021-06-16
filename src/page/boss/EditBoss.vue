<template>
  <div class="edit-device-enter-container">
    <h2 class="content-title">编辑设备</h2>
    <div class="seperator-line"></div>
    <boss-form ref="bossForm" :status="1"></boss-form>
    <div class="fixed-btn-container">
        <el-button class="btn-style-two" type="primary" @click="editBossHandler">保存</el-button>
        <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex';
import BossForm from './BossForm';
export default {
  name: 'EditBoss',
  components: {
      BossForm
  },
  mounted() {
      this.$util.toggleFixedBtnContainer();
  },
  created() {
      let {id} = this.$route.params;
      this.getBossById(id);
  },
  methods: {
      ...mapActions({
          getBossById: 'boss/getBossById',
          updateBossById: 'boss/updateBossById'
      }),
      async editBossHandler() {
        try {
            if (!this.$authority.isHasAuthority('bo:boss:put')) {
                return;
            }
            let valid = await this.$refs.bossForm.validate();
            let {id} = this.$route.params;
            if (valid) {
                let res = await this.updateBossById(id);
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
