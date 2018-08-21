<!--专题基本信息详情组件-->
<template>
    <div>
        <div class="vice-block" id="basic-info">
            <h3 class="block-vice-title">专题基本信息</h3>
            <el-card>
                <ul>
                    <li><span>专题名称</span><label>{{subjectInfo.name}}</label></li>
                    <li><span>创建人</span><label>{{subjectInfo.authorName}}</label></li>
                    <li><span>专题简介</span><label>{{subjectInfo.description}}</label></li>
                    <li>
                        <span>专题类别</span>
                        <label>
                            <el-tag v-for="(item, index) in subjectInfo.programmeCategoryList"
                                    :key="index"
                                    type="info">
                                {{item.name}}
                            </el-tag>
                        </label>
                    </li>
                    <li>
                        <span>专题标签</span>
                        <label>
                            <el-tag v-for="(item, index) in subjectInfo.tagList"
                                    :key="index"
                                    type="info">
                                {{item}}
                            </el-tag>
                        </label>
                    </li>
                    <li>
                        <span>专题状态</span>
                        <label>
                            <i class="status-normal" v-if="subjectInfo.visible">已上架</i>
                            <i class="status-abnormal" v-else>已下架</i>
                        </label>
                    </li>
                </ul>
            </el-card>
        </div>
        <div class="vice-block" v-if="subjectInfo.posterImageList && subjectInfo.posterImageList.length > 0">
            <h3 class="block-vice-title">专题封面图</h3>
            <ul class="cover-list">
                <li v-for="(item,index) in subjectInfo.posterImageList" :key="index">
                    <div :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                         class="image-box"
                         @click="displayImage(index)"></div>
                    <label>{{item.name}}</label>
                </li>
            </ul>
        </div>
        <div class="vice-block" id="bg-box" v-if="subjectInfo.backgroundImage && subjectInfo.backgroundImage.uri">
            <h3 class="block-vice-title">专题背景图</h3>
            <img :src="subjectInfo.backgroundImage.uri | imageUrl" :alt="subjectInfo.backgroundImage.name">
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';

    export default {
        name: 'SubjectBasicInfoDetail',
        components: {
            PreviewMultipleImages
        },
        // status: '0'对应节目专题； '1'对应人物专题
        props: ['status', 'subjectInfo'],
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
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.subjectInfo.posterImageList;
                this.previewImage.activeIndex = index;
            }
        }
    };
</script>

<style lang="scss" scoped>

    #basic-info {
        .el-card {
            width: 600px;
            ul {
                li {
                    display: flex;
                    margin-bottom: 10px;
                    min-height: 32px;
                    flex-direction: row;
                    justify-content: left;
                    align-items: center;
                    > span {
                        width: 120px;
                        flex-shrink: 0;
                        text-align: center;
                        font-size: $largerFontSize;
                        color: $baseGray;
                    }
                    label {
                        width: 380px;
                        font-size: $normalFontSize;
                        color: #909399;
                        flex-shrink: 0;
                        line-height: 2;
                        .el-tag {
                            border: none;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }

    #bg-box {
        img {
            display: block;
            width: 461px;
            height: 259px;
        }
    }

</style>
