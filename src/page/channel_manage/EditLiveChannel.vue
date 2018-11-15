<!-- 编辑直播频道页面  -->
<template>
    <div class="edit-live-channel-container">
        <h2 class="content-title">编辑直播频道</h2>
        <div class="seperator-line"></div>
        <live-channel-form ref="liveChannelFormComponent"></live-channel-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editLiveChannelHandler">保存</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import LiveChannelForm from './LiveChannelForm';
export default {
    name: 'EditLiveChannel',
    components: {
       LiveChannelForm
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    created() {
        let {id} = this.$route.params;
        if (id) {
            this.getLiveChannelById(id);
        }
    },
    methods: {
        ...mapActions({
            getLiveChannelById: 'channel/getLiveChannelById',
            updateChannelById: 'channel/updateChannelById'
        }),
        async editLiveChannelHandler() {
            try {
                let valid = await this.$refs.liveChannelFormComponent.$refs.liveChannelForm.validate();
                let {id} = this.$route.params;
                if (valid) {
                    let res = await this.updateChannelById(id);
                    if (res && res.code === 0) {
                        this.gotoList();
                        this.$message.success('保存成功');
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
