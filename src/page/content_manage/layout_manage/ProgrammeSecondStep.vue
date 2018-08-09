<!--内容管理-栏目管理-节目选择设置封面组件(含有出格图)，目前只使用在推荐单个节目中-->
<template>
    <div>
        <div class="text-left">1.符合该位置的底层图片如下，请选择：</div>
        <ul>
            <li v-for="(item,index) in specCoverImages" v-bind:key="index">
                <img :src="item.uri | imageUrl" :alt="item.name" @click="displayImage(index)">
                <el-radio v-model="programmeCoverImageId" :label="item.id" @change="setProgrammeCoverImage(index)">
                    {{item.name}}
                </el-radio>
            </li>
        </ul>
        <template v-if="coverImageBackgroundSpec">
            <div class="text-left">2.符合该位置的浮层图片如下，请选择：</div>
            <ul>
                <li v-for="(item,index) in specBackgroundImages" v-bind:key="index">
                    <img :src="item.uri | imageUrl" :alt="item.name" @click="displayBackgroundImage(index)">
                    <el-radio v-model="programmeCoverImageBackgroundId" :label="item.id"
                              @change="setProgrammeCoverImageBackground(index)">
                        {{item.name}}
                    </el-radio>
                </li>
            </ul>
        </template>
        <div class="add-box">
            <el-button type="success" @click="addCover">添加图片</el-button>
        </div>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
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
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';

    export default {
        name: 'ProgrammeSecondStep',
        components: {
            PreviewMultipleImages,
            UploadImage
        },
        props: ['programme', 'originState'],
        computed: {
            specCoverImages() {
                return this.programme.posterImageList.filter(image => parseInt(image.width) === this.coverImageSpec.width && parseInt(image.height) === this.coverImageSpec.height);
            },
            specBackgroundImages() {
                if (this.coverImageBackgroundSpec) {
                    return this.programme.posterImageList.filter(image => parseInt(image.width) === this.coverImageBackgroundSpec.width && parseInt(image.height) === this.coverImageBackgroundSpec.height);
                } else {
                    return [];
                }
            }
        },
        data() {
            return {
                size: [],
                imageUploadDialogVisible: false,
                coverImageSpec: LAYOUT_IMAGE_DIMENSION[this.$route.params.imageSpec].coverImage,
                // 当前模板封面图片的出格背景图的尺寸
                coverImageBackgroundSpec: LAYOUT_IMAGE_DIMENSION[this.$route.params.imageSpec].coverImageBackground,
                // 正常的封面图的id
                programmeCoverImageId: '',
                programmeCoverImageBackgroundId: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.initSize();
                this.programmeCoverImageId = this.originState.coverImage ? this.originState.coverImage.id : '';
                this.programmeCoverImageBackgroundId = this.originState.coverImageBackground ? this.originState.coverImageBackground.id : '';
            },
            initSize() {
                // 初始化当前尺寸的size
                let spec = this.coverImageSpec.width + '*' + this.coverImageSpec.height;
                this.size.push({
                    value: spec,
                    label: '当前底层图片尺寸：' + spec
                });
                if (this.coverImageBackgroundSpec) {
                    let spec = this.coverImageBackgroundSpec.width + '*' + this.coverImageBackgroundSpec.height;
                    this.size.push({
                        value: spec,
                        label: '当前浮层图片尺寸：' + spec
                    });
                }
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.specBackgroundImages;
                this.previewImage.activeIndex = index;
            },
            // 放大背景预览图片
            displayBackgroundImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.specCoverImages;
                this.previewImage.activeIndex = index;
            },
            // 选择正常封面图片
            setProgrammeCoverImage(index) {
                this.$emit('setProgrammeCoverImage', this.specCoverImages[index]);
            },
            // 选择出格背景图
            setProgrammeCoverImageBackground(index) {
                this.$emit('setProgrammeCoverImageBackground', this.specBackgroundImages[index]);
            },
            // 添加节目封面图片
            addCover() {
                this.imageUploadDialogVisible = true;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            addPosterImage(newPosterImage) {
                for (let i = 0; i < this.programme.posterImageList.length; i++) {
                    if (newPosterImage.posterImage.id === this.programme.posterImageList[i].id) {
                        this.$message('该图片已经添加到当前节目封面中');
                        return;
                    }
                }
                let imageList = this.programme.posterImageList.slice();
                imageList.push(newPosterImage.posterImage);
                // 更新当前节目中的封面图片
                this.$service.updatePartProgrammeInfo({
                    id: this.programme.id,
                    programme: {posterImageList: imageList}
                }).then(response => {
                    if (response && response.code === 0) {
                        this.programme.posterImageList.push(newPosterImage.posterImage);
                        // 筛选当前添加的图片的尺寸是底层还是浮层，并选中
                        // 添加为底层
                        if (newPosterImage.posterImage.width === this.coverImageSpec.width && newPosterImage.posterImage.height === this.coverImageSpec.height) {
                            this.programmeCoverImageId = newPosterImage.posterImage.id;
                            this.$emit('setProgrammeCoverImage', newPosterImage.posterImage);
                            // 添加为浮层
                        } else {
                            this.programmeCoverImageBackgroundId = newPosterImage.posterImage.id;
                            this.$emit('setProgrammeCoverImageBackground', newPosterImage.posterImage);
                        }
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    div {
        margin-top: 30px;
        font-size: 20px;
    }

    ul {
        display: flex;
        margin-top: 30px;
        justify-content: left;
        flex-wrap: wrap;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            height: 230px;
            img {
                display: block;
                max-height: 180px;
                max-width: 400px;
                cursor: zoom-in;
            }
            .el-radio {
                font-size: 16px;
            }
        }
    }
</style>
