<!--单张图片预览组件-->
<template>
    <div class="text-center">
        <el-dialog
            width="70%"
            :title="previewSingleImage.title"
            :visible.sync="previewSingleImage.display">
            <div
                :style="{ 'background-image': 'url(' + appendImagePrefix(previewSingleImage.uri) + ')'}"
                class="image-box">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'PreviewSingleImage',
        props: ['previewSingleImage'],
        methods: {
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            }
        }
    };
</script>

<style lang="less" scoped>

    .image-box {
        margin: 0px auto;
        width: 70%;
        height: 500px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }

</style>
