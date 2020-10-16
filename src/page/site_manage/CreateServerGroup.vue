<template>
    <div class="server-group-create-container">
        <h2 class="content-title">新增服务器组</h2>
        <div class="seperator-line"></div>
        <server-group-form ref="serverGroupForm"></server-group-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createServerGroupHandler">创建</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapActions, mapMutations} from 'vuex';
import ServerGroupForm from './ServerGroupForm';
export default {
    name: 'ServerGroupCreate',
    components: {ServerGroupForm},
    created() {
        this.resetServerGroup();
    },
    methods: {
        ...mapMutations({
            resetServerGroup: 'serverGroup/resetServerGroup'
        }),
        ...mapActions({
            createServerGroup: 'serverGroup/createServerGroup'
        }),
        async createServerGroupHandler() {
            try {
                let valid = await this.$refs.serverGroupForm.validate();
                if (valid) {
                    let res = await this.createServerGroup();
                    if (res && res.code === 0) {
                        this.gotoList();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoList() {
            this.$router.push({name: 'ServerGroupList'});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
