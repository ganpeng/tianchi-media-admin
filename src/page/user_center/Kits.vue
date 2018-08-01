<!--小功能测试中心-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>小功能测试中心<label>（上线会删除）</label></el-breadcrumb-item>
        </el-breadcrumb>
        <el-upload
            ref="upload"
            :headers="uploadHeaders"
            action="/v1/media/video"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :http-request="uploadVideo"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <generate-programme-xml>
        </generate-programme-xml>
    </div>
</template>

<script>
    import GenerateProgrammeXml from './GenerateProgrammeXml';

    export default {
        name: 'Kits',
        components: {
            GenerateProgrammeXml
        },
        data() {
            return {
                fileList: [],
                uploadHeaders: {
                    'Accept': 'application/json',
                    'x-tianchi-client': '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}',
                    'x-tianchi-token': this.$store.state.user.token
                }
            };
        },
        methods: {
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
            uploadVideo(arg) {
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .el-breadcrumb {
        margin-bottom: 50px;
    }

    label {
        color: $baseBlue;
    }

</style>
