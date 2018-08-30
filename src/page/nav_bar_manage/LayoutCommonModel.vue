<!--内容管理-栏目管理-布局普通模块（单个推荐的模块、节目专题、混排）推荐组件-->
<template>
    <div class="model-container">
        <h3 v-if="layoutModelItemInfo.title">{{layoutModelItemInfo.title}}</h3>
        <ul
            v-for="(rowItem, rowIndex) in layoutModelItemInfo.layoutItemMultiList" :key="rowIndex"
            :style="{paddingTop:(rowIndex === 0  && layoutModelItemInfo.title && !judgeModelRenderType(layoutModelItemInfo.renderType, ['FIGURE'])? '0px': '')}"
            :class="'model-line '+ (rowItem.listClass ? rowItem.listClass : (judgeModelRenderType(layoutModelItemInfo.renderType, ['FIGURE']) ? 'model-figure' : 'model-' + rowItem.length))">
            <li v-for="(item, index) in rowItem" :key="index">
                <!--人物专题中的人物项-->
                <layout-single-circle-item
                    v-if="judgeModelRenderType(layoutModelItemInfo.renderType, ['FIGURE'])"
                    :itemInfo="item">
                </layout-single-circle-item>
                <!--单个节目、单个专题、节目专题和混排中的项-->
                <layout-single-square-item
                    v-else
                    :isModelItem="judgeIsModel(layoutModelItemInfo)"
                    :navBarId="navBarId"
                    :navBarSignCode="navBarSignCode"
                    :rowLength="rowItem.length"
                    :modelIndex="modelIndex"
                    :rowIndex="rowIndex"
                    :index="index"
                    :itemInfo="item">
                </layout-single-square-item>
            </li>
        </ul>
        <!--模块推荐操作-->
        <div class="model-operate" v-if="judgeIsModel(layoutModelItemInfo)">
            <!--除了频道栏目外的设置--添加、编辑-->
            <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
                <el-dropdown
                    @command="addModel($event,modelIndex)"
                    placement="bottom"
                    class="pre-icon-box">
                    <span class="el-dropdown-link">
                        <svg-icon
                            icon-class="add"
                            class-name="svg-box">
                    </svg-icon>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="SHUFFLE">新增混排模块</el-dropdown-item>
                        <el-dropdown-item command="PROGRAMME">新增节目专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">新增人物专题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div @click="editModel(layoutModelItemInfo.renderType,modelIndex)" class="mid-icon-box">
                    <svg-icon
                        icon-class="edit"
                        class-name="svg-box">
                    </svg-icon>
                </div>
            </template>
            <!--频道栏目设置--添加、编辑-->
            <template v-else>
                <div @click="setModelChannel(modelIndex, 'add')" class="pre-icon-box">
                    <svg-icon
                        icon-class="add"
                        class-name="svg-box">
                    </svg-icon>
                </div>
                <div @click="setModelChannel(modelIndex, 'edit')" class="mid-icon-box">
                    <svg-icon
                        icon-class="edit"
                        class-name="svg-box">
                    </svg-icon>
                </div>
            </template>
            <!--模块删除-->
            <div @click="removeModel(layoutModelItemInfo.title,modelIndex)" class="post-icon-box">
                <svg-icon
                    icon-class="remove"
                    class-name="svg-box">
                </svg-icon>
            </div>
        </div>
    </div>
</template>

<script>
    import LayoutSingleSquareItem from './LayoutSingleSquareItem';
    import LayoutSingleCircleItem from './LayoutSingleCircleItem';

    export default {
        name: 'LayoutCommonModel',
        components: {
            LayoutSingleSquareItem,
            LayoutSingleCircleItem
        },
        props: {
            navBarId: {
                type: String,
                default: ''
            },
            navBarSignCode: {
                type: String,
                default: ''
            },
            modelIndex: Number,
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
        methods: {
            /**
             * Judge render type
             * @param {String} renderType  The base render type judged
             * @param {Array} renderTypeArray The render type list
             * @return {Boolean} Is renderType fit to the renderTypeArray
             **/
            judgeModelRenderType(renderType, renderTypeArray) {
                for (let i = 0; i < renderTypeArray.length; i++) {
                    if (renderType === renderTypeArray[i]) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Judge model is a block or just a single recommend item
             * @param {Object} model  The mode of layout
             **/
            judgeIsModel(model) {
                if (model.subjectId || model.renderType === 'SHUFFLE') {
                    return true;
                }
                return false;
            },
            // 添加模块，设置模块内的专题或者混排
            addModel(val, model) {
                let routeName = '';
                switch (val) {
                    case 'PROGRAMME':
                        routeName = 'ModelAppendProgrammeSubject';
                        break;
                    case 'FIGURE':
                        routeName = 'ModelAppendPersonSubject';
                        break;
                    case 'SHUFFLE':
                        routeName = 'ModelAppendShuffle';
                        break;
                    default:
                        break;
                }
                this.$router.push({
                    name: routeName,
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        operate: 'add'
                    }
                });
            },
            // 编辑模块，设置模块内的专题或者混排
            editModel(val, model) {
                let routeName = '';
                switch (val) {
                    case 'PROGRAMME':
                        routeName = 'ModelAppendProgrammeSubject';
                        break;
                    case 'FIGURE':
                        routeName = 'ModelAppendPersonSubject';
                        break;
                    case 'SHUFFLE':
                        routeName = 'ModelAppendShuffle';
                        break;
                    default:
                        break;
                }
                this.$router.push({
                    name: routeName,
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        operate: 'edit'
                    }
                });
            },
            // 添加模块推荐频道
            setModelChannel(model, operate) {
                this.$router.push({
                    name: 'ModelAppendChannel',
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        operate: operate
                    }
                });
            },
            // 删除某一个模块专题
            removeModel(title, model) {
                this.$confirm('此操作将删除' + title + '模块专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('layout/removeModel', {
                        navBarSignCode: this.navBarSignCode,
                        model: model
                    });
                    this.$emit('displayLocalData');
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
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

    // 模块通用样式
    h3 {
        padding-top: 30px;
        padding-bottom: 16px;
        color: $baseAsideColor;
        text-align: left;
    }

    ul.model-line {
        display: flex;
        padding-top: 30px;
        flex-grow: 1;
        flex-shrink: 0;
        justify-content: space-between;
        overflow: hidden;
        &.model-0 {
            margin-top: 0px;
        }
        li {
            position: relative;
            margin-right: 24px;
            flex-grow: 1;
            background: #8D949C;
            &:last-child {
                margin-right: 0px;
            }
        }
    }

    // 每行的样式
    ul.model-1 {
        li {
            width: 100%;
            padding-top: 12%;
        }
    }

    ul.model-2 {
        li {
            width: 48%;
            padding-top: 13%;
        }
    }

    ul.model-3 {
        li {
            width: 31%;
            padding-top: 13%;
        }
    }

    ul.model-4 {
        li {
            width: 23%;
            padding-top: 13%;
        }
    }

    ul.model-6 {
        li {
            width: 14%;
            padding-top: 20%;
        }
    }

    ul.model-1-200 {
        li {
            width: 100%;
            padding-bottom: 12%;
        }
    }

    ul.model-2-225 {
        li {
            width: 48%;
            padding-top: 13%;
        }
    }

    ul.model-3-225 {
        li {
            width: 31%;
            padding-top: 13%;
        }
    }

    ul.model-4-225 {
        li {
            width: 23%;
            padding-top: 13%;
        }
    }

    ul.model-6-350 {
        li {
            width: 14%;
            padding-top: 20%;
        }
    }

    ul.model-6-134 {
        li {
            width: 14%;
            padding-top: 8%;
        }
    }

    /* 人物专题 */
    ul.model-figure {
        padding-bottom: 30px;
        padding-top: 10px;
        overflow-x: scroll;
        li {
            flex-shrink: 0;
            width: 12%;
            padding-top: 12%;
            margin-right: 2.66%;
            border-radius: 50%;
        }
    }

    .model-operate {
        position: absolute;
        right: 0px;
        top: 24px;
        width: 150px;
        height: 40px;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-dropdown:not(.pre-icon-box) {
            position: absolute;
            top: 5px;
            left: -10px;
            width: 80px;
        }
        .pre-icon-box {
            position: absolute;
            top: 6px;
            left: 15px;
        }
        .mid-icon-box {
            position: absolute;
            top: 6px;
            left: 65px;
        }
        .post-icon-box {
            position: absolute;
            top: 6px;
            left: 110px;
        }
        .svg-box {
            height: 26px !important;
            width: 26px !important;
            fill: $lightBlue;
            cursor: pointer;
            &:hover {
                fill: $baseBlue;
            }
        }
    }

</style>
