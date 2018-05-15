<!--内容管理-栏目管理-单个推荐位选择专题-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>单个推荐位选择专题</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">请选择要推荐的专题：</h3>
        <select-single-subject
            v-on:selectSubject="selectSubject">
        </select-single-subject>
        <h3 class="text-left">请选择专题的封面海报：</h3>
        <ul class="cover-list">
            <li v-for="(item,index) in coverUrls" :key="index">
                <img :src="item.url" :alt="item.name" @click="displayImage(index)">
                <label>{{item.name}}</label>
            </li>
            <li @click="toAddCover">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'SingleAppendSubject',
        components: {
            SelectSingleSubject,
            PreviewMultipleImages
        },
        data() {
            return {
                currentSubject: {},
                coverUrls: [],
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        methods: {
            // 选择某一个专题
            selectSubject(item) {
                this.currentSubject = item;
                this.coverUrls = [{
                    id: 1,
                    name: '定妆照',
                    url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7'
                }, {
                    id: 2,
                    name: '发布会照片',
                    url: 'http://photocdn.sohu.com/20160107/Img433729049.jpg'
                }, {
                    id: 3,
                    name: '通稿照片',
                    url: 'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg'
                }];
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.coverUrls;
                this.previewImage.activeIndex = index;
            },
            // 到本专题的编辑基本信息页面，添加专题封面
            toAddCover() {
                this.$router.push({
                    name: this.currentSubject.type === '人物' ? 'EditPersonSubject' : 'EditProgrammeSubject',
                    params: {id: this.currentSubject.id}
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
        margin-top: 30px;
        justify-content: left;
        li {
            display: flex;
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
                cursor: zoom-in;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

</style>
