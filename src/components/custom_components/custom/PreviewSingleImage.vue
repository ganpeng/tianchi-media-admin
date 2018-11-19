<!--单张图片预览组件-->
<template>
    <div v-if="singleImage.display" class="cover-mask">
        <div class="image-box">
            <div class="title">
                <span>{{singleImage.title}}</span>
            </div>
            <img :src="singleImage.uri | imageUrl">
            <i class="el-icon-close" @click="singleImage.display = false"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PreviewSingleImage',
        props: {
            singleImage: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

    .cover-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        z-index: 3000;
        background-color: transparent;
    }

    .image-box {
        position: relative;
        padding: 0px 120px 45px 120px;
        background: rgba(12, 16, 25, 0.90);
        box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
        border-radius: 8px;
        overflow-x: scroll;
        .title {
            height: 75px;
            line-height: 89px;
            font-size: 14px;
            color: #A8ABB3;
        }
    }

    .el-icon-close {
        position: absolute;
        right: 26px;
        top: 26px;
        padding: 6px;
        font-size: 16px;
        cursor: pointer;
        color: #fff;
        &:hover {
            color: $baseRed;
        }
    }

</style>
