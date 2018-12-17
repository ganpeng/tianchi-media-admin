<template>
    <div class="programme-import-container import-container">
        <div class="left">
            <div class="header">
                <h3>上传状态</h3>
            </div>
            <div class="seperator-line"></div>
            <div class="info-field">
                <h3>以选文件</h3>
                <p class="file-name">
                    {{this.file ? this.file.name : ''}}
                    <span style="margin-left: 20px;" :class="[success ? 'text-success' : 'text-danger']">{{this.importStatus}}</span>
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
                    <div id="programme-drag-container" class="uploader">
                        <label class="ui_button ui_button_primary">
                            <i class="el-icon-plus"></i>
                        </label>
                    </div>
                    <div class="upload-btn-wrapper">
                        <div class="btn-uploader">
                            <label class="ui_button ui_button_primary" for="programme-import-uploader">
                                选择文件
                            </label>
                            <input name="file" ref="programmeImportUploader" class="el-upload__input" type="file" id="programme-import-uploader" accept=".xlsx, .xls">
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
    name: 'ProgrammeImport',
    data() {
        return {
            progress: 0,
            importStatus: '',
            file: null,
            success: false
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector('#programme-import-uploader');
            let dragContainer = document.querySelector('#programme-drag-container');

            testUpload.addEventListener('change', (e) => {
                let file = e.target.files[0];
                this.uploadChangeHandler(file);
            });

            dragContainer.addEventListener('drop', (evt) => {
                evt.stopPropagation();
                evt.preventDefault();

                const dt = evt.dataTransfer;
                const files = dt.files;
                const item = dt.items[0];
                if (item.webkitGetAsEntry().isDirectory) {
                    this.$message.error('只能拖拽上传文件，不支持文件夹');
                    return false;
                }

                if (files.length > 0) {
                    this.uploadChangeHandler(files[0]);
                }
            });

            dragContainer.addEventListener('dragover', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            });
        });
    },
    methods: {
        async uploadChangeHandler(file) {
            try {
                if (!this.isUploading) {
                    this.file = file;
                    let formData = new FormData();
                    formData.append('file', file);
                    let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
                    let options = {
                        formData,
                        headers,
                        uri: `/admin/v1/content/programme/import`,
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
                this.success = false;
                this.$refs.programmeImportUploader.value = null;
            }
        },
        uploadSuccessHandler(res) {
            if (res && res.code === 0) {
                this.importStatus = '节目导入成功';
                this.success = true;
                this.$message.success('节目导入成功');
            } else {
                this.importStatus = res.message;
                this.success = false;
                this.$message.error(res.message);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
