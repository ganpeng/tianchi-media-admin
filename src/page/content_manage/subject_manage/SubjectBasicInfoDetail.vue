<!--专题基本信息详情组件-->
<template>
    <div>
        <el-form label-position="right" label-width="100px" :model="subjectInfo">
            <el-form-item label="创建人：" v-if="subjectInfo.authorName">
                <label>{{subjectInfo.authorName}}</label>
            </el-form-item>
            <el-form-item label="专题名称：">
                <label>{{subjectInfo.name}}</label>
            </el-form-item>
            <el-form-item label="专题状态：">
                <label>{{subjectInfo.visible ? '已上架' :'已下架'}}</label>
            </el-form-item>
            <el-form-item label="专题简介：">
                <label>{{subjectInfo.description}}</label>
            </el-form-item>
            <el-form-item label="节目类别：" v-if="status === '0'">
                <ul class="type-list">
                    <li v-for="(item, index) in subjectInfo.programmeCategoryList" :key="index">
                        <el-tag type="success">{{item.name}}</el-tag>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="专题标签：">
                <ul class="tag-list">
                    <li v-for="(item, index) in subjectInfo.tagList" :key="index">
                        <el-tag type="info">{{item}}</el-tag>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="专题封面：" v-if="subjectInfo.posterImageList && subjectInfo.posterImageList.length > 0">
                <ul class="cover-list">
                    <li v-for="(item,index) in subjectInfo.posterImageList" :key="index">
                        <div :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                             class="image-box"
                             @click="displayImage(index)"></div>
                        <label>{{item.name}}</label>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="专题背景图片：" v-if="subjectInfo.backgroundImage && subjectInfo.backgroundImage.uri">
                <div :style="{ 'background-image': 'url(' + appendImagePrefix(subjectInfo.backgroundImage.uri) + ')'}"
                     class="background-image">
                </div>
            </el-form-item>
        </el-form>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

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

<style lang="less" scoped>

    .type-list, .tag-list {
        display: flex;
        .el-tag {
            margin-right: 20px;
            cursor: auto;
        }
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .cover-list {
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
            .image-box {
                height: 150px;
                width: 150px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                cursor: zoom-in;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

    .background-image {
        width: 40%;
        padding-top: 23%;
        height: 0px;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        border: 1px solid red;
    }

</style>
