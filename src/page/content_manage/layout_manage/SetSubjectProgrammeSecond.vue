<!--内容管理-栏目管理-设置专题内的节目第二步--选择图片组件-->
<template>
    <div>
        <h3 class="text-left">找到以下符合该位置尺寸要求的图片：</h3>
        <ul class="cover-list">
            <li v-for="(item,index) in programme.posterImageList" :key="index">
                <img :src="item.uri" :alt="item.name">
                <el-radio v-model="programmeImageIndex" :label="index" @change="setCoverImage">{{item.name}}</el-radio>
            </li>
            <li @click="addCover">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
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

    export default {
        name: 'SetSubjectProgrammeSecond',
        components: {
            UploadImage
        },
        props: ['programme'],
        data() {
            return {
                size: subjectDimension,
                programmeImageIndex: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                imageUploadDialogVisible: false
            };
        },
        methods: {
            setCoverImage() {
                this.$emit('setCoverImage', this.programme.posterImageList[this.programmeImageIndex]);
            },
            // 添加节目封面图片
            addCover() {
                this.imageUploadDialogVisible = true;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加封面图片
            addPosterImage(newPosterImage) {
                for (let i = 0; i < this.subjectInfo.posterImageList.length; i++) {
                    if (newPosterImage.posterImage.fileId === this.programme.posterImageList[i].fileId) {
                        this.$message('该图片已经添加到当前节目封面中');
                        return;
                    }
                }
                // 更新当前节目中的封面图片
                this.$service.updateProgrammeInfo({
                    id: this.programme.id,
                    programme: this.subjectInfo.posterImageList.splice().push(newPosterImage.posterImage)
                }).then(response => {
                    if (response && response.code === 0) {
                        this.subjectInfo.posterImageList.push(newPosterImage.posterImage);
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
            &:last-child {
                justify-content: center;
                width: 180px;
                height: 180px;
                border: 1px dotted gray;
                text-align: center;
                cursor: pointer;
                &:hover {
                    border: 1px dotted #409EFF;
                    i {
                        color: #409EFF;
                    }
                }
            }
            img {
                display: block;
                height: 180px;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

</style>
