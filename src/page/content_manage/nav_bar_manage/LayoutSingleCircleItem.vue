<!--内容管理-栏目管理-人物专题单个人物圆形组件-->
<template>
    <div class="item-container">
        <div class="ab-center">
            <!--人物专题中的人物的图片-->
            <div class="figure-image">
                <img class="item-image" :src="itemInfo.coverImage? itemInfo.coverImage.uri : '' | imageUrl"
                     :alt="itemInfo.coverImage ? itemInfo.coverImage.name:''"/>
            </div>
            <div class="figure-name">
                {{itemInfo.name}}
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'LayoutSingleCircleItem',
        props: {
            itemInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    div.figure-image {
        border-radius: 50%;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }

    .figure-name {
        margin-top: 8px;
        font-size: 20px;
        color: $baseAsideColor;
    }

</style>
