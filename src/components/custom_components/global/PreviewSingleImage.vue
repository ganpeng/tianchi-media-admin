<!--单张图片预览组件-->
<template>
    <div class="text-center">
        <el-dialog :title="previewSingleImage.title" :visible.sync="previewSingleImage.display">
            <img :src="previewSingleImage.url">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'PreviewSingleImage',
        props: ['previewSingleImage'],
        data() {
            return {};
        },
        mounted() {
        },
        methods: {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    img {
        width: 80%;
    }
</style>
