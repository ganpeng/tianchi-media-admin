<!-- 创建直播频道页面  -->
<template>
    <div class="create-live-channel-container">
        <h2 class="content-title">添加直播频道</h2>
        <div class="seperator-line"></div>
        <live-channel-form ref="liveChannelFormComponent"></live-channel-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="createLiveChannelHandler">创建</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapMutations, mapActions} from 'vuex';
import LiveChannelForm from './LiveChannelForm';
export default {
    name: 'CreateLiveChannel',
    components: {
        LiveChannelForm
    },
    created() {
        //  清除已有的频道数据
        this.resetLiveChannel();
        //  获取下拉列表中的频道类型
        this.getChannelType();
    },
    methods: {
        ...mapMutations({
            resetLiveChannel: 'channel/resetLiveChannel'
        }),
        ...mapActions({
            createChannels: 'channel/createChannels',
            getChannelType: 'channel/getChannelType'
        }),
        async createLiveChannelHandler() {
            try {
                let valid = await this.$refs.liveChannelFormComponent.$refs.liveChannelForm.validate();
                if (valid) {
                    let res = await this.createChannels();
                    if (res && res.code === 0) {
                        this.gotoList();
                        this.$message.success('创建成功');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        gotoList() {
            this.$router.push({name: 'LiveChannelList'});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
