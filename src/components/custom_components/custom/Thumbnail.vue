<!--缩略图组件-->
<template>
    <div class="text-center">
        <ul id="image-list">
            <li v-for="(item,index) in imageList" :key="index">
                <div
                    :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                    @click="displayImage(index)">
                </div>
                <label>{{item.width}}*{{item.height}}</label>
                <span
                    v-if="removeSign"
                    @click="removeImage(index,item.id)">
                    删除
                </span>
            </li>
        </ul>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from './PreviewMultipleImages';

    export default {
        name: 'Thumbnail',
        components: {
            PreviewMultipleImages
        },
        props: {
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
                width: 150px;
                height: 100px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                cursor: zoom-in;
            }
            label {
                margin: 10px 0px;
                height: 14px;
                font-size: 12px;
                color: #909399;
            }
            span {
                height: 14px;
                font-size: 12px;
                color: $baseRed;
                cursor: pointer;
                &:hover {
                    color: $deepRed;
                }
            }
        }
    }

</style>
