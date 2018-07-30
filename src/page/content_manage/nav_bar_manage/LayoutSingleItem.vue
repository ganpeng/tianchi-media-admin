<!--内容管理-栏目管理-布局某项（人物、专题、节目、链接等）组件-->
<template>
    <div class="item-container">
        <div class="ab-center">
            <img v-if="itemInfo.coverImage"
                 :src="itemInfo.coverImage ? itemInfo.coverImage.uri : '' | imageUrl"
                 :alt="itemInfo.coverImage ? itemInfo.coverImage.name : ''"/>
        </div>
        <!--左上角标-->
        <span v-if="itemInfo.cornerMark && itemInfo.cornerMark.leftTop"
              class="corner-mark left-top">
            <img :src="itemInfo.cornerMark.leftTop.caption | setPlatformImage"
                 :alt="itemInfo.cornerMark.leftTop.caption">
        </span>
        <!--左下角标-->
        <span v-if="itemInfo.cornerMark && itemInfo.cornerMark.leftBottom"
              class="corner-mark left-bottom">
              {{itemInfo.cornerMark.leftBottom.caption}}
        </span>
        <!--右上角标-->
        <span v-if="itemInfo.cornerMark && itemInfo.cornerMark.rightTop"
              class="corner-mark right-top">
              <img :src="itemInfo.cornerMark.rightTop.imageUri | imageUrl"
                   :alt="itemInfo.cornerMark.rightTop.caption">
        </span>
        <!--右下角标-->
        <span v-if="itemInfo.cornerMark && itemInfo.cornerMark.rightBottom"
              class="corner-mark right-bottom">
            {{itemInfo.cornerMark.rightBottom.caption}}
        </span>
        <!--设置除了频道栏目外的单个推荐位-->
        <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
            <div class="recommend-operate">
                <el-dropdown
                    @command="setRecommend($event,model,row,index,(navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'carousel-2' : 'carousel-1'))"
                    placement="bottom">
                            <span class="el-dropdown-link">
                            <i class="el-icon-edit"></i>
                            </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">设置为专题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </template>
        <!--设置频道的单个推荐位-->
        <template v-else>
            <div class="recommend-operate"
                 @click="appendSingleChannel(model,row,index,(navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'carousel-2' : 'carousel-1'))">
                <i class="el-icon-edit"></i>
            </div>
        </template>
    </div>
</template>

<script>

    export default {
        name: 'LayoutSingleItem',
        props: {
            navBarId: {
                type: String,
                default: ''
            },
            navBarSignCode: {
                type: String,
                default: ''
            },
            model: Number,
            row: Number,
            index: Number,
            itemInfo: {
                type: Object,
                default: function () {
                    return {
                        id: '',
                        layoutItemType: '',
                        name: '',
                        cornerMark: {},
                        coverImage: {}
                    };
                }
            }
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {
            // 设置推荐位为节目或者专题
            setRecommend(val, model, row, index, imageSpec) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'AppendProgramme' : 'AppendSingleSubject',
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        row: row,
                        index: index,
                        imageSpec: imageSpec
                    }
                });
            },
            // 设置单个推荐频道
            appendSingleChannel(model, row, index, imageSpec) {
                this.$router.push({
                    name: 'AppendChannel',
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        row: row,
                        index: index,
                        imageSpec: imageSpec
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .item-container {
        width: 100%;
        height: 100%;
    }

    .ab-center {
        background-color: $dynamicGray;
        img {
            width: 100%;
        }
    }

    .recommend-operate {
        position: absolute;
        right: 60px;
        top: 14px;
        .el-tooltip {
            margin-right: 26px;
        }
        i {
            margin-right: 16px;
            font-size: 24px;
            color: white;
            cursor: pointer;
        }
    }

    // 角标样式
    span.corner-mark {
        position: absolute;
        line-height: 30px;
        background: #5daf34;
        color: #fff;
        font-size: 14px;
        border-radius: 6px;
        img {
            width: 100%;
            height: auto;
        }
    }

    span.left-bottom {
        left: 10px;
        bottom: 10px;
        height: 30px;
        width: 100px;
    }

    span.left-top {
        left: 10px;
        top: 10px;
        background: transparent;
    }

    span.right-top {
        right: 10px;
        top: 10px;
        height: 30px;
        width: 60px;
    }

    span.right-bottom {
        right: 10px;
        bottom: 10px;
        height: 30px;
        width: 60px;
    }

</style>
