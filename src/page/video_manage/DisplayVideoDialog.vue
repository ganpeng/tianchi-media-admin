<template>
        <el-dialog
            title="视频播放"
            :visible.sync="displayVideoDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @open="initVideo">
                <div>
                    <video-player ref="player" @play="play" :video="{url, type: 'hls'}" :contextmenu="contextmenu" ></video-player>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelHandler">关闭</el-button>
                </div>
        </el-dialog>
</template>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
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
            video: {
                url: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
                pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
                type: 'hls'
            },
            autoplay: false,
            player: null,
            contextmenu: [
                {
                    text: 'GitHub',
                    link: 'https://github.com/MoePlayer/vue-dplayer'
                }
            ]
        }
    },
    methods: {
        initVideo() {
            setTimeout(() => {
                this.player = this.$refs.player.dp;
                this.player.switchVideo({url: this.url});
            }, 0);
        },
        cancelHandler(){
            this.$emit('changeDisplayVideoDialogStatus', false);
        },
        play() {}
    }
};
</script>
<style lang="less" scoped>
</style>
