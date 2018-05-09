<!--内容管理-栏目管理-节目选择第二步组件-->
<template>
    <div>
        <div class="text-left">符合该位置的图片如下，请选择：</div>
        <ul>
            <li v-for="(item,index) in imageList" v-bind:key="index">
                <img :src="item.url" :alt="item.name" @click="displayImage(index)">
                <el-radio v-model="programmeImage" :label="item.id">{{item.name}}</el-radio>
            </li>
        </ul>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'ProgrammeSecondStep',
        components: {PreviewMultipleImages},
        data() {
            return {
                programmeImage: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                imageList: [{
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
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.imageList;
                this.previewImage.activeIndex = index;
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
            .el-radio {
                font-size: 16px;
            }
        }
    }
</style>
