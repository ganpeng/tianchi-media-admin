<template>
    <div class="server-group-edit-container">
        <h2 class="content-title">编辑服务器组</h2>
        <div class="seperator-line"></div>
        <server-group-form ref="serverGroupForm"></server-group-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editServerGroupHandler">保存</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import ServerGroupForm from './ServerGroupForm';
export default {
    name: 'ServerGroupEdit',
    components: {ServerGroupForm},
    created() {
        let {id} = this.$route.params;
        this.getServerGroupById(id);
    },
    methods: {
        ...mapActions({
            getServerGroupById: 'serverGroup/getServerGroupById',
            updateServerGroup: 'serverGroup/updateServerGroup'
        }),
        async editServerGroupHandler() {
            try {
                let valid = await this.$refs.serverGroupForm.validate();
                if (valid) {
                    let { id } = this.$route.params;
                    let res = await this.updateServerGroup(id);
                    console.log(res);
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
