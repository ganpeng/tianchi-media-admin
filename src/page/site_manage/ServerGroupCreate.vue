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
import ServerGroupForm from './ServerGroupForm';
export default {
    name: 'ServerGroupCreate',
    components: {ServerGroupForm},
    methods: {
        createServerGroupHandler() {},
        gotoList() {
            this.$router.push({name: 'ServerGroupList'});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
