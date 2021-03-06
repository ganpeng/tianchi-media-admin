<template>
    <div class="multi-type-file-upload-container">
        <div class="image-list-container">
            <ul class="image-list">
                <li @click.stop="displayImage(image, index)" v-for="(image, index) in adMaterialList" :key="image.id" class="image-item">
                    <div class="image-warpper">
                        <img v-if="image.mediaType === 'IMAGE'" :src="image.storageUri" class="image" alt="">
                        <span v-else @click="displayVideo(image)" class="image video-item" alt="">
                        </span>
                        <div class="mask">
                            <div class="basic-info-wrapper">
                                <span class="dimension">{{image.width}}*{{image.height}}</span>
                                <span class="size">
                                    {{convertFileSize(image.size)}}
                                    {{image.duration ? `${image.duration}s` : ''}}
                                </span>
                            </div>
                            <span v-if="image.mediaType === 'IMAGE' && !isGif(image.name)" class="image-icon">
                                <svg-icon class="image" icon-class="ad_image"></svg-icon>
                            </span>
                            <span v-if="image.mediaType === 'IMAGE' && isGif(image.name)" class="image-icon">
                                <svg-icon class="image" icon-class="ad_gif"></svg-icon>
                            </span>
                        </div>
                        <span v-if="image.mediaType === 'VIDEO'" @click="displayVideo(image)" class="video-icon">
                            <svg-icon icon-class="ad_video" class="video"></svg-icon>
                        </span>
                    </div>
                    <p class="dimension-info my-ellipsis">{{image.name}}</p>
                </li>
            </ul>
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <display-video-dialog
            ref="displayVideoDialog"
            :title="video.title"
            :url="video.url"
            type="video/mp4"
        ></display-video-dialog>
    </div>
</template>
<script>
import PreviewMultipleImages from '../../../components/custom_components/custom/PreviewMultipleImages';
import DisplayVideoDialog from '../../../components/custom_components/custom/DisplayVideoDialog';
export default {
    name: 'WithVideoThumbnail',
    components: { PreviewMultipleImages, DisplayVideoDialog },
    props: {
        adMaterialList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            previewImage: {
                display: false,
                autoplay: false,
                activeIndex: 0,
                list: []
            },
            video: {
                title: '',
                url: ''
            }
        };
    },
    computed: {
        previewImageList() {
            return this.adMaterialList.map((item) => {
                return {
                    id: item.storageId,
                    name: item.name,
                    uri: item.storageUri,
                    width: item.width,
                    height: item.height
                };
            });
        },
        convertFileSize() {
            return (size) => {
                return this.$util.convertFileSize(size);
            };
        },
        isGif() {
            return (name) => {
                return /gif$/.test(name);
            };
        }
    },
    methods: {
        // 放大预览图片
        displayImage(obj, index) {
            if (obj.mediaType === 'IMAGE') {
                this.previewImage.display = true;
                this.previewImage.list = this.previewImageList;
                this.previewImage.activeIndex = index;
            } else {
                this.displayVideo(obj);
            }
        },
        displayVideo(obj) {
            this.video.title = obj.name;
            this.video.url = obj.storageUri;
            this.$refs.displayVideoDialog.showDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.multi-type-file-upload-container {
    float: left;
    margin-right: 10px;
    .image-list {
        display: flex;
        flex-wrap: wrap;
        .image-item {
            position: relative;
            width: 170px;
            cursor: zoom-in;
            margin: 0 20px 20px 0;
            .image-warpper {
                position: relative;
                border: 1px solid #3E495E;
                border-radius: 8px;
                overflow: hidden;
                .image {
                    display: block;
                    width: 100%;
                    height: 100px;
                    border-radius: 8px;
                }
                .video-item {
                    position: relative;
                    .play-btn {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 50px;
                        height: 50px;
                        border-radius: 50px;
                        background: rgba(0,0,0,0.50);
                        i {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-size: 30px;
                            color: #333B4E;
                        }
                        z-index: 150;
                        cursor: pointer;
                    }
                }
                .video-icon {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    cursor: pointer;
                    .svg-icon {
                        width: 30px;
                        height: 30px;
                    }
                }
                .mask {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #293550;
                    opacity: 0.8;
                    border: 1px solid #293550;
                    border-radius: 8px;
                    .basic-info-wrapper {
                        position: absolute;
                        top: 20px;
                        left: 10px;
                        .dimension,
                        .size {
                            display: block;
                            font-size: 12px;
                            color: #fff;
                            text-align: left;
                        }
                    }
                    .image-icon {
                        position: absolute;
                        bottom: 10px;
                        left: 7px;
                        .svg-icon {
                            width: 40px;
                            height: 22px;
                        }
                    }
                }
                &:hover {
                    .mask {
                        display: block;
                    }
                }
            }
            .bg-field {
                position: relative;
                border: 1px solid #3E495E;
                border-radius: 8px;
            }
            .dimension-info {
                margin-top: 10px;
                color: #A8ABB3;
                font-size: 14px;
                line-height: 18px;
                text-align: center;
            }
            .progress-bar {
                position: absolute;
                left: 50%;
                bottom: 0px;
                width: 98%;
                transform: translateX(-50%);
                border-radius: 8px;
            }
            span.delete-icon {
                display: none;
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
                z-index: 1000000;
            }

            &:hover {
                .mask {
                    display: block;
                }
                span.delete-icon {
                    display: block;
                }
            }
        }
        .uploading-image-item {
            border-radius: 8px;
            border: 1px solid #3E495E;
        }
    }
    .uploader {
        width: 170px;
        height: 100px;
        label {
            &:hover {
                border-color: $mainColor;
                .el-icon-plus {
                    color: $mainColor;
                }
            }
        }
    }
}
</style>
