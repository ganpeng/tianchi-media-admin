<!--内容管理-栏目管理-混排模块设置-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item
                :to="'/nav-bar-manage/layout-setting/' + currentNavBarInfo.signCode + '/' + currentNavBarInfo.id">
                {{currentNavBarInfo.name}}页面设置
            </el-breadcrumb-item>
            <el-breadcrumb-item>混排模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入混排模块名称：</h3>
        <el-input
            placeholder="请输入混排模块名称，30个字符以内"
            v-model="title"
            clearable>
        </el-input>
        <h3 class="text-left">2.请选择模块板式：</h3>
        <el-select v-model="templateType" clearable placeholder="请选择模块板式" @change="setBlockModel">
            <el-option
                v-for="item in templateTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <div class="model-block">
            <ul v-for="(row,rowIndex) in shuffleLayoutItemList" :key="rowIndex">
                <li v-for="(item,index) in row"
                    :key="index"
                    :class="'item-' + item.itemClass">
                    <div class="ab-center text-center">
                        <img :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                             :alt="item.coverImage.name"
                             v-if="item.coverImage && item.coverImage.id">
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
                    <span v-if="item.cornerMark && item.cornerMark.rightTop"
                          class="corner-mark right-top">
                                <img :src="item.cornerMark.rightTop.imageUri | imageUrl"
                                     :alt="item.cornerMark.rightTop.caption">
                                </span>
                    <!--右下角标-->
                    <span v-if="item.cornerMark && item.cornerMark.rightBottom"
                          class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                    <!--编辑或者设置-->
                    <div class="item-operate">
                        <el-dropdown
                            @command="setModelItem($event,'model-' + item.itemClass, rowIndex, index, item)"
                            placement="bottom">
                         <span class="el-dropdown-link">
                         <i class="el-icon-edit"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                <el-dropdown-item command="FIGURE">设置为人物</el-dropdown-item>
                                <el-dropdown-item command="PROGRAMME_SUBJECT">设置为专题</el-dropdown-item>
                                <el-dropdown-item command="CHANNEL">设置为频道</el-dropdown-item>
                                <el-dropdown-item command="WEB">设置为网页</el-dropdown-item>
                                <el-dropdown-item command="VIDEO">设置为节目内视频</el-dropdown-item>
                                <el-dropdown-item command="FILTER">设置为筛选页面</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
            </ul>
        </div>
        <div class="text-center save-btn">
            <el-button type="success" @click="saveBlock">保 存</el-button>
        </div>
        <!--设置混排的节目-->
        <el-dialog
            title="设置混排模块的节目"
            width="80%"
            center
            :visible.sync="dialogVisible.programmeDialogVisible">
            <set-item-programme
                v-if="dialogVisible.programmeDialogVisible"
                :imageSpec="imageSpec"
                :originFigure="originItemState"
                :programmeLayoutItemList="shuffleLayoutItemList"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-programme>
        </el-dialog>
        <!--设置混排的人物-->
        <el-dialog
            title="设置混排模块的人物"
            width="80%"
            center
            :visible.sync="dialogVisible.figureDialogVisible">
            <set-item-figure
                v-if="dialogVisible.figureDialogVisible"
                :imageSpec="imageSpec"
                :originFigure="originItemState"
                :programmeLayoutItemList="shuffleLayoutItemList"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-figure>
        </el-dialog>
    </div>
</template>

<script>
    import SetItemProgramme from './shuffle_setting/SetItemProgramme';
    import SetItemFigure from './shuffle_setting/SetItemFigure';
    import templateType from '@/util/config/template_type';
    import {LAYOUT_IMAGE_DIMENSION, PROGRAMME_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'ModelAppendShuffle',
        components: {
            SetItemProgramme,
            SetItemFigure
        },
        data() {
            return {
                dialogVisible: {
                    programmeDialogVisible: false,
                    figureDialogVisible: false
                },
                size: PROGRAMME_DIMENSION,
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                // 当前页面选择人物专题的操作，operate有add && edit
                operate: this.$route.params.operate,
                title: '',
                templateTypeOptions: templateType.TYPE,
                templateType: '',
                // 布局列表
                shuffleLayoutItemList: [],
                // 当前专题中的节目列表
                programmeList: [],
                // 当前设置节目所在行数
                currentRow: '',
                // 当前设置节目所在某行的index
                currentIndex: '',
                // 当前编辑的item的状态
                originItemState: {},
                // 当前设置的图片的规格大小
                imageSpec: {},
                // 编辑状态，本地对应的模块推荐位回填信息
                recommendModelInfo: {},
                saveDisabled: false
            };
        },
        computed: {
            currentNavBarInfo() {
                return this.$store.getters['layout/getNavBarInfo']({
                    navBarId: this.navBarId
                });
            },
            // 当前选择的板式的最后一行的index
            lastRow() {
                return this.shuffleLayoutItemList.length - 1;
            },
            // 当前选择的板式的最后一行的最后一个item的index
            lastIndex() {
                return this.shuffleLayoutItemList[this.lastRow].length - 1;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 编辑模式下进行回填
                if (this.$route.params.operate === 'edit') {
                    this.recommendModelInfo = this.$store.getters['layout/getRecommendModelInfo']({
                        navBarSignCode: this.navBarSignCode,
                        model: this.$route.params.model
                    });
                    this.initCurrentRecommendSubject();
                }
            },
            // 回填选中的专题数据
            initCurrentRecommendSubject() {
                this.title = this.recommendModelInfo.title;
                this.shuffleLayoutItemList = this.recommendModelInfo.layoutItemMultiList;
                // 初始化模板样式
                this.templateType = '';
                for (let i = 0; i < this.shuffleLayoutItemList.length; i++) {
                    this.templateType = this.templateType + '+' + this.shuffleLayoutItemList[i].length;
                }
                this.templateType = this.templateType.slice(1);
            },
            // 初始化模块板式
            resetModel() {
                this.templateType = '';
                this.shuffleLayoutItemList = [];
            },
            // 选择模块板式
            setBlockModel() {
                if (!this.templateType) {
                    this.resetModel();
                    return;
                }
                // 初始化模块列表
                this.shuffleLayoutItemList = [];
                for (let k = 0; k < this.templateType.split('+').length; k++) {
                    this.shuffleLayoutItemList[k] = [];
                    for (let i = 0; i < templateType.SIZE[this.templateType.split('+')[k]].count; i++) {
                        this.shuffleLayoutItemList[k].push({itemClass: this.templateType.split('+')[k]});
                    }
                }
            },
            /**
             * Set the item of shuffle array
             * @param {String} mode  The content mode of the item
             * @param {String} imageModel  The image mode of the item
             * @param {String} row  The row of shuffle
             * @param {String} index  The index of the row
             * @param {Object} item  The Object of current item
             */
            setModelItem(mode, imageModel, row, index, item) {
                switch (mode) {
                    // 设置为节目
                    case 'PROGRAMME':
                        this.dialogVisible.programmeDialogVisible = true;
                        break;
                    // 设置为人物
                    case 'FIGURE':
                        this.dialogVisible.figureDialogVisible = true;
                        break;
                    // 设置为节目专题
                    case 'PROGRAMME_SUBJECT':
                        break;
                    // 设置为频道
                    case 'CHANNEL':
                        break;
                    // 设置为网页
                    case 'WEB':
                        break;
                    // 设置为节目中的视频
                    case 'VIDEO':
                        break;
                    // 设置为筛选页面
                    case 'FILTER':
                        break;
                    default:
                        break;
                }
                this.imageSpec = LAYOUT_IMAGE_DIMENSION[imageModel].coverImage;
                this.currentRow = row;
                this.currentIndex = index;
                // 初始化本项的数据，用于回填
            },
            // 设置混排中某一项内容，关闭弹窗
            setShuffleItem(item) {
                for (let key in item) {
                    this.shuffleLayoutItemList[this.currentRow][this.currentIndex][key] = item[key];
                }
                this.dialogVisible.programmeDialogVisible = false;
                this.dialogVisible.figureDialogVisible = false;
            },
            getModelCount() {
                let num = 0;
                for (let k = 0; k < this.templateType.split('+').length; k++) {
                    num = num + templateType.SIZE[this.templateType.split('+')[k]].count;
                }
                return num;
            },
            // 保存信息到store中
            saveBlock() {
                if (this.saveDisabled) {
                    return;
                }
                if (!this.title) {
                    this.$message({
                        message: '请填写混排模块名称',
                        type: 'warning'
                    });
                    return;
                }
                let completeItemCount = 0;
                // 检查是否设置完成模块的每一项
                this.shuffleLayoutItemList.map(rowArray => {
                    rowArray.map(programme => {
                        if (programme.coverImage.id) {
                            completeItemCount++;
                        }
                    });
                });
                if (completeItemCount < this.getModelCount()) {
                    this.$message({
                        message: '请完整设置模块',
                        type: 'warning'
                    });
                    return;
                }
                // 定义模块布局模式
                let layoutTemplate = 'LT_' + this.templateType.replace(/\+/g, '_');
                // 组建模块专题对象
                let programmeModel = {
                    layoutTemplate: layoutTemplate,
                    renderType: 'PROGRAMME',
                    title: this.title,
                    layoutItemMultiList: this.shuffleLayoutItemList
                };
                // 保存到store中
                this.$store.commit('layout/setSubjectLayoutItem', {
                    navBarId: this.navBarId,
                    navBarSignCode: this.navBarSignCode,
                    model: this.$route.params.model,
                    subjectModel: programmeModel,
                    operate: this.$route.params.operate
                });
                this.saveDisabled = true;
                this.$message({
                    message: '设置模块专题成功',
                    type: 'success'
                });
                this.$router.push({
                    name: 'NavBarLayoutSetting',
                    params: {
                        navBarSignCode: this.$route.params.navBarSignCode,
                        navBarId: this.$route.params.navBarId
                    }
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-input {
        width: 500px;
    }

    .el-select {
        width: 500px;
    }

    // 根据一行节目数量，确定模块样式
    .model-block {
        ul {
            display: flex;
            margin-top: 30px;
            justify-content: space-between;
            li {
                position: relative;
                margin-right: 30px;
                flex-grow: 1;
                background: #5daf34;
                cursor: pointer;
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .all-tip {
                    font-size: 20px;
                    color: #fff;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
        li.item-1 {
            width: 100%;
            padding-bottom: 12%;
        }

        li.item-2 {
            width: 48%;
            padding-top: 13%;
        }

        li.item-3 {
            width: 31%;
            padding-top: 13%;
        }

        li.item-4 {
            width: 23%;
            padding-top: 13%;
        }

        li.item-6 {
            width: 14%;
            padding-top: 20%;
        }

        li.item-s6 {
            width: 14%;
            padding-top: 8%;
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
        text-align: center;
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

    .item-operate {
        position: absolute;
        right: 40px;
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

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
