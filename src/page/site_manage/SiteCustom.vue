<template>
    <div class="site-custom-container">
        <div class="content-title">配置定制</div>
        <div class="seperator-line"></div>
        <div class="content">
            <div class="logo">
                <h2 class="content-sub-title">站点Logo</h2>
                <div class="wrapper">
                    <div :style="bgImageStyle(logoPngUrl)" class="logo-container re-container">
                    </div>
                    <el-button v-if="hasAuthority" class="btn-style-two" @click="updateSiteCustom(1)">修改</el-button>
                </div>
            </div>
            <div class="image">
                <h2 class="content-sub-title">开机图片</h2>
                <div class="wrapper">
                    <div :style="bgImageStyle(logoUrl)" class="image-container re-container">
                        <span class="name">logo.jpg</span>
                    </div>
                    <el-button v-if="hasAuthority" class="btn-style-two" @click="updateSiteCustom(2)">修改</el-button>
                </div>
            </div>
            <div class="vid">
                <h2 class="content-sub-title">开机视频</h2>
                <div class="wrapper">
                    <div class="video-container re-container">
                        <span class="name">{{videoName}}</span>
                        <span v-if="videoName === 'ad.mp4'" @click="displayVideo()" class="video-icon">
                            <svg-icon icon-class="ad_video" class="video"></svg-icon>
                        </span>
                    </div>
                    <el-button v-if="hasAuthority" class="btn-style-two" @click="updateSiteCustom(3)">修改</el-button>
                </div>
            </div>
        </div>
        <display-video-dialog
            ref="displayVideoDialog"
            title="开机视频"
            :url="getVideoUrl"
            type="video/mp4"
        ></display-video-dialog>
    </div>
</template>
<script>
import _ from 'lodash';
import DisplayVideoDialog from '@/components/custom_components/custom/DisplayVideoDialog';
export default {
    name: 'SiteCustom',
    components: { DisplayVideoDialog },
    data() {
        return {
            // logo
            logoPngUrl: '',
            // 开机图片相关
            logoUrl: '',
            logoMd5: '',
            // 开机视频相关
            bootanimationUrl: '',
            bootanimationMd5: '',
            videoUrl: '',
            videoMd5: '',
            hasAuthority: true
        };
    },
    async created() {
        try {
            if (!this.$authority.isHasAuthority('content:startUp:get')) {
                this.hasAuthority = false;
                return false;
            }
            let res = await this.$service.getSiteCustom();
            if (res && res.code === 0) {
                this.logoUrl = _.get(res.data, 'logoUrl');
                this.logoMd5 = _.get(res.data, 'logoMd5');
                this.bootanimationUrl = _.get(res.data, 'bootanimationUrl');
                this.bootanimationMd5 = _.get(res.data, 'bootanimationMd5');
                this.videoUrl = _.get(res.data, 'videoUrl');
                this.videoMd5 = _.get(res.data, 'videoMd5');
            }

            let res2 = await this.$service.getSiteCustomLogo();
            if (res2 && res2.code === 0) {
                this.logoPngUrl = _.get(res2.data, 'logoPngUrl');
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        getVideoUrl() {
            return this.videoUrl || this.bootanimationUrl;
        },
        videoName() {
            return this.videoUrl ? 'ad.mp4' : 'bootanimation.zip';
        }
    },
    methods: {
        bgImageStyle(url) {
            return `background-image: url(${url})`;
        },
        updateSiteCustom(type) {
            this.$router.push({name: 'EditSiteCustom', query: {type}});
        },
        displayVideo() {
            this.$refs.displayVideoDialog.showDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.site-custom-container {
    .content {
        text-align: left;
        .wrapper {
            display: flex;
            align-items: center;
            .re-container {
                position: relative;
                width: 170px;
                height: 100px;
                background-color: rgba(42,48,64,1);
                border-radius: 8px;
                border: 1px solid rgba(62,73,94,1);
                margin-right: 42px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 100%;
                .video-icon {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    .svg-icon {
                        width: 30px;
                        height: 30px;
                    }
                }
                .name {
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
}
</style>
