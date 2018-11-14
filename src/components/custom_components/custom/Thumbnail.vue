<!--缩略图组件-->
<template>
    <div class="text-center">
        <ul id="image-list">
            <li v-for="(item,index) in imageList" :key="index">
                <div
                    :style="{ width: width, height: height, 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                    @click.self="displayImage(index)">
                    <span v-if="removeSign" @click="removeImage(index,item.id)">
                        <svg-icon icon-class="remove_image_hover"></svg-icon>
                        <svg-icon icon-class="remove_image_default"></svg-icon>
                    </span>
                    <i @click.self="displayImage(index)"></i>
                </div>
                <p>
                    <label>{{item.width}}*{{item.height}}</label>
                    <span>{{item | getImageStyleName}}</span>
                </p>
            </li>
        </ul>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from './PreviewMultipleImages';
    import {ALL_IMAGE_DIMENSIONS} from '@/util/config/dimension.js';

    export default {
        name: 'Thumbnail',
        components: {
            PreviewMultipleImages
        },
        props: {
            width: {
                type: String,
                default: '170px'
            },
            height: {
                type: String,
                default: '100px'
            },
            imageList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            removeSign: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        filters: {
            // 获取图片的样式名称
            getImageStyleName: function (image) {
                for (let i = 0; i < ALL_IMAGE_DIMENSIONS.length; i++) {
                    if (image.width === ALL_IMAGE_DIMENSIONS[i].width && image.height === ALL_IMAGE_DIMENSIONS[i].height) {
                        return ALL_IMAGE_DIMENSIONS[i].styleName;
                    }
                }
            }
        },
        created() {
            console.log(ALL_IMAGE_DIMENSIONS);
        },
        methods: {
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            removeImage(index, id) {
                this.$emit('removeImage', index, id);
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.imageList;
                this.previewImage.activeIndex = index;
            }
        }
    };
</script>

<style lang="scss" scoped>

    #image-list {
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 20px;
            div {
                position: relative;
                width: 170px;
                height: 100px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                background-color: #2A3040;
                border: 1px solid #3E495E;
                border-radius: 8px;
                cursor: zoom-in;
                &:hover {
                    span {
                        visibility: visible;
                        .svg-icon-remove_image_hover {
                            display: none;
                        }
                        &:hover {
                            .svg-icon-remove_image_hover {
                                display: inline;
                            }
                            .svg-icon-remove_image_default {
                                display: none;
                            }
                        }
                    }
                    i {
                        visibility: visible;
                    }
                }
                span {
                    visibility: hidden;
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    z-index: 400;
                    cursor: pointer;
                    .svg-icon {
                        width: 23px;
                        height: 23px;
                    }
                }
                i {
                    visibility: hidden;
                    position: absolute;
                    top: 0px;
                    bottom: 0px;
                    left: 0px;
                    right: 0px;
                    z-index: 300;
                    background: rgba(41, 53, 80, 0.80);
                }
            }
            p {
                label, span {
                    margin: 10px 0px;
                    height: 14px;
                    font-size: 12px;
                    color: #6F7480;
                }
            }
        }
    }

</style>
