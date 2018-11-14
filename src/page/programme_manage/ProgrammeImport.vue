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
                        <label class="ui_button ui_button_primary" for="programme-import-uploader">
                            <i class="el-icon-plus"></i>
                        </label>
                        <input name="file" ref="programmeImportUploader" class="el-upload__input" type="file" id="programme-import-uploader" accept=".xlsx, .xls">
                    </div>
                    <!--
                    <el-button class="btn-style-four contain-svg-icon">
                        <svg-icon
                            icon-class="video"
                            class-name="svg-box">
                        </svg-icon>
                        选择文件
                    </el-button>
                    -->
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
                this.$refs.programmeImportUploader.value = null;
            }
        },
        uploadSuccessHandler(res) {
            if (res && res.code === 0) {
                this.importStatus = '节目导入成功';
                this.$message.success('节目导入成功');
            } else {
                this.importStatus = res.message;
                this.$message.error(res.message);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.import-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    font-size: 24px;
    color: #6F7480;
    .left {
        flex: 1;
        padding: 0 20px;
        .header {
            margin: 20px 0;
        }
        .info-field {
            h3 {
                font-size: 20px;
                color: #6F7480;
                margin: 20px 0;
            }
            .file-name {
                width: 800px;
                height: 40px;
                margin: 0 auto;
                line-height: 40px;
                font-size: 14px;
                color: #6F7480;
                background: #2A3040;
                border-radius: 8px;
            }
        }
    }
    .right {
        position: relative;
        width: 300px;
        border-left: 1px solid #3E495E;
        .inner-right {
            margin-left: 20px;
            .header {
                margin: 20px 0;
            }
            .input-field {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                h5 {
                    font-size: 14px;
                    margin: 10px 0;
                    color: #6F7480;
                }
                .uploader {
                    width: 240px;
                    height: 240px;
                }
            }
        }
    }
}
</style>
