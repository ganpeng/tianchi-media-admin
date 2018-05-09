<!--内容管理-栏目管理-设置专题内的节目第二步--选择图片组件-->
<template>
    <div>
        <h3 class="text-left">找到以下符合该位置尺寸要求的图片：</h3>
        <ul class="cover-list">
            <li v-for="(item,index) in coverUrls" :key="index">
                <img :src="item.url" :alt="item.name">
                <el-radio v-model="programmeImage" :label="item.id">{{item.name}}</el-radio>
            </li>
            <li @click="addCover">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <upload-programme-image-dialog
            title="节目专题封面设置"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-programme-image-dialog>
    </div>
</template>

<script>
    import UploadProgrammeImageDialog from '../../../programme_manage/UploadProgrammeImageDialog';

    export default {
        name: 'SetSubjectProgrammeSecond',
        components: {
            UploadProgrammeImageDialog
        },
        data() {
            return {
                programmeImage: '',
                currentSubject: {},
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
                }],
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
            // 添加节目封面图片
            addCover() {
                this.imageUploadDialogVisible = true;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
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
