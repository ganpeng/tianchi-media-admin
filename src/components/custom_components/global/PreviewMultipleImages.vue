<!--多张图片预览组件-->
<template>
    <div>
        <el-dialog :visible.sync="previewMultipleImages.display" append-to-body>
            <el-carousel class="text-center"
                         v-if="previewMultipleImages.display"
                         trigger="click"
                         indicator-position="outside"
                         :autoplay='previewMultipleImages.autoplay'
                         :initial-index="previewMultipleImages.activeIndex">
                <el-carousel-item v-for="(item,index) in previewMultipleImages.list" :key="index">
                    <div class="title">{{ item.name }}</div>
                    <div class="image-box"
                         :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"></div>
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'PreviewMultipleImages',
        props: ['previewMultipleImages'],
        data() {
            return {};
        },
        mounted() {
        },
        methods: {
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-carousel {
        height: 360px;
        .el-carousel-item {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            text-align: center;
        }
    }

    .title {
        margin-bottom: 30px;
        font-size: 20px;
    }

    .image-box {
        margin: 30px auto 0px auto;
        height: 200px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

</style>
