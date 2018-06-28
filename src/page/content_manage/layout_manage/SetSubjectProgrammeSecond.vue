<!--内容管理-栏目管理-设置专题内的节目第二步--选择图片组件-->
<template>
    <div>
        <h3 class="text-left">找到以下符合该位置尺寸要求的图片：</h3>
        <ul class="cover-list">
            <li v-for="(item,index) in specPosterImages" :key="index">
                <div :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                     class="image-box"
                     @click="displayImage(index)"></div>
                <el-radio v-model="programmeImageUri" :label="item.uri" @change="setCoverImage">{{item.name}}
                </el-radio>
            </li>
        </ul>
        <div class="add-box">
            <el-button type="success" @click="addCover">添加图片</el-button>
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <upload-image
            :size='size'
            title="上传节目封面图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import {PROGRAMME_DIMENSION as subjectDimension} from '@/util/config/dimension';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'SetSubjectProgrammeSecond',
        components: {
            UploadImage,
            PreviewMultipleImages
        },
        props: ['programme', 'imageSpec', 'originState'],
        data() {
            return {
                size: subjectDimension,
                programmeImageUri: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                imageUploadDialogVisible: false
            };
        },
        computed: {
            specPosterImages() {
                return this.programme.posterImageList.filter(image => parseInt(image.width) === this.imageSpec.width && parseInt(image.height) === this.imageSpec.height);
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originState.coverImage) {
                    this.programmeImageUri = this.originState.coverImage.uri;
                }
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            setCoverImage() {
                // 根据图片uri设置当前选择的图片
                this.specPosterImages.map(image => {
                    if (image.uri === this.programmeImageUri) {
                        this.$emit('setCoverImage', image);
                    }
                });
            },
            // 添加节目封面图片
            addCover() {
                this.imageUploadDialogVisible = true;
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.specPosterImages;
                this.previewImage.activeIndex = index;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加封面图片
            addPosterImage(newPosterImage) {
                for (let i = 0; i < this.specPosterImages.length; i++) {
                    if (newPosterImage.posterImage.id === this.specPosterImages[i].id) {
                        this.$message('该图片已经添加到当前节目封面中');
                        return;
                    }
                }
                let imageList = this.programme.posterImageList.slice();
                imageList.push(newPosterImage.posterImage);
                // 更新当前节目中的封面图片
                this.$service.updateProgrammeInfo({
                    id: this.programme.id,
                    programme: {posterImageList: imageList}
                }).then(response => {
                    if (response && response.code === 0) {
                        this.programme.posterImageList.push(newPosterImage.posterImage);
                    }
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .cover-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        justify-content: left;
        li {
            display: flex;
            position: relative;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-between;
            height: 230px;
            .image-box {
                height: 150px;
                width: 500px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                cursor: zoom-in;
            }
            img {
                display: block;
                max-height: 180px;
                max-width: 300px;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

</style>
