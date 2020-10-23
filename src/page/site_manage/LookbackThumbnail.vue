<template>
    <div class="lookback-thumbnail-container">
        <div class="content-title">缩略图</div>
        <div class="seperator-line"></div>
        <div class="content">
            <div v-if="isEdit" class="control-content">
                <div class="control-item">
                    <div class="label">
                        回看缩略图
                    </div>
                    <div class="icon">
                        <svg-icon v-if="thumbnailStatusActive" icon-class="on_active_icon"></svg-icon>
                        <svg-icon v-else icon-class="on_deactive_icon"></svg-icon>
                    </div>
                    <div :class="['text', thumbnailStatusActive ? 'active' : 'deactive']">
                        {{thumbnailStatusActive ? '已开启' : '已关闭' }}
                    </div>
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        :checked="thumbnailStatusActive"
                        @click.prevent="toggleLookbackThumbnail"/>
                </div>
                <div class="control-item">
                    <div class="label">
                        点播缩略图
                    </div>
                    <div class="icon">
                        <svg-icon v-if="videoThumbnailStatusActive" icon-class="on_active_icon"></svg-icon>
                        <svg-icon v-else icon-class="on_deactive_icon"></svg-icon>
                    </div>
                    <div :class="['text', videoThumbnailStatusActive ? 'active' : 'deactive']">
                        {{videoThumbnailStatusActive ? '已开启' : '已关闭' }}
                    </div>
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        :checked="videoThumbnailStatusActive"
                        @click.prevent="toggleVodThumbnail"/>
                </div>
            </div>
            <div v-else class="control-content">
                <div class="control-item">
                    <div class="label">
                        回看缩略图
                    </div>
                    <div class="icon">
                        <svg-icon v-if="thumbnailStatusActive" icon-class="on_active_icon"></svg-icon>
                        <svg-icon v-else icon-class="on_deactive_icon"></svg-icon>
                    </div>
                    <div :class="['text', thumbnailStatusActive ? 'active' : 'deactive']">
                        {{thumbnailStatusActive ? '已开启' : '已关闭' }}
                    </div>
                </div>
                <div class="control-item">
                    <div class="label">
                        点播缩略图
                    </div>
                    <div class="icon">
                        <svg-icon v-if="videoThumbnailStatusActive" icon-class="on_active_icon"></svg-icon>
                        <svg-icon v-else icon-class="on_deactive_icon"></svg-icon>
                    </div>
                    <div :class="['text', videoThumbnailStatusActive ? 'active' : 'deactive']">
                        {{videoThumbnailStatusActive ? '已开启' : '已关闭' }}
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button v-if="isEdit" class="btn-style-two" @click="saveHandler">保存</el-button>
            <el-button v-else class="btn-style-two" @click="editHandler">编辑</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'LookbackThumbnail',
    data() {
        return {
            status: {
                thumbnailStatus: '1',
                videoThumbnailStatus: '1'
            },
            isEdit: false
        };
    },
    async created() {
        try {
            let res = await this.$service.getThumbnailStatus();
            if (res && res.code === 0) {
                this.status = res.data;
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        thumbnailStatusActive() {
            return this.status.thumbnailStatus === '1';
        },
        videoThumbnailStatusActive() {
            return this.status.videoThumbnailStatus === '1';
        }
    },
    methods: {
        async saveHandler() {
            try {
                let res = await this.$service.updateThumbnailStatus(this.status);
                if (res && res.code === 0) {
                    this.$message.success('缩略图设置成功');
                    this.isEdit = false;
                } else {
                    this.$message.error('缩略图设置失败');
                }
            } catch (err) {
                console.log(err);
            }
        },
        editHandler() {
            this.isEdit = true;
        },
        changeThumbnailStatus(value) {
            this.thumbnailStatus = value;
        },
        toggleLookbackThumbnail() {
            if (this.status.thumbnailStatus === '1') {
                this.status.thumbnailStatus = '0';
            } else {
                this.status.thumbnailStatus = '1';
            }
        },
        toggleVodThumbnail() {
            if (this.status.videoThumbnailStatus === '1') {
                this.status.videoThumbnailStatus = '0';
            } else {
                this.status.videoThumbnailStatus = '1';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.lookback-thumbnail-container {
    .control-content {
        .control-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            margin-top: 18px;
            margin-bottom: 38px;
            .label {
                font-size: 20px;
                color: #A8ABB3;
                margin-right: 56px;
            }
            .icon {
                margin-right: 8px;
                .svg-icon {
                    width: 40px;
                    height: 40px;
                }
            }
            .text {
                margin-right: 56px;
                &.active {
                    color: #3AC26F;
                }
                &.deactive {
                    color: #ED4242;
                }
            }

        }
    }
}
</style>
