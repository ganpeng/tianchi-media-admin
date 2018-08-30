<!--多张图片预览组件-->
<template>
    <div v-if="previewMultipleImages.display" class="cover-mask">
        <div class="title">
            <label>{{previewMultipleImages.activeIndex + 1}}/{{previewMultipleImages.list.length}}</label>
            <span>{{currentImage.name}}</span>
        </div>
        <div class="image-box">
            <img :src="currentImage.uri | imageUrl">
        </div>
        <div class="scroll-btn left">
            <i class="el-icon-arrow-left" @click="scrollImageList('LEFT')"></i>
        </div>
        <div class="scroll-btn right">
            <i class="el-icon-arrow-right" @click="scrollImageList('RIGHT')"></i>
        </div>
        <i class="el-icon-close" @click="closePreview"></i>
    </div>
</template>

<script>
    export default {
        name: 'PreviewMultipleImages',
        props: ['previewMultipleImages'],
        computed: {
            currentImage() {
                return this.previewMultipleImages.list[this.previewMultipleImages.activeIndex];
            }
        },
        methods: {
            scrollImageList(directionSign) {
                switch (directionSign) {
                    case 'LEFT':
                        if (this.previewMultipleImages.activeIndex === 0) {
                            this.previewMultipleImages.activeIndex = this.previewMultipleImages.list.length - 1;
                        } else {
                            this.previewMultipleImages.activeIndex = this.previewMultipleImages.activeIndex - 1;
                        }
                        break;
                    case 'RIGHT':
                        if (this.previewMultipleImages.activeIndex === this.previewMultipleImages.list.length - 1) {
                            this.previewMultipleImages.activeIndex = 0;
                        } else {
                            this.previewMultipleImages.activeIndex = this.previewMultipleImages.activeIndex + 1;
                        }
                        break;
                    default:
                        break;
                }
            },
            closePreview() {
                this.previewMultipleImages.display = false;
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

    .scroll-btn {
        display: block;
        position: fixed;
        bottom: 50%;
        margin-bottom: -25px;
        &.left {
            left: 20px;
        }
        &.right {
            right: 20px;
        }
        i {
            font-size: 50px;
            color: #fff;
            cursor: pointer;
            &:hover {
                color: $baseBlue;
            }
        }
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
