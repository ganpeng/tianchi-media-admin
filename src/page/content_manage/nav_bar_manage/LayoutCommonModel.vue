<!--内容管理-栏目管理-布局普通模块（单个推荐的模块、节目专题、混排）推荐组件-->
<template>
    <div class="model-container">
        <h3>{{layoutModelItemInfo.title}}</h3>
        <ul
            v-for="(rowItem, rowIndex) in layoutModelItemInfo.layoutItemMultiList" :key="rowIndex"
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
                <el-dropdown @command="addModel($event,modelIndex)" placement="bottom">
                    <span class="el-dropdown-link"><i class="el-icon-circle-plus-outline"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="SHUFFLE">新增混排模块</el-dropdown-item>
                        <el-dropdown-item command="PROGRAMME">新增节目专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">新增人物专题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit"
                       @click="editModel(layoutModelItemInfo.renderType,modelIndex)"></i>
                </el-tooltip>
            </template>
            <!--频道栏目设置--添加、编辑-->
            <template v-else>
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <i class="el-icon-circle-plus-outline"
                       @click="setModelChannel(modelIndex, 'add')"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit"
                       @click="setModelChannel(modelIndex, 'edit')"></i>
                </el-tooltip>
            </template>
            <!--模块删除-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="el-icon-delete"
                   @click="removeModel(layoutModelItemInfo.title,modelIndex)"></i>
            </el-tooltip>
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
                    this.displayLocalData();
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
        font-size: 1.4rem;
        color: #283841;
        text-align: left;
    }

    ul.model-line {
        display: flex;
        margin-top: 30px;
        &.model-0 {
            margin-top: 0px;
        }
        li {
            position: relative;
            margin-right: 30px;
            flex-grow: 1;
            background: #8D949C;
            &:last-child {
                margin-right: 0px;
            }
            img.item-image {
                display: block;
                height: 100%;
                width: 100%;
            }
            img.background-image {
                position: absolute;
                width: 100%;
                left: 0px;
                top: -20px;
                bottom: 0px;
                right: 0px;
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

    ul.model-figure {
        padding-bottom: 50px;
        overflow-x: scroll;
        li {
            flex-shrink: 0;
            width: 12%;
            padding-top: 12%;
            border-radius: 50%;
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
                color: #fff;
            }
        }
    }

    .model-operate {
        position: absolute;
        right: 20px;
        top: 0px;
        .el-tooltip {
            margin-right: 30px;
        }
        i {
            margin-right: 20px;
            font-size: 36px;
            color: $baseBlue;
            cursor: pointer;
        }
    }

</style>
