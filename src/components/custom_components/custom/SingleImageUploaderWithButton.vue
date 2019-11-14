<template>
    <div class="single-image-uploader-container">
        <div class="wrapper">
            <div class="uploader-wrapper">
                <div class="uploader">
                    <label class="ui_button ui_button_primary" :for="id">
                        <span class="btn btn-style-two">
                            选择图片
                        </span>
                    </label>
                    <input name="file" ref="singleImageUploader" :disabled="isUploading" class="el-upload__input"
                           type="file" :id="id" accept="image/*">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {uploadRequest, promiseImageSize, filterSizeMatchFiles} from '../../../util/upload';

    export default {
        name: 'SingleImageUploaderWithButton',
        props: {
            id: {
                type: String,
                default: 'single-image-uploader-with-button'
            },
            allowFileList: {
                type: Function
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
        async created() {
            try {
                await this.$nextTick();
                let testUpload = document.querySelector(`#${this.id}`);
                testUpload.addEventListener('change', this.uploadChangeHandler.bind(this));
            } catch (err) {
                console.log(err);
            }
        },
        computed: {},
        methods: {
            async uploadChangeHandler(e) {
                let baseUri = await this.$util.getUploadServer();
                let images = await promiseImageSize(e.target.files);
                let fileList = [];
                if (this.allowFileList) {
                    fileList = this.allowFileList(images);
                } else {
                    fileList = filterSizeMatchFiles(images, this.allowResolutions);
                }
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
                                    let image = {id, width, height, uri, name: originName};
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
    .uploader {
        label {
            border: none;
            span.btn.btn-style-two {
                min-width: 100px;
                padding: 0;
                font-size: 16px;
                border-radius: 20px;
                height: 40px;
                line-height: 40px;
                color: $btnText;
                background: $mainBtn;
                border: none;
            }
            &:hover {
                border-color: $mainColor;
                .el-icon-plus {
                    color: $mainColor;
                }
            }
        }
    }
</style>
