<template>
    <div class="player-container">
        <el-dialog
            :title="getTitle"
            :visible.sync="displayVideoDialogVisible"
            :show-close="false"
            :before-close="beforeCloseHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            @open="initVideo">
                <div v-if="displayVideoDialogVisible">
                    <video-player ref="player" @play="play" :video="{url, type: 'hls'}" :contextmenu="contextmenu"></video-player>
                    <i @click="beforeCloseHandler" class="pointer close-btn el-icon-close"></i>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelHandler">关闭</el-button>
                </div>
        </el-dialog>
    </div>
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
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            autoplay: true,
            player: null,
            contextmenu: [
                {
                    text: '天驰传媒',
                    link: 'https://github.com/MoePlayer/vue-dplayer'
                }
            ]
        };
    },
    computed: {
        getTitle() {
            let videoName = this.title.substring(0, this.title.lastIndexOf('.'));
            return `正在播放：${videoName}`;
        }
    },
    methods: {
        initVideo() {
            setTimeout(() => {
                this.player = this.$refs.player.dp;
                this.player.switchVideo({url: this.url});
                this.player.play();
            }, 0);
        },
        beforeCloseHandler() {
            this.cancelHandler();
        },
        cancelHandler() {
            this.$emit('changeDisplayVideoDialogStatus', false);
            this.player.switchVideo({url: ''});
            this.player.pause();
            this.player.seek(0);
        },
        play() {}
    }
};
</script>
<style lang="less" scoped>
.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 16px;
    &:hover {
        color: #F56C6C;
    }
}
</style>
