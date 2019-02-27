<!-- 视频播放的组件  -->
<template>
    <div class="display-video-container">
        <el-dialog
            title="视频"
            class="my-dialog"
            :visible.sync="displayVideoDialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
                <div v-if="displayVideoDialogVisible">
                    <h2 class="video-name">{{title}}</h2>
                    <div id="dplayer"></div>
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
            hls: null
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
        showDialog() {
            this.displayVideoDialogVisible = true;
            this.initPlayer();
        },
        closeDialog() {
            this.player.switchVideo({url: ''});
            this.player.pause();
            this.player.seek(0);
            this.player.destroy();
            this.displayVideoDialogVisible = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.video-link {
    margin-top: 10px;
}
.video-name {
    font-size: 16px;
    margin: 10px 0;
}
</style>
