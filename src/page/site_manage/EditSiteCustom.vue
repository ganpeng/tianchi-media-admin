<template>
    <div class="edit-site-custom-container">
        <div v-if="type === 1" class="logo-field">
            <div class="content-title">站点logo</div>
            <div class="seperator-line"></div>
            <div class="content">
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
    </div>
</template>
<script>
import axios from 'axios';
import _ from 'lodash';
export default {
    name: 'EditSiteCustom',
    data() {
        return {
            type: ''
        };
    },
    mounted() {
    },
    async created() {
        try {
            let {type} = this.$route.query;
            this.type = parseInt(type);
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
    methods: {
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
                    if (res && res.code === 0) {
                        console.log(res);
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
                    if (res && res.code === 0) {
                        console.log(res);
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
                    if (res && res.code === 0) {
                        console.log(res);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        async saveHandler() {
            try {
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
        margin: 20px 0;
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
