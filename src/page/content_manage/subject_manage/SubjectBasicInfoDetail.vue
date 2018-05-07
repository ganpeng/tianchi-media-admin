<!--专题基本信息详情组件-->
<template>
    <div>
        <el-form label-position="right" label-width="120px" :model="subjectInfo">
            <el-form-item label="创建人：">
                <label>{{subjectInfo.creator}}</label>
            </el-form-item>
            <el-form-item label="专题名称：">
                <label>{{subjectInfo.name}}</label>
            </el-form-item>
            <el-form-item label="专题简介：">
                <label>{{subjectInfo.description}}</label>
            </el-form-item>
            <el-form-item label="专题节目类别：" v-if="status === '0'">
                <ul class="type-list">
                    <li v-for="(item, index) in subjectInfo.types" :key="index">
                        <el-tag type="success">{{item}}</el-tag>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="专题标签：">
                <ul class="tag-list">
                    <li v-for="(item, index) in subjectInfo.tags" :key="index">
                        <el-tag type="info">{{item}}</el-tag>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item label="是否被推荐：">
                <label>{{subjectInfo.pastPush === true ? '是' : '否'}}</label>
            </el-form-item>
            <el-form-item label="专题封面：">
                <ul class="cover-list">
                    <li v-for="(item,index) in subjectInfo.coverUrls" :key="index">
                        <img :src="item.url" :alt="item.name" @click="displayImage(index)">
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
        props: ['status'],
        data() {
            return {
                subjectInfo: {
                    creator: 'xiaofei.liu',
                    name: '1980s经典港台电影',
                    types: ['电视剧', '电影', '娱乐'],
                    description: '每个人心中都有自己的高分影片，1980-2015。8分以上，1000人以上。[已有200+部] \n' +
                    '多为国产剧，部分港台剧，包含网络剧（如：毛骗，万万没想到，报告老板，灵魂摆渡，暗黑者，匆匆那年，无心法师，上瘾，最好的我们 ，余罪，一起同过窗，画江湖之不良人，鬼吹灯之精绝古城等）。 ',
                    tags: ['爱情', '古装', '奥斯卡'],
                    pastPush: true,
                    coverUrls: [{
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
                    }]
                },
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
                this.previewImage.list = this.subjectInfo.coverUrls;
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
