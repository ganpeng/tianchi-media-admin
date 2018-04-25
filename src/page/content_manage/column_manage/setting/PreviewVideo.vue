<!--视频预览组件-->
<template>
    <div>
        <el-dialog :title="previewVideo.title" :visible.sync="previewVideo.display">
            <video src="~assets/swf/test.mp4" controls="controls" autoplay="autoplay"
                   v-if="previewVideo.display"></video>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'PreviewVideo',
        props: ['previewVideo'],
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

</style>
