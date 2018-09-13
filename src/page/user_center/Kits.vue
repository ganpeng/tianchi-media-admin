<!--小功能测试中心-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>小功能测试中心<label>（上线会删除）</label></el-breadcrumb-item>
        </el-breadcrumb>
        <!--生成直播节目单-->
        <generate-programme-xml>
        </generate-programme-xml>
        <!--导出所有注入失败的视频-->
        <export-excel-video-failed>
        </export-excel-video-failed>
    </div>
</template>

<script>
    import GenerateProgrammeXml from './GenerateProgrammeXml';
    import ExportExcelVideoFailed from './ExportExcelVideoFailed';

    export default {
        name: 'Kits',
        components: {
            GenerateProgrammeXml,
            ExportExcelVideoFailed
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
