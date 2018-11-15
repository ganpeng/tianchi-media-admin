<template>
    <div class="person-import-container import-container">
        <div class="left">
            <div class="header">
                <h3>上传状态</h3>
            </div>
            <div class="seperator-line"></div>
            <div class="info-field">
                <h3>以选文件</h3>
                <p class="file-name">
                    {{this.file ? this.file.name : ''}}
                </p>
            </div>
        </div>
        <div class="right">
            <div class="inner-right">
                <div class="header">
                    <h3>批量导入区域</h3>
                </div>
                <div class="seperator-line"></div>
                <div class="input-field">
                    <h5>拖拽文件到此区域进行上传</h5>
                    <div class="uploader">
                        <label class="ui_button ui_button_primary">
                            <i class="el-icon-plus"></i>
                        </label>
                    </div>
                    <div class="upload-btn-wrapper">
                        <div class="btn-uploader">
                            <label class="ui_button ui_button_primary" for="person-import-uploader">
                                选择文件
                            </label>
                            <input name="file" ref="personImportUploader" class="el-upload__input" type="file" id="person-import-uploader" accept=".xlsx, .xls">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {uploadRequest} from '../../util/upload';
export default {
    name: 'PersonImport',
    data() {
        return {
            progress: 0,
            importStatus: '',
            file: null
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector('#programme-import-uploader');
            testUpload.addEventListener('change', this.uploadChangeHandler.bind(this));
        });
    },
    methods: {
        async uploadChangeHandler(e) {
            try {
                if (!this.isUploading) {
                    let file = e.target.files[0];
                    this.file = file;
                    let formData = new FormData();
                    formData.append('file', file);
                    let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
                    let options = {
                        formData,
                        headers,
                        uri: `/admin/v1/content/figure/import`,
                        progressHandler: (event) => {
                            let percent = event.loaded / event.total * 100;
                            this.progress = Math.round(percent);
                        }
                    };
                    this.isUploading = true;
                    let data = await uploadRequest(options);
                    let res = JSON.parse(data);
                    this.uploadSuccessHandler(res);
                    this.isUploading = false;
                    this.$refs.programmeImportUploader.value = null;
                }
            } catch (err) {
                console.log(err);
                this.isUploading = false;
                this.$refs.programmeImportUploader.value = null;
            }
        },
        uploadSuccessHandler(res) {
            if (res && res.code === 0) {
                this.importStatus = '人物导入成功';
                this.$message.success('人物导入成功');
            } else {
                this.importStatus = res.message;
                this.$message.error(res.message);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
