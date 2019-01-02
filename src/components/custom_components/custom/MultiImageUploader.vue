<template>
    <div class="multi-image-uploader-container">
        <div class="image-list-container">
            <ul class="image-list">
                <li @click.stop="displayImage(index)" v-for="(image, index) in imageList" :key="image.id" class="image-item">
                    <div :style="styleStr(image.uri)" class="bg-field">
                        <div class="mask"></div>
                    </div>
                    <i @click.stop="deleteImageHandler(image.id)" class="el-icon-error"></i>
                    <p class="dimension-info">{{image.width}}*{{image.height}}</p>
                </li>
                <li :style="styleStr(obj.dataUri)" v-for="(obj, index) in showFileList" :key="index" class="image-item">
                    <el-progress :stroke-width="3" :show-text="false" class="progress-bar" v-show="obj.data.progress !== 0" :percentage="obj.data.progress"></el-progress>
                </li>
                <li v-show="!isUploading" :style="styleStr()" class="image-item">
                    <div class="uploader"
                        :style="styleStr()">
                        <label class="ui_button ui_button_primary" for="multi-image-uploader">
                            <i class="el-icon-plus"></i>
                        </label>
                        <input ref="multiImageUploader" type="file" id="multi-image-uploader" multiple accept="image/*">
                    </div>
                </li>
            </ul>
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>
<script>
import {
    uploadRequest,
    promiseImageSize,
    filterFile,
    filterSizeMatchFiles,
    getImageDemensionByName,
    readBlobAsDataURLFromList
} from '../../../util/upload';
import PreviewMultipleImages from './PreviewMultipleImages';
export default {
    name: 'MultiImageUploader',
    components: {
        PreviewMultipleImages
    },
    props: {
        imageList: {
            type: Array,
            default: () => []
        },
        deleteImageHandler: {
            type: Function,
            default: () => {}
        },
        dimension: {
            type: Object,
            default: () => {
                return {
                    width: 170,
                    height: 100
                };
            }
        },
        imageUploadedHandler: {
            type: Function,
            default: () => {}
        },
        allowResolutions: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            fileList: [],
            count: 0,
            isUploading: false,
            previewImage: {
                display: false,
                autoplay: false,
                activeIndex: 0,
                list: []
            }
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector('#multi-image-uploader');
            testUpload.addEventListener('change', this.uploadChangeHandler.bind(this), false);
        });
    },
    computed: {
        showFileList() {
            return this.fileList.filter((obj) => {
                return obj.data.status === 1 || obj.data.status === 3;
            });
        }
    },
    methods: {
        styleStr(dataUri) {
            if (dataUri) {
                return `width: ${this.dimension.width}px;height: ${this.dimension.height}px;background: url("${dataUri}") no-repeat; background-size: cover; background-position: center;`;
            } else {
                return `width: ${this.dimension.width}px;height: ${this.dimension.height}px;`;
            }
        },
        async uploadChangeHandler(e) {
            let images = await promiseImageSize(e.target.files);
            let imagesWithDataUri = await readBlobAsDataURLFromList(images);
            let fileList = filterSizeMatchFiles(imagesWithDataUri, this.allowResolutions);
            if (fileList.length === 0) {
                this.$message.error('本次选择图片不符合尺寸要求');
                this.resetInputField();
                return false;
            }
            let newFileList = filterFile(this.fileList, fileList);
            this.fileList = Array.from(newFileList);
            if (!this.isUploading) {
                this.uploadHandler();
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
            let {file} = this.fileList[this.count];
            formData.append('file', file);
            let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
            let options = {
                formData,
                headers,
                uri: `${baseUri}/v1/storage/image`,
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
                        let {uri, originName, id} = res.data[0].image;
                        let {width, height} = getImageDemensionByName(this.fileList, originName);
                        let obj = {id, uri, width, height, name: originName};
                        this.imageUploadedHandler(obj);
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
            this.$refs.multiImageUploader.value = null;
            this.fileList = [];
            this.count = 0;
            this.isUploading = false;
        },
        // 放大预览图片
        displayImage(index) {
            this.previewImage.display = true;
            this.previewImage.list = this.imageList;
            this.previewImage.activeIndex = index;
        }
    }
};
</script>
<style lang="scss" scoped>
.multi-image-uploader-container {
    float: left;
    margin-right: 10px;
    .image-list {
        // clear: both;
        display: flex;
        flex-wrap: wrap;
        .image-item {
            position: relative;
            // float: left;
            width: 170px;
            height: 126px;
            margin-right: 30px;
            margin-bottom: 10px;
            cursor: zoom-in;
            .bg-field {
                position: relative;
                border: 1px solid #3E495E;
                border-radius: 4px;
            }
            .dimension-info {
                margin-top: 10px;
                color: #A8ABB3;
                text-align: center;
            }
            .progress-bar {
                position: absolute;
                bottom: 0px;
                width: 100%;
            }
            i.el-icon-error {
                display: none;
                position: absolute;
                top: 4px;
                right: 4px;
                font-size: 18px;
                color: $closeBtnHoverColor;
                cursor: pointer;
                z-index: 1000000;
            }
            .mask {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(#000, 0.6);
            }
            &:hover {
                .mask {
                    display: block;
                }
                i {
                    display: block;
                }
            }
        }
    }
    .uploader {
        label {
            &:hover {
                border-color: $mainColor;
            }
        }
    }
}
</style>
