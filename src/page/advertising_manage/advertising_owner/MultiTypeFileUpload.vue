<template>
    <div class="multi-type-file-upload-container">
        <div class="image-list-container">
            <ul class="image-list">
                <li @click.stop="displayImage(image, index)" v-for="(image, index) in adMaterialList" :key="image.id" class="image-item">
                    <div class="image-warpper">
                        <img v-if="image.mediaType === 'IMAGE'" :src="image.storageUri" class="image" alt="">
                        <span v-else @click="displayVideo(image)" class="image video-item" alt="">
                            <!-- <span class="play-btn">
                                <i class="el-icon-caret-right"></i>
                            </span> -->
                        </span>
                        <div class="mask">
                            <div class="basic-info-wrapper">
                                <span class="dimension">{{image.width}}*{{image.height}}</span>
                                <span class="size">
                                    {{convertFileSize(image.size)}}
                                    {{image.duration ? `${image.duration}s` : ''}}
                                </span>
                            </div>
                            <span v-if="image.mediaType === 'IMAGE' && !isGif(image.name)" class="image-icon">
                                <svg-icon class="image" icon-class="ad_image"></svg-icon>
                            </span>
                            <span v-if="image.mediaType === 'IMAGE' && isGif(image.name)" class="image-icon">
                                <svg-icon class="image" icon-class="ad_gif"></svg-icon>
                            </span>
                        </div>
                        <span v-if="image.mediaType === 'VIDEO'" @click="displayVideo(image)" class="video-icon">
                            <svg-icon icon-class="ad_video" class="video"></svg-icon>
                        </span>
                    </div>
                    <!-- <span v-if="!isUploading" @click.stop="deleteImage(image.id, index)" class="delete-btn-one small delete-icon">
                        &times;
                    </span> -->
                    <span v-if="!isUploading" @click.stop="deleteImage(image.id, index)" class="delete-icon">
                        <svg-icon icon-class="remove_image_hover"></svg-icon>
                        <svg-icon icon-class="remove_image_default"></svg-icon>
                    </span>
                    <p class="dimension-info my-ellipsis">{{image.name}}</p>
                </li>
                <li :style="styleStr(obj.dataUri)" v-for="(obj, index) in showFileList" :key="index" class="image-item uploading-image-item">
                    <el-progress :stroke-width="3" :show-text="false" class="progress-bar" v-show="obj.data.progress !== 0" :percentage="obj.data.progress"></el-progress>
                </li>
                <li v-show="!isUploading" class="image-item">
                    <div class="uploader">
                        <label class="ui_button ui_button_primary" for="multi-type-uploader">
                            <i class="el-icon-plus"></i>
                        </label>
                        <input ref="multiITypeUploader" type="file" id="multi-type-uploader" multiple accept="image/*, video/*">
                    </div>
                </li>
            </ul>
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <display-video-dialog
            ref="displayVideoDialog"
            :title="video.title"
            :url="video.url"
            type="video/mp4"
        ></display-video-dialog>
    </div>
</template>
<script>
import { uploadRequest, promiseFileSize, videoRegex, filterFile, filterNotMatchFiles } from '../../../util/upload';
import PreviewMultipleImages from '../../../components/custom_components/custom/PreviewMultipleImages';
import DisplayVideoDialog from '../../../components/custom_components/custom/DisplayVideoDialog';

export default {
    name: 'MultiTypeFileUpload',
    components: { PreviewMultipleImages, DisplayVideoDialog },
    props: {
        adMaterialList: {
            type: Array,
            default: () => []
        },
        fileUploadedSuccessHandler: {
            type: Function,
            default: () => {}
        },
        deleteAdMaterialHandler: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            isUploading: false,
            fileList: [],
            count: 0,
            previewImage: {
                display: false,
                autoplay: false,
                activeIndex: 0,
                list: []
            },
            displayVideoDialogVisible: false,
            video: {
                title: '',
                url: ''
            }
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector('#multi-type-uploader');
            testUpload.addEventListener('change', this.uploadChangeHandler.bind(this), false);
        });
    },
    computed: {
        showFileList() {
            return this.fileList.filter((obj) => {
                return obj.data.status === 1 || obj.data.status === 3;
            });
        },
        previewImageList() {
            return this.adMaterialList.map((item) => {
                return {
                    id: item.storageId,
                    name: item.name,
                    uri: item.storageUri,
                    width: item.width,
                    height: item.height
                };
            });
        },
        convertFileSize() {
            return (size) => {
                return this.$util.convertFileSize(size);
            };
        },
        isGif() {
            return (name) => {
                return /gif$/.test(name);
            };
        }
    },
    methods: {
        styleStr(dataUri) {
            if (dataUri) {
                return `width: 120px;height: 50px;background: url("${dataUri}") no-repeat; background-size: cover; background-position: center;`;
            } else {
                return `width: 120px;height: 50px;`;
            }
        },
        async uploadChangeHandler(e) {
            try {
                let fileList = await promiseFileSize(e.target.files);
                let newFileList = filterFile(this.fileList, fileList);
                let {matchedFiles, notMatchedFiles} = filterNotMatchFiles(newFileList);
                let messageList = notMatchedFiles.map((item) => {
                    return `资源：${item.name}, 错误原因：${item.message}`;
                });

                if (matchedFiles.length === 0) {
                    this.$message.error('本次选择没有符合要求的文件');
                    return false;
                }
                if (messageList.length > 0) {
                    this.$message.error(messageList.join(', '));
                }

                // this.fileList = Array.from(newFileList);
                this.fileList = Array.from(matchedFiles);
                if (!this.isUploading) {
                    this.uploadHandler();
                }
            } catch (err) {
                console.log(err);
            }
        },
        async uploadHandler() {
            if (this.fileList[this.count] === undefined) {
                this.resetInputField();
                return false;
            }
            //  获取上传文件的服务器地址
            let baseUri = await this.$util.getUploadServer();
            // 构造上传的数据和配置项
            let formData = new FormData();
            let {file, demension} = this.fileList[this.count];
            formData.append('file', file);
            let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
            let uri = videoRegex.test(file.type) ? `${baseUri}/v1/storage/file` : `${baseUri}/v1/storage/image`;
            let options = {
                formData,
                headers,
                uri,
                progressHandler: (event) => {
                    let percent = event.loaded / event.total * 100;
                    this.updateProgress(Math.round(percent));
                }
            };
            //  准备开始上传了
            this.updateStatus(3);
            this.isUploading = true;
            try {
                let resStr = await uploadRequest(options);
                let res = JSON.parse(resStr);
                //  上传成功 0 成功, 1 等待, 2 失败 3 正在上传
                if (res && (res.code === 0)) {
                    if (res.data[0] && (res.data[0].failCode === 0 || res.data[0].failCode === 3300)) {
                        let result = { ...res.data[0], demension };
                        this.fileUploadedSuccessHandler(result);
                    } else {
                        this.$message.error(res.data[0].failReason);
                    }
                } else {
                    this.$message.error('图片保存失败');
                }
                this.updateStatus(0);
                this.count++;
                this.uploadHandler();
            } catch (err) {
                //  上传失败
                console.log(err);
                this.updateStatus(2);
                console.log('error');
                this.count++;
                this.uploadHandler();
            }
        },
        updateProgress(progress) {
            this.fileList = this.fileList.map((item, index) => {
                if (index === this.count) {
                    item.data.progress = progress;
                }
                return item;
            });
        },
        updateStatus(status) {
            this.fileList = this.fileList.map((item, index) => {
                if (index === this.count) {
                    item.data.status = status;
                }
                return item;
            });
        },
        resetInputField() {
            this.$refs.multiITypeUploader.value = null;
            this.fileList = [];
            this.count = 0;
            this.isUploading = false;
        },
        // 放大预览图片
        displayImage(obj, index) {
            if (obj.mediaType === 'IMAGE') {
                this.previewImage.display = true;
                this.previewImage.list = this.previewImageList;
                this.previewImage.activeIndex = index;
            } else {
                this.displayVideo(obj);
            }
        },
        displayVideo(obj) {
            this.video.title = obj.name;
            this.video.url = obj.storageUri;
            this.$refs.displayVideoDialog.showDialog();
        },
        async deleteImage(id, index) {
            try {
                let confirm = await this.$confirm(`您确定要删除图片吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.deleteAdMaterialById(id);
                    if (res && res.code === 0) {
                        this.deleteAdMaterialHandler(index);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.multi-type-file-upload-container {
    float: left;
    margin-right: 10px;
    .image-list {
        display: flex;
        flex-wrap: wrap;
        .image-item {
            position: relative;
            width: 170px;
            cursor: zoom-in;
            margin: 0 20px 20px 0;
            .image-warpper {
                position: relative;
                border: 1px solid #3E495E;
                border-radius: 8px;
                overflow: hidden;
                .image {
                    display: block;
                    width: 100%;
                    height: 100px;
                    border-radius: 8px;
                }
                .video-item {
                    position: relative;
                    .play-btn {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 50px;
                        height: 50px;
                        border-radius: 50px;
                        background: rgba(0,0,0,0.50);
                        i {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-size: 30px;
                            color: #333B4E;
                        }
                        z-index: 150;
                        cursor: pointer;
                    }
                }
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
                .mask {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #293550;
                    opacity: 0.8;
                    border: 1px solid #293550;
                    border-radius: 8px;
                    line-height: 14px!important;
                    .basic-info-wrapper {
                        position: absolute;
                        top: 20px;
                        left: 10px;
                        .dimension,
                        .size {
                            display: block;
                            font-size: 12px;
                            color: #fff;
                            text-align: left;
                        }
                    }
                    .image-icon {
                        position: absolute;
                        bottom: 10px;
                        left: 7px;
                        .svg-icon {
                            width: 40px;
                            height: 22px;
                        }
                    }
                }
                &:hover {
                    .mask {
                        display: block;
                    }
                }
            }
            .bg-field {
                position: relative;
                border: 1px solid #3E495E;
                border-radius: 8px;
            }
            .dimension-info {
                margin-top: 10px;
                color: #A8ABB3;
                font-size: 14px;
                line-height: 18px;
                text-align: center;
            }
            .progress-bar {
                position: absolute;
                left: 50%;
                bottom: 0px;
                width: 98%;
                transform: translateX(-50%);
                border-radius: 8px;
            }
            span.delete-icon {
                display: none;
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
                z-index: 1000000;
                .svg-icon-remove_image_default,
                .svg-icon-remove_image_hover {
                    width: 23px;
                    height: 23px;
                }
                .svg-icon-remove_image_default {
                    display: block;
                }
                .svg-icon-remove_image_hover {
                    display: none;
                }
                &:hover {
                    .svg-icon-remove_image_hover {
                        display: block;
                    }
                    .svg-icon-remove_image_default {
                        display: none;
                    }
                }
                // background-color: rgba(0, 0, 0, 0.5);
                // &:hover {
                //     background-color: rgb(0, 0, 0);
                // }
            }
            &:hover {
                .mask {
                    display: block;
                }
                span.delete-icon {
                    display: block;
                }
            }
        }
        .uploading-image-item {
            border-radius: 8px;
            border: 1px solid #3E495E;
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
</style>
