<!--内容管理-栏目管理-布局某项（人物、专题、节目、链接等）组件-->
<template>
    <div class="item-container">
        <div class="ab-center">
            <img v-if="itemInfo.coverImage"
                 :src="itemInfo.coverImage ? itemInfo.coverImage.uri : '' | imageUrl"
                 :alt="itemInfo.coverImage ? itemInfo.coverImage.name : ''"/>
            <img
                v-if="itemInfo.coverImageBackground && itemInfo.coverImageBackground.uri"
                class="background-image"
                :src="itemInfo.coverImageBackground? itemInfo.coverImageBackground.uri : '' | imageUrl"
                :alt="itemInfo.coverImageBackground ? itemInfo.coverImageBackground.name:''"/>
        </div>
        <!--蒙层-->
        <div class="ab-center mask" v-bind:class="{ visible: maskVisible}" v-if="!isModelItem"></div>
        <!--出格图蒙层-->
        <div class="background-mask" v-bind:class="{ visible: maskVisible}"
             v-if="!isModelItem && itemInfo.coverImageBackground && itemInfo.coverImageBackground.uri"></div>
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
        <template v-if="!isModelItem && navBarSignCode !== 'LIVE_CHANNEL'">
            <el-dropdown
                @visible-change="dropdownMenuChange"
                @command="setRecommend($event,modelIndex,rowIndex,index,rowLength)"
                placement="bottom">
                <span>
                  <i class="el-icon-edit-outline"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                    <el-dropdown-item command="FIGURE">设置为专题</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </template>
        <!--设置频道的单个推荐位-->
        <template v-if="!isModelItem && navBarSignCode === 'LIVE_CHANNEL'">
            <div class="recommend-operate"
                 @click="appendSingleChannel(modelIndex,rowIndex,index,rowLength)">
                <i class="el-icon-edit"></i>
            </div>
        </template>
    </div>
</template>

<script>

    export default {
        name: 'LayoutSingleSquareItem',
        props: {
            navBarId: {
                type: String,
                default: ''
            },
            navBarSignCode: {
                type: String,
                default: ''
            },
            isModelItem: {
                type: Boolean,
                default: false
            },
            rowLength: Number,
            modelIndex: Number,
            rowIndex: Number,
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
            return {
                maskVisible: false
            };
        },
        methods: {
            // hover下拉菜单展示蒙层
            dropdownMenuChange(isVisible) {
                this.maskVisible = isVisible;
            },
            // 设置推荐位为节目或者专题
            setRecommend(val, model, row, index, rowLength) {
                let imageSpec = '';
                if (model === 0 && (this.navBarSignCode === 'RECOMMEND' || this.navBarSignCode === 'LIVE_CHANNEL')) {
                    imageSpec = 'carousel-2';
                } else if (model === 0) {
                    imageSpec = 'carousel-1';
                } else {
                    imageSpec = 'model-' + rowLength;
                }
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
            appendSingleChannel(model, row, index, rowLength) {
                let imageSpec = '';
                if (model === 0 && (this.navBarSignCode === 'RECOMMEND' || this.navBarSignCode === 'LIVE_CHANNEL')) {
                    imageSpec = 'carousel-2';
                } else if (model === 0) {
                    imageSpec = 'carousel-1';
                } else {
                    imageSpec = 'model-' + rowLength;
                }
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
        .mask {
            display: none;
            background-color: rgba(25, 137, 250, 0.7);
            z-index: 200;
            &.visible {
                display: block;
            }
        }
        .background-mask {
            position: absolute;
            display: none;
            width: 100%;
            left: 0px;
            top: -20px;
            height: 20px;
            background-color: rgba(25, 137, 250, 0.7);
            z-index: 200;
            &.visible {
                display: block;
            }
        }
        &:hover {
            .mask, .background-mask {
                display: block;
            }
        }
    }

    .ab-center {
        background-color: $dynamicGray;
        img {
            width: 100%;
            height: 100%;
            &.background-image {
                position: absolute;
                width: 100%;
                height: auto;
                left: 0px;
                top: -20px;
                bottom: 0px;
                right: 0px;
            }
        }
    }

    .el-dropdown, .recommend-operate {
        position: absolute;
        right: 52px;
        top: 5px;
        width: 80px;
        z-index: 300;
        .el-tooltip {
            margin-right: 26px;
        }
        i {
            font-size: 24px;
            color: white;
            cursor: pointer;
        }
    }

    // 角标样式
    span.corner-mark {
        position: absolute;
        z-index: 100;
    }

    // 版权图片标志
    span.left-top {
        left: 10px;
        top: 10px;
        img {
            display: block;
            padding: 5px 8px;
            background: rgba(0, 0, 0, 0.80);
            border-radius: 4px;
        }
    }

    // 更新集数
    span.left-bottom {
        left: 5px;
        bottom: 5px;
        padding: 0px 10px;
        height: 24px;
        line-height: 24px;
        background: rgba(0, 0, 0, 0.80);
        border-radius: 4px;
        font-size: $normalFontSize;
        color: #FFFFFF;
    }

    // 运营图片标志
    span.right-top {
        right: 5px;
        top: 5px;
        height: 24px;
        width: 44px;
        border-radius: 4px;
        overflow: hidden;
        img {
            height: 100%;
        }
    }

    // 评分
    span.right-bottom {
        right: 5px;
        bottom: 5px;
        padding: 0px 10px;
        height: 24px;
        width: 44px;
        line-height: 24px;
        color: $orangeFontColor;
        background: rgba(0, 0, 0, 0.80);
        border-radius: 4px;
        font-size: $normalFontSize;
    }

</style>
