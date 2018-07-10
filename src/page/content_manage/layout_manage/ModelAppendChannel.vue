<!--内容管理-栏目管理-频道模块设置-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道页面设置</el-breadcrumb-item>
            <el-breadcrumb-item>频道模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="title"
            clearable>
        </el-input>
        <h3 class="text-left">3.请选择模块板式：</h3>
        <el-select
            v-model="templateType"
            clearable
            placeholder="请选择模块板式"
            @change="setBlockModel">
            <el-option
                v-for="item in templateTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <div class="model-block">
            <ul :class="'model-' + row.length" v-for="(row,rowIndex) in layoutItemList" :key="rowIndex">
                <li v-for="(item,index) in row" :key="index"
                    @click="setModelItem(rowIndex,index,('model-' + row.length),item.layoutItemType === 'ALL',item)">
                    <div class="ab-center text-center">
                        <img :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                             :alt="item.coverImage.name"
                             v-if="item.coverImage && item.coverImage.id">
                    </div>
                </li>
            </ul>
        </div>
        <el-dialog
            title=""
            :visible.sync="setChannelDialogVisible">
            <h3 class="text-left">找到以下符合该位置尺寸要求的图片：</h3>
            <ul class="cover-list">
                <li v-for="(item,index) in specPosterImages" :key="index">
                    <div
                        :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                        class="image-box"
                        @click="displayImage(index)">
                    </div>
                    <el-radio
                        v-model="programmeImageUri"
                        :label="item.uri"
                        @change="setCoverImage">{{item.name}}
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSetChannelDialog">取 消</el-button>
                <el-button type="primary" @click="setChannel">确定</el-button>
            </div>
        </el-dialog>
        <el-button type="primary" @click="innerVisible = true">确定</el-button>
    </div>
</template>

<script>
    import templateType from '@/util/config/template_type';
    import {PROGRAMME_DIMENSION as subjectDimension} from '@/util/config/dimension';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'ModelAppendChannel',
        components: {
            UploadImage,
            PreviewMultipleImages
        },
        data() {
            return {
                //  表格数据
                title: '',
                templateType: '',
                programme: {
                    posterImageList: []
                },
                originState: {
                    coverImage: {
                        uri: ''
                    }
                },
                // 表格数据结束

                templateTypeOptions: templateType.TYPE,
                layoutItemList: [],
                size: subjectDimension,
                programmeImageUri: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                imageUploadDialogVisible: false,
                setChannelDialogVisible: false
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
            setBlockModel() {},
            setModelItem(...args) {
                this.showSetChannelDialog();
            },
            addChannelImage() {},
            setChannel() {
                this.closeSetChannelDialog();
            },
            showSetChannelDialog() {
                this.setChannelDialogVisible = true;
            },
            closeSetChannelDialog() {
                this.setChannelDialogVisible = false;
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
                this.$service.updatePartProgrammeInfo({
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
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-input {
        width: 500px;
    }

    .el-select {
        width: 500px;
    }

    // 根据一行节目数量，确定模块样式
    .model-block {
        ul {
            display: flex;
            margin-top: 30px;
            justify-content: space-between;
            li {
                position: relative;
                margin-right: 30px;
                flex-grow: 1;
                background: #5daf34;
                cursor: pointer;
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .all-tip {
                    font-size: 20px;
                    color: #fff;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
        .model-1 {
            li {
                width: 100%;
                padding-bottom: 12%;
            }
        }

        .model-2 {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }

        .model-3 {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }

        .model-4 {
            li {
                width: 23%;
                padding-top: 13%;
            }
        }

        .model-6 {
            li {
                width: 14%;
                padding-top: 20%;
            }
        }
    }

    // 角标样式
    span.corner-mark {
        position: absolute;
        line-height: 30px;
        background: #5daf34;
        color: #fff;
        font-size: 14px;
        border-radius: 6px;
        text-align: center;
        img {
            width: 100%;
            height: auto;
        }
    }

    span.left-bottom {
        left: 10px;
        bottom: 10px;
        height: 30px;
        width: 100px;
    }

    span.left-top {
        left: 10px;
        top: 10px;
        background: transparent;
    }

    span.right-top {
        right: 10px;
        top: 10px;
        height: 30px;
        width: 60px;
    }

    span.right-bottom {
        right: 10px;
        bottom: 10px;
        height: 30px;
        width: 60px;
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
