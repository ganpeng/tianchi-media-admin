<template>
    <div class="edit-site-custom-container">
        <div v-if="type === 1" class="logo-field">
            <div class="content-title">站点logo</div>
            <div class="seperator-line"></div>
            <div class="content">
                <div v-if="logoPngUrl" :style="bgImageStyle(logoPngUrl)" class="logo-container re-container">
                </div>
                <div class="uploader">
                    <label class="ui_button ui_button_primary" for="logo-uploader">
                        <i class="el-icon-plus"></i>
                    </label>
                    <input ref="logoUploader" type="file" id="logo-uploader" accept="image/*">
                </div>
            </div>
        </div>
        <div v-if="type === 2" class="image-field">
            <div class="content-title">开机图片</div>
            <div class="seperator-line"></div>
            <div class="content">
                <div v-if="logoUrl" :style="bgImageStyle(logoUrl)" class="image-container re-container">
                    <span class="name">logo.jpg</span>
                </div>
                <div class="uploader">
                    <label class="ui_button ui_button_primary" for="image-uploader">
                        <i class="el-icon-plus"></i>
                    </label>
                    <input ref="imageUploader" type="file" id="image-uploader" accept="image/*">
                </div>
            </div>
        </div>
        <div v-if="type === 3" class="video-field">
            <div class="content-title">开机视频</div>
            <div class="seperator-line"></div>
            <div class="content">
                <div v-if="getVideoUrl" class="video-container re-container">
                    <span class="name">{{videoName}}</span>
                    <span @click="displayVideo()" class="video-icon">
                        <svg-icon icon-class="ad_video" class="video"></svg-icon>
                    </span>
                </div>
                <div class="uploader">
                    <label class="ui_button ui_button_primary" for="video-uploader">
                        <i class="el-icon-plus"></i>
                    </label>
                    <input ref="videoUploader" type="file" id="video-uploader" accept="video/*">
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" @click="saveHandler">保存</el-button>
            <el-button class="btn-style-three" @click="goBack">返回</el-button>
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
import axios from 'axios';
import _ from 'lodash';
import DisplayVideoDialog from '@/components/custom_components/custom/DisplayVideoDialog';
export default {
    name: 'EditSiteCustom',
    components: { DisplayVideoDialog },
    data() {
        return {
            type: '',
            // logo
            logoPngUrl: '',
            // 开机图片相关
            logoUrl: '',
            logoMd5: '',
            // 开机视频相关
            bootanimationUrl: '',
            bootanimationMd5: '',
            videoUrl: '',
            videoMd5: ''
        };
    },
    async created() {
        try {
            let {type} = this.$route.query;
            this.type = parseInt(type);
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
            await this.$nextTick();
            if (this.type === 1) {
                let logoUpload = document.querySelector('#logo-uploader');
                logoUpload.addEventListener('change', this.logoUploaderHandler.bind(this), false);
            }
            if (this.type === 2) {
                let imageUpload = document.querySelector('#image-uploader');
                imageUpload.addEventListener('change', this.imageUploadHandler.bind(this), false);
            }
            if (this.type === 3) {
                let videoUpload = document.querySelector('#video-uploader');
                videoUpload.addEventListener('change', this.videoUploadHandler.bind(this), false);
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        getVideoUrl() {
            return this.videoUrl || this.bootanimationUrl;
        }
    },
    methods: {
        bgImageStyle(url) {
            return `background-image: url(${url})`;
        },
        displayVideo() {
            this.$refs.displayVideoDialog.showDialog();
        },
        async validatLogo(file) {
            try {
                let errorMessage = '';
                if (!/.png$/.test(file.name)) {
                    errorMessage = '图片仅支持png格式';
                    this.$refs.logoUploader.value = null;
                } else {
                    let fileObj = await this.loadFile(file);
                    let imageInfo = await this.loadImage(fileObj);
                    let width = _.get(imageInfo, 'width');
                    let height = _.get(imageInfo, 'height');
                    if (width > 150 || height !== 60) {
                        errorMessage = '图片高度必须为60px，宽度不能大于150px';
                        this.$refs.logoUploader.value = null;
                    }
                }
                return errorMessage;
            } catch (err) {
                console.log(err);
            }
        },
        async logoUploaderHandler(e) {
            try {
                let file = e.target.files[0];
                let errorMessage = await this.validatLogo(file);
                if (errorMessage) {
                    this.$message.error(errorMessage);
                    return false;
                } else {
                    //  获取上传文件的服务器地址
                    let baseUri = await this.$util.getUploadServer();
                    // 构造上传的数据和配置项
                    let formData = new FormData();
                    formData.append('file', file);
                    let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
                    let uri = `${baseUri}/v1/storage/image`;
                    let res = await axios.post(uri, formData, { headers });
                    if (res && (_.get(res, 'data.code') === 0)) {
                        let image = _.get(res.data, 'data.0.image');
                        let failCode = _.get(res.data, 'data.0.failCode');
                        let failReason = _.get(res.data, 'data.0.failReason');
                        if (failCode === 0 || failCode === 3300) {
                            // let {url, originName, id, width, height, key} = image;
                            let {uri} = image;
                            this.logoPngUrl = uri;
                        } else {
                            this.$message.error(failReason);
                        }
                    } else {
                        this.$message.error('图片保存失败');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        async validatImage(file) {
            try {
                let errorMessage = '';
                if (file.name !== 'logo.jpg') {
                    errorMessage = '图片名称必须为logo.jpg，否则不可上传';
                    this.$refs.imageUploader.value = null;
                } else {
                    let fileObj = await this.loadFile(file);
                    let imageInfo = await this.loadImage(fileObj);
                    let width = _.get(imageInfo, 'width');
                    let height = _.get(imageInfo, 'height');
                    if (!(width === 1920 && height === 1080)) {
                        errorMessage = '图片宽度必须为1920px，高度必须为1080px';
                        this.$refs.imageUploader.value = null;
                    }
                }
                return errorMessage;
            } catch (err) {
                console.log(err);
            }
        },
        async imageUploadHandler(e) {
            try {
                let file = e.target.files[0];
                let errorMessage = await this.validatImage(file);
                if (errorMessage) {
                    this.$message.error(errorMessage);
                    return false;
                } else {
                    //  获取上传文件的服务器地址
                    let baseUri = await this.$util.getUploadServer();
                    // 构造上传的数据和配置项
                    let formData = new FormData();
                    formData.append('file', file);
                    let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
                    let uri = `${baseUri}/v1/storage/image`;
                    let res = await axios.post(uri, formData, { headers });
                    if (res && (_.get(res, 'data.code') === 0)) {
                        let image = _.get(res.data, 'data.0.image');
                        let failCode = _.get(res.data, 'data.0.failCode');
                        let failReason = _.get(res.data, 'data.0.failReason');
                        if (failCode === 0 || failCode === 3300) {
                            // let {url, originName, id, width, height, key} = image;
                            let {uri, key} = image;
                            this.logoUrl = uri;
                            this.logoMd5 = key;
                        } else {
                            this.$message.error(failReason);
                        }
                    } else {
                        this.$message.error('图片保存失败');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        async validatVideo(file) {
            try {
                let errorMessage = '';
                if (file.name !== 'ad.mp4' && file.name !== 'bootanimation.zip') {
                    errorMessage = 'mp4文件名称必须为ad.mp4，zip文件名称必须为bootanimation.zip，否则不可上传';
                    this.$refs.videoUploader.value = null;
                } else {
                    if (file.name === 'ad.mp4') {
                        let videoInfo = await this.loadVideo(file);
                        let width = _.get(videoInfo, 'width');
                        let height = _.get(videoInfo, 'height');
                        if (!(width === 1920 && height === 1080)) {
                            errorMessage = 'mp4视频的分辨率必须是1920*1080的，否则不可上传';
                            this.$refs.videoUploader.value = null;
                        }
                    }
                }
                return errorMessage;
            } catch (err) {
                console.log(err);
            }
        },
        async videoUploadHandler(e) {
            try {
                let file = e.target.files[0];
                let errorMessage = await this.validatVideo(file);
                if (errorMessage) {
                    this.$message.error(errorMessage);
                    return false;
                } else {
                    //  获取上传文件的服务器地址
                    let baseUri = await this.$util.getUploadServer();
                    // 构造上传的数据和配置项
                    let formData = new FormData();
                    formData.append('file', file);
                    let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
                    let uri = `${baseUri}/v1/storage/file`;
                    let res = await axios.post(uri, formData, { headers });
                    if (res && (_.get(res, 'data.code') === 0)) {
                        let _file = _.get(res.data, 'data.0.file');
                        let failCode = _.get(res.data, 'data.0.failCode');
                        let failReason = _.get(res.data, 'data.0.failReason');
                        if (failCode === 0 || failCode === 3300) {
                            // let {url, originName, id, width, height, key} = image;
                            let {uri, key} = _file;
                            if (file.name === 'ad.mp4') {
                                this.videoUrl = uri;
                                this.videoMd5 = key;
                                this.bootanimationUrl = '';
                                this.bootanimationMd5 = '';
                            } else {
                                this.videoUrl = '';
                                this.videoMd5 = '';
                                this.bootanimationUrl = uri;
                                this.bootanimationMd5 = key;
                            }
                            this.$message.success('开机视频上传成功');
                        } else {
                            this.$message.error(failReason);
                        }
                    } else {
                        this.$message.error('图片保存失败');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        async saveHandler() {
            try {
                if (this.type === 1) {
                    let res = await this.$service.updateSiteCustomLogo({
                        logoPngUrl: this.logoPngUrl
                    });
                    if (res && res.code === 0) {
                        this.$router.push({name: 'SiteCustom'});
                    }
                }

                if (this.type === 2) {
                    let res = await this.$service.updateSiteCustom({
                        logoUrl: this.logoUrl,
                        logoMd5: this.logoMd5
                    });
                    if (res && res.code === 0) {
                        this.$router.push({name: 'SiteCustom'});
                    }
                }

                if (this.type === 3) {
                    let res = await this.$service.updateSiteCustom({
                        videoUrl: this.videoUrl,
                        videoMd5: this.videoMd5,
                        bootanimationUrl: this.bootanimationUrl,
                        bootanimationMd5: this.bootanimationMd5
                    });
                    if (res && res.code === 0) {
                        this.$router.push({name: 'SiteCustom'});
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        goBack() {
            this.$router.push({name: 'SiteCustom'});
        },
        loadFile(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (theFile) => {
                    let obj = {
                        file,
                        imageData: theFile.target.result
                    };
                    resolve(obj);
                };
                reader.onerror = (err) => {
                    reject(err);
                };
            });
        },
        loadImage(obj) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.src = obj.imageData;
                img.onload = function() {
                    resolve({
                            width: img.width,
                            height: img.height,
                            file: obj.file
                    });
                };
                img.onerror = function (err) {
                    reject(err);
                };
            });
        },
        loadVideo(file) {
            return new Promise((resolve, reject) => {
                const video = document.createElement('video');
                const url = URL.createObjectURL(file);
                video.src = url;
                video.load();
                video.onloadedmetadata = function() {
                    URL.revokeObjectURL(url);
                    resolve({
                            width: video.videoWidth,
                            height: video.videoHeight,
                            duration: video.duration,
                            file
                    });
                };
                video.onerror = function(err) {
                    reject(err);
                };
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.edit-site-custom-container {
    .content {
        display: flex;
        margin: 20px 0;
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
        .uploader {
            width: 170px;
            height: 100px;
            label {
                &:hover {
                    border-color: $mainColor;
                    .el-icon-plus {
                        color: $mainColor;
                    }
                }
            }
        }
    }
}
</style>
