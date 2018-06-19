<!--专题基本信息详情组件-->
<template>
    <div>
        <el-form label-position="right" label-width="120px" :model="subjectInfo">
            <el-form-item label="创建人：" v-if="subjectInfo.authorName">
                <label>{{subjectInfo.authorName}}</label>
            </el-form-item>
            <el-form-item label="专题名称：">
                <label>{{subjectInfo.name}}</label>
            </el-form-item>
            <el-form-item label="专题简介：">
                <label>{{subjectInfo.description}}</label>
            </el-form-item>
            <el-form-item label="专题节目类别：" v-if="status === '0'">
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
            <el-form-item label="专题封面：">
                <ul class="cover-list">
                    <li v-for="(item,index) in subjectInfo.posterImageList" :key="index">
                        <img :src="item.uri | imageUrl" :alt="item.name" @click="displayImage(index)">
                        <label>{{item.name}}</label>
                    </li>
                </ul>
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

    .cover-list {
        display: flex;
        margin-top: 30px;
        justify-content: left;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            height: 230px;
            img {
                display: block;
                height: 180px;
                cursor: zoom-in;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

</style>
