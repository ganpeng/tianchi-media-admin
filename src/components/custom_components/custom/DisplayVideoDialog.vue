<!-- 视频播放的组件  -->
<template>
    <div class="display-video-container">
        <el-dialog
            title="视频"
            class="my-dialog"
            :visible.sync="displayVideoDialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
                <div v-if="displayVideoDialogVisible">
                    <h2 class="video-name">{{title}}</h2>
                    <!-- <div id="dplayer"></div> -->
                    <video
                        id="my-player"
                        class="video-js"
                        controls
                        autoplay
                        preload="auto">
                    </video>
                    <p class="video-link">视频地址：{{url}}</p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">关闭</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
import DPlayer from 'dplayer';
import 'dplayer/dist/DPlayer.min.css';
import videojs from 'video.js';
import 'video.js/dist/alt/video-js-cdn.min.css';
export default {
    name: 'DisplayVideoDialog',
    props: {
        url: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            displayVideoDialogVisible: false,
            player: null,
            videoPlayer: null,
            fullScreen: false
        };
    },
    methods: {
        initPlayer() {
            let that = this;
            this.$nextTick(() => {
                that.player = new DPlayer({
                    container: document.getElementById('dplayer'),
                    autoplay: true,
                    video: { url: that.url }
                });
            });
        },
        initVideoPlayer() {
            let that = this;
            this.$nextTick(() => {
                let myPlayer = document.getElementById('my-player');
                let options = {};
                that.videoPlayer = videojs(myPlayer, options, () => {
                    console.log('video is ready!!!');
                });
                this.videoPlayer.src({
                    src: this.url,
                    type: 'application/x-mpegURL'
                });
            });
        },
        dialogOpenHandler() {
            // let that = this;
            // this.$nextTick(() => {
            //     let dplayerDom = document.querySelector('#dplayer');
            //     dplayerDom.addEventListener('dblclick', that.fullScreenHandler, false);
            // });
        },
        fullScreenHandler() {
            this.fullScreen = !this.fullScreen;
            if (this.fullScreen) {
                this.player.fullScreen.cancel('browser');
            } else {
                this.player.fullScreen.request('browser');
            }
        },
        showDialog() {
            this.displayVideoDialogVisible = true;
            // this.initPlayer();
            this.initVideoPlayer();
        },
        closeDialog() {
            // this.player.switchVideo({url: ''});
            // this.player.pause();
            // this.player.seek(0);
            // this.player.destroy();
            this.videoPlayer.dispose();
            this.displayVideoDialogVisible = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.video-link {
    margin-top: 10px;
    color: #A8ABB3;
}
.video-name {
    font-size: 16px;
    margin: 10px 0;
    color: #A8ABB3;

}
.video-js {
    width: 100%;
    height: 400px;
}
</style>
