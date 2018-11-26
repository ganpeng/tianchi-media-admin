<template>
    <div class="single-image-uploader-container">
        <div class="wrapper">
            <div :style="styleStr" v-show="uri" class="img-wrapper">
                <img :style="styleStr" :src="uri" alt="">
                <i @click="deleteImage" class="el-icon-error"></i>
            </div>
            <div class="uploader-wrapper">
                <div class="uploader" :style="styleStr">
                    <label class="ui_button ui_button_primary" :for="id">
                        <i class="el-icon-plus"></i>
                    </label>
                    <input name="file" ref="singleImageUploader" :disabled="isUploading" class="el-upload__input" type="file" :id="id" accept="image/*">
                </div>
                <p class="image-dimension">{{allowResolutions[0].width}}*{{allowResolutions[0].height}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import {uploadRequest, promiseImageSize, filterSizeMatchFiles} from '../../../util/upload';
export default {
    name: 'SingleImageUploader',
    props: {
        id: {
            type: String,
            default: 'single-image-uploader'
        },
        dimension: {
            type: Object,
            default: () => {
                return {
                    width: 100,
                    height: 100
                };
            }
        },
        uri: {
            type: String,
            default: ''
        },
        allowResolutions: {
            type: Array,
            default: () => []
        },
        uploadSuccessHandler: {
            type: Function,
            default: () => {}
        },
        deleteImage: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            progress: 0,
            isUploading: false
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector(`#${this.id}`);
            testUpload.addEventListener('change', this.uploadChangeHandler.bind(this));
        });
    },
    computed: {
        styleStr() {
            if (this.allowResolutions[0]) {
                return `width:${this.allowResolutions[0].width * 0.3}px;height:${this.allowResolutions[0].height * 0.3}px;`;
            } else {
                return `width:${this.dimension.width}px;height:${this.dimension.height}px;`;
            }
        }
    },
    methods: {
        async uploadChangeHandler(e) {
            let baseUri = await this.$util.getUploadServer();
            let images = await promiseImageSize(e.target.files);
            let fileList = filterSizeMatchFiles(images, this.allowResolutions);
            if (fileList.length === 0) {
                this.$message.error('本次选择图片不符合尺寸要求');
                this.$refs.singleImageUploader.value = null;
                return false;
            } else {
                if (!this.isUploading) {
                    try {
                        let {file, demension} = fileList[0];
                        let formData = new FormData();
                        formData.append('file', file);
                        let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
                        let options = {
                            formData,
                            headers,
                            uri: `${baseUri}/v1/storage/image`,
                            progressHandler: (event) => {
                                let percent = event.loaded / event.total * 100;
                                this.progress = Math.round(percent);
                            }
                        };
                        this.isUploading = true;
                        let data = await uploadRequest(options);
                        let res = JSON.parse(data);
                        if (res && res.code === 0) {
                            if (res.data[0].failCode === 0 || res.data[0].failCode === 3300) {
                                let {width, height} = demension;
                                let {id, uri, originName} = res.data[0].image;
                                let image = { id, width, height, uri, name: originName };
                                this.uploadSuccessHandler(image);
                            } else {
                                this.$message.error(res.data[0].failReason);
                            }
                        }
                        this.isUploading = false;
                        this.$refs.singleImageUploader.value = null;
                    } catch (err) {
                        console.log(err);
                        this.isUploading = false;
                        this.$refs.singleImageUploader.value = null;
                    }
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
}
.img-wrapper {
    position: relative;
    // width: 100px;
    // height: 100px;
    margin-right: 10px;
    border: 1px solid #3E495E;
    border-radius: 4px;
    cursor: pointer;
    img {
        display: inline-block;
    }
    i {
        display: none;
        position: absolute;
        top: 4px;
        right: 4px;
        color: $closeBtnHoverColor;
    }
    &:hover {
        opacity: 0.6;
        i {
            display: block;
        }
    }
}
.el-progress.progress-bar.el-progress--line {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
.image-dimension {
    font-size: 12px;
    height: 22px;
    line-height: 22px;
    color: #6F7480;
    text-align: center;
}
</style>
