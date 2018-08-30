<!--单张图片预览组件-->
<template>
    <div v-if="previewSingleImage.display" class="cover-mask">
        <div class="title">
            <span>{{previewSingleImage.title}}</span>
        </div>
        <div class="image-box">
            <img :src="previewSingleImage.uri | imageUrl">
        </div>
        <i class="el-icon-close" @click="closePreview"></i>
    </div>
</template>

<script>
    export default {
        name: 'PreviewSingleImage',
        props: ['previewSingleImage'],
        methods: {
            closePreview() {
                this.previewSingleImage.display = false;
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            }
        }
    };
</script>

<style lang="scss" scoped>

    .cover-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        z-index: 3000;
        background-color: rgba(0, 0, 0, 0.8);
    }

    .title {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 64px;
        font-size: 20px;
        color: #fff;
        line-height: 64px;
    }

    .image-box {
        width: 100%;
        overflow-x: scroll;
    }

    .el-icon-close {
        position: fixed;
        right: 26px;
        top: 26px;
        padding: 6px;
        font-size: 16px;
        cursor: pointer;
        color: #fff;
        &:hover {
            color: $baseRed;
        }
    }

</style>
