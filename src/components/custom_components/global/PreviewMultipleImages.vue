<!--多张图片预览组件-->
<template>
    <div>
        <el-dialog :visible.sync="previewMultipleImages.display">
            <el-carousel class="text-center"
                         v-if="previewMultipleImages.display"
                         trigger="click"
                         indicator-position="outside"
                         :autoplay='previewMultipleImages.autoplay'
                         :initial-index="previewMultipleImages.activeIndex">
                <el-carousel-item v-for="(item,index) in previewMultipleImages.list" :key="index">
                    <span>{{ item.name }}</span>
                    <img :src="item.uri" alt="预览图片">
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
        methods: {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-carousel {
        height: 300px;
        .el-carousel-item {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            text-align: center;
        }
    }

    img {
        display: block;
        margin: 10px auto 0px auto;
        height: 260px;
    }
</style>
