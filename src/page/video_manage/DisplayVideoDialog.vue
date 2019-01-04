<template>
    <div class="player-container">
        <el-dialog
            title="视频"
            class="my-dialog"
            :visible.sync="displayVideoDialogVisible"
            :show-close="true"
            :before-close="beforeCloseHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            @open="initVideo">
                <div v-if="displayVideoDialogVisible">
                    <h2 class="video-name">{{getTitle}}</h2>
                    <video-player ref="player" @play="play" :video="{url, type: 'hls'}" :contextmenu="contextmenu"></video-player>
                    <p class="video-link">视频地址：{{url}}</p>
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
            let videoName = '';
            if (this.title.lastIndexOf('.') >= 0) {
                videoName = this.title.substring(0, this.title.lastIndexOf('.'));
            } else {
                videoName = this.title;
            }
            return `${videoName}`;
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
.video-link {
    margin-top: 10px;
}
.video-name {
    font-size: 16px;
    margin: 10px 0;
}
</style>
<style>
.el-dialog__body {
    /* padding: 0 20px 20px 20px!important; */
}
</style>
