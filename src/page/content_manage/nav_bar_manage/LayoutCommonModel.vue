<!--内容管理-栏目管理-布局普通模块（节目专题、混排）推荐组件-->
<template>
    <div class="model-container">
        <h3>{{layoutModelItemInfo.title}}</h3>
        <ul
            v-for="(rowItem, rowIndex) in layoutModelItemInfo.layoutItemMultiList" :key="rowIndex"
            :class="'model-line '+ (rowItem.listClass ? rowItem.listClass : (judgeModelRenderType(layoutModelItemInfo.renderType, ['FIGURE']) ? 'model-figure' : 'model-' + rowItem.length))">
            <!--单个节目、人物、专题、频道、网页、节目视频、筛选项-->
            <li v-for="(item, index) in rowItem" :key="index"
                :class="!layoutModelItemInfo.subjectId ? 'settable' : ''">
                <div class="ab-center">
                    <!--人物专题中的人物的图片-->
                    <div class="figure-image"
                         v-if="judgeModelRenderType(layoutModelItemInfo.renderType, ['FIGURE'])">
                        <img class="item-image" :src="item.coverImage? item.coverImage.uri : '' | imageUrl"
                             :alt="item.coverImage ? item.coverImage.name:''"/>
                    </div>
                    <!-- 节目、混排中的人物、专题、频道、网页、节目视频、筛选项的封面图片-->
                    <img
                        v-if="judgeModelRenderType(layoutModelItemInfo.renderType, ['PROGRAMME', 'CHANNEL', 'SHUFFLE'])"
                        class="item-image"
                        :src="item.coverImage? item.coverImage.uri : '' | imageUrl"
                        :alt="item.coverImage ? item.coverImage.name:''"/>
                    <!-- 节目出格背景图片图片-->
                    <img
                        v-if="judgeModelRenderType(layoutModelItemInfo.renderType, ['PROGRAMME']) && item.coverImageBackground && item.coverImageBackground.uri"
                        class="background-image"
                        :src="item.coverImageBackground? item.coverImageBackground.uri : '' | imageUrl"
                        :alt="item.coverImageBackground ? item.coverImageBackground.name:''"/>
                    <!--人物的名称-->
                    <div class="figure-name"
                         v-if="judgeModelRenderType(layoutModelItemInfo.renderType, ['FIGURE']) || rowItem.length === 6">
                        {{item.name}}
                    </div>
                </div>
                <!--左上角标-->
                <span v-if="item.cornerMark && item.cornerMark.leftTop"
                      class="corner-mark left-top">
                                 <img :src="item.cornerMark.leftTop.caption | setPlatformImage"
                                      :alt="item.cornerMark.leftTop.caption">
                             </span>
                <!--左下角标-->
                <span v-if="item.cornerMark && item.cornerMark.leftBottom"
                      class="corner-mark left-bottom">{{item.cornerMark.leftBottom.caption}}</span>
                <!--右上角标-->
                <span v-if="item.cornerMark && item.cornerMark.rightTop" class="corner-mark right-top">
                                <img :src="item.cornerMark.rightTop.imageUri | imageUrl"
                                     :alt="item.cornerMark.rightTop.caption">
                                </span>
                <!--右下角标-->
                <span v-if="item.cornerMark && item.cornerMark.rightBottom"
                      class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                <!--除了频道栏目，单个位置的设置操作-->
                <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
                    <div class="recommend-operate"
                         v-if="!judgeIsModel(layoutModelItemInfo)">
                        <el-dropdown
                            @command="setRecommend($event,model,rowIndex,index,('model-' + rowItem.length))"
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
                <!--频道栏目设置单个推荐位-->
                <template v-else>
                    <div v-if="!layoutModelItemInfo.subjectId"
                         class="recommend-operate"
                         @click="appendSingleChannel(model,rowIndex,index,('model-' + rowItem.length))">
                        <i class="el-icon-edit"></i>
                    </div>
                </template>
            </li>
        </ul>
        <!--模块推荐操作-->
        <div class="model-operate" v-if="judgeIsModel(layoutModelItemInfo)">
            <!--除了频道栏目外的设置--添加、编辑-->
            <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
                <el-dropdown @command="addModel($event,model)" placement="bottom">
                    <span class="el-dropdown-link"><i class="el-icon-circle-plus-outline"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="SHUFFLE">新增混排模块</el-dropdown-item>
                        <el-dropdown-item command="PROGRAMME">新增节目专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">新增人物专题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit"
                       @click="editModel(layoutModelItemInfo.renderType,model)"></i>
                </el-tooltip>
            </template>
            <!--频道栏目设置--添加、编辑-->
            <template v-else>
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <i class="el-icon-circle-plus-outline"
                       @click="setModelChannel(model, 'add')"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit"
                       @click="setModelChannel(model, 'edit')"></i>
                </el-tooltip>
            </template>
            <!--模块删除-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="el-icon-delete"
                   @click="removeModel(layoutModelItemInfo.title,model)"></i>
            </el-tooltip>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'LayoutCommonModel',
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
            layoutModelItemInfo: {
                type: Object,
                default: function () {
                    return {};
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

    .model-container {
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
