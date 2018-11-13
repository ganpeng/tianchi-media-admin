<template>
    <div class="single-image-uploader-container">
        <div class="uploader"
            :style="styleStr">
            <label class="ui_button ui_button_primary" for="single-image-uploader">
                <i class="el-icon-plus"></i>
            </label>
            <input name="file" ref="singleImageUploader" :disabled="isUploading" class="el-upload__input" type="file" id="single-image-uploader" accept="image/*">
            <el-progress :stroke-width="3" :show-text="false" class="progress-bar" v-show="progress !== 0" :percentage="progress"></el-progress>
        </div>
    </div>
</template>
<script>
import {uploadRequest, promiseImageSize, filterSizeMatchFiles} from '../../../util/upload';
export default {
    name: 'SingleImageUploader',
    props: {
        dimension: {
            type: Object,
            default: () => {
                return {
                    width: 100,
                    height: 100
                };
            }
        },
        allowResolutions: {
            type: Array,
            default: () => []
        },
        uploadSuccessHandler: {
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
            let testUpload = document.querySelector('#single-image-uploader');
            testUpload.addEventListener('change', this.uploadChangeHandler.bind(this));
        });
    },
    computed: {
        styleStr() {
            return `width:${this.dimension.width}px;height:${this.dimension.height}px;`;
        }
    },
    methods: {
        async uploadChangeHandler(e) {
            let baseUri = await this.$util.getUploadServer();
            let images = await promiseImageSize(e.target.files);
            let fileList = filterSizeMatchFiles(images, this.allowResolutions);
            if (fileList.length === 0) {
                this.$message.error('本次选择图片不符合尺寸要求');
                return false;
            } else {
                if (!this.isUploading) {
                    try {
                        let file = fileList[0];
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
                                this.uploadSuccessHandler(res.data[0].image);
                                this.image = res.data[0].image;
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
.el-progress.progress-bar.el-progress--line {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
</style>
