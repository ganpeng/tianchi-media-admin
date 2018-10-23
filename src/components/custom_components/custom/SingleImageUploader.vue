<template>
    <div class="single-image-uploader-container">
        <div tabindex="0" class="el-upload el-upload--picture-card">
            <i class="el-icon-plus"></i>
            <input name="file" ref="singleImageUploader" :disabled="isUploading" class="el-upload__input" type="file" id="single-image-uploader" accept="image/*">
            <el-progress :show-text="false" class="progress-bar" v-show="progress !== 0" :percentage="progress"></el-progress>
        </div>
    </div>
</template>
<script>
import {uploadRequest, promiseImageSize, filterSizeMatchFiles} from '../../../util/upload';
export default {
    name: 'SingleImageUploader',
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
    methods: {
        async uploadChangeHandler(e) {
            let baseUri = await this.$util.getUploadServer();
            let images = await promiseImageSize(e.target.files);
            let fileList = filterSizeMatchFiles(images, [{width: 807, height: 455}]);
            if (fileList.length === 0) {
                this.$message.error('本次选择图片不符合尺寸要求');
                return false;
            }
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
                    let res = await uploadRequest(options);
                    if (res) {
                        console.log(res);
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
};
</script>
<style scoped>
.image-item {
    display: inline-block;
    width: 60px;
    height: 60px;
    background: red;
}
.el-upload--picture-card {
    position: relative;
}
.el-upload__input {
    position: absolute;
    display: inline-block;
    cursor: pointer;
    opacity: 0;
    width: 148px;
    height: 148px;
    left: 0;
    z-index: 10;
}
.progress-bar {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
</style>
