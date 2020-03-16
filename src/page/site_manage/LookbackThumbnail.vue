<template>
    <div class="lookback-thumbnail-container">
        <div class="content-title">回看缩略图</div>
        <div class="seperator-line"></div>
        <div class="content">
            <div v-if="isEdit" class="control-content">
                <div v-if="thumbnailStatus === '1'" class="svg-wrapper">
                    <svg-icon icon-class="on_active"></svg-icon>
                    <p class="active">开</p>
                </div>
                <div @click="changeThumbnailStatus('1')" v-else class="svg-wrapper">
                    <svg-icon icon-class="on_deactive"></svg-icon>
                    <p>开</p>
                </div>
                <div v-if="thumbnailStatus === '0'" class="svg-wrapper">
                    <svg-icon icon-class="off_active"></svg-icon>
                    <p class="deactive">关</p>
                </div>
                <div @click="changeThumbnailStatus('0')" v-else class="svg-wrapper">
                    <svg-icon icon-class="off_deactive"></svg-icon>
                    <p>关</p>
                </div>
            </div>
            <div v-else class="display-content">
                <div v-if="thumbnailStatus === '1'" class="svg-wrapper">
                    <svg-icon icon-class="on_active"></svg-icon>
                    <p class="active">开</p>
                </div>
                <div v-else class="svg-wrapper">
                    <svg-icon icon-class="off_active"></svg-icon>
                    <p class="deactive">关</p>
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
            thumbnailStatus: '',
            isEdit: false
        };
    },
    async created() {
        try {
            let res = await this.$service.getThumbnailStatus();
            if (res && res.code === 0) {
                this.thumbnailStatus = res.data + '';
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        async saveHandler() {
            try {
                let res = await this.$service.updateThumbnailStatus({
                    thumbnailStatus: this.thumbnailStatus
                });
                if (res && res.code === 0) {
                    if (this.thumbnailStatus) {
                        this.$message.success('回看缩略图已开启');
                    } else {
                        this.$message.success('回看缩略图已关闭');
                    }
                    this.isEdit = false;
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
        }
    }
};
</script>
<style lang="scss" scoped>
.lookback-thumbnail-container {
    .content {
        text-align: left;
        margin-top: 58px;
        .svg-wrapper {
            width: 270px;
            height: 180px;
            .svg-icon {
                width: 270px;
                height: 180px;
            }
            p {
                text-align: center;
                color: #A5A8B0;
                font-size: 24px;
                font-weight: 400;
                margin-top: 10px;
                &.active {
                    color: #3AC26F;
                }
                &.deactive {
                    color: #ED4242;
                }
            }
        }
        .control-content {
            display: flex;
            .svg-wrapper {
                margin-right: 20px;
                .svg-icon {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
