<template>
        <el-dialog
            title="视频播放"
            :visible.sync="displayVideoDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            @open="initVideo">
                <div>
                    <video-player ref="player" @play="play" :video="{url, type: 'hls'}" :contextmenu="contextmenu"></video-player>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelHandler">关闭</el-button>
                </div>
        </el-dialog>
</template>
<script>
import VideoPlayer from './VideoPlayer';
export default {
    components: {
        VideoPlayer
    },
    props: {
        displayVideoDialogVisible: {
            type: Boolean
        },
        url: {
            type: String
        }
    },
    data() {
        return {
            autoplay: false,
            player: null,
            contextmenu: [
                {
                    text: '天驰传媒',
                    link: 'https://github.com/MoePlayer/vue-dplayer'
                }
            ]
        };
    },
    methods: {
        initVideo() {
            setTimeout(() => {
                this.player = this.$refs.player.dp;
                this.player.switchVideo({url: this.url});
            }, 0);
        },
        cancelHandler() {
            this.$emit('changeDisplayVideoDialogStatus', false);
            this.player.pause();
        },
        play() {}
    }
};
</script>
<style lang="less" scoped>
</style>
