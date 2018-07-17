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
            <ul v-for="(row,rowIndex) in shuffleLayoutItemList" :key="rowIndex" :class="row.listClass">
                <li v-for="(item,index) in row"
                    :key="index">
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
                            @command="setModelItem($event,row.listClass, rowIndex, index, item)"
                            placement="bottom">
                         <span class="el-dropdown-link">
                         <i class="el-icon-edit"></i>
                         </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                <el-dropdown-item command="FIGURE">设置为人物</el-dropdown-item>
                                <el-dropdown-item command="PROGRAMME_SUBJECT">设置为专题</el-dropdown-item>
                                <el-dropdown-item command="CHANNEL">设置为频道</el-dropdown-item>
                                <el-dropdown-item command="WEB_PAGE">设置为网页</el-dropdown-item>
                                <el-dropdown-item command="PROGRAMME_VIDEO">设置为节目内视频</el-dropdown-item>
                                <el-dropdown-item command="FILTER">设置为筛选页面</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <label class="item-type">{{item | setItemDescription}}</label>
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
                :originState="originItemState"
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
                :originState="originItemState"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-figure>
        </el-dialog>
        <!--设置混排的频道-->
        <el-dialog
            title="设置混排模块的频道"
            width="50%"
            center
            :visible.sync="dialogVisible.channelDialogVisible">
            <select-channel
                v-if="dialogVisible.channelDialogVisible"
                :size="imageSpec"
                :currentRow="currentRow"
                :currentIndex="currentIndex"
                :existList="shuffleLayoutItemList"
                v-on:closeSetChannelDialog="closeDialog"
                :successHandler="setShuffleItem">
            </select-channel>
        </el-dialog>
        <!--设置混排的专题-->
        <el-dialog
            title="设置混排模块的专题"
            width="80%"
            center
            :visible.sync="dialogVisible.subjectDialogVisible">
            <set-item-subject
                v-if="dialogVisible.subjectDialogVisible"
                :imageSpec="imageSpec"
                :originState="originItemState"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-subject>
        </el-dialog>
        <!--设置混排的网页-->
        <el-dialog
            title="设置混排模块的网页"
            width="50%"
            center
            :visible.sync="dialogVisible.webPageDialogVisible">
            <set-item-web-page
                v-if="dialogVisible.webPageDialogVisible"
                :imageSpec="imageSpec"
                :originState="originItemState"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-web-page>
        </el-dialog>
        <!--设置混排的节目中的视频-->
        <el-dialog
            title="设置混排模块的节目中的视频"
            width="80%"
            center
            :visible.sync="dialogVisible.programmeVideoDialogVisible">
            <set-item-programme-video
                v-if="dialogVisible.programmeVideoDialogVisible"
                :imageSpec="imageSpec"
                :originState="originItemState"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-programme-video>
        </el-dialog>
        <!--设置混排的筛选推荐项-->
        <el-dialog
            title="设置混排模块的筛选推荐项"
            width="80%"
            center
            :visible.sync="dialogVisible.filterDialogVisible">
            <set-item-filter
                v-if="dialogVisible.filterDialogVisible"
                :imageSpec="imageSpec"
                :originState="originItemState"
                v-on:setShuffleItem="setShuffleItem">
            </set-item-filter>
        </el-dialog>
    </div>
</template>

<script>
    import SetItemProgramme from './shuffle_setting/SetItemProgramme';
    import SetItemFigure from './shuffle_setting/SetItemFigure';
    import SetItemSubject from './shuffle_setting/SetItemSubject';
    import SetItemWebPage from './shuffle_setting/SetItemWebPage';
    import SetItemProgrammeVideo from './shuffle_setting/SetItemProgrammeVideo';
    import SetItemFilter from './shuffle_setting/SetItemFilter';
    import SelectChannel from './SelectChannel';
    import templateTypeInfo from '@/util/config/template_type';
    import {LAYOUT_IMAGE_DIMENSION, PROGRAMME_DIMENSION} from '@/util/config/dimension';
    import _ from 'lodash';

    export default {
        name: 'ModelAppendShuffle',
        components: {
            SetItemProgramme,
            SetItemFigure,
            SetItemSubject,
            SelectChannel,
            SetItemWebPage,
            SetItemProgrammeVideo,
            SetItemFilter
        },
        data() {
            return {
                // 以'_'分割，设置每层的样式高度
                templateHeight: '',
                dialogVisible: {
                    programmeDialogVisible: false,
                    figureDialogVisible: false,
                    channelDialogVisible: false,
                    subjectDialogVisible: false,
                    webPageDialogVisible: false,
                    programmeVideoDialogVisible: false,
                    filterDialogVisible: false
                },
                size: PROGRAMME_DIMENSION,
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                // 当前页面选择人物专题的操作，operate有add && edit
                operate: this.$route.params.operate,
                title: '',
                templateTypeOptions: templateTypeInfo.TYPE,
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
        filters: {
            setItemDescription(item) {
                if (!item.layoutItemType) {
                    return '';
                }
                switch (item.layoutItemType) {
                    case 'PROGRAMME':
                        return '节目详情';
                    case 'PROGRAMME_LIST':
                        return '节目列表';
                    case 'FIGURE':
                        return '人物';
                    case 'PROGRAMME_VIDEO':
                        return '节目中的视频';
                    case 'LINK':
                        return '网页';
                    case 'CHANNEL':
                        return '频道';
                    case 'SUBJECT':
                        return '专题';
                    default:
                        return '筛选项';
                }
            }
        },
        computed: {
            currentNavBarInfo() {
                return this.$store.getters['layout/getNavBarInfo']({
                    navBarId: this.navBarId
                });
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
                this.shuffleLayoutItemList = _.cloneDeep(this.recommendModelInfo.layoutItemMultiList);
                this.templateHeight = this.recommendModelInfo.height;
                // 初始化模板样式
                this.templateType = '';
                for (let i = 0; i < this.shuffleLayoutItemList.length; i++) {
                    this.templateType = this.templateType + '+' + templateTypeInfo.SIZE_TO_INFO[this.shuffleLayoutItemList[i].length + '-' + this.templateHeight.split('_')[i]].name;
                    this.shuffleLayoutItemList[i].listClass = templateTypeInfo.SIZE_TO_INFO[this.shuffleLayoutItemList[i].length + '-' + this.templateHeight.split('_')[i]].style;
                }
                this.templateType = this.templateType.slice(1);
            },
            // 初始化模块板式
            resetModel() {
                this.templateType = '';
                this.shuffleLayoutItemList = [];
            },
            // 选择模块板式，并定义每一层的样式
            setBlockModel() {
                if (!this.templateType) {
                    this.resetModel();
                    return;
                }
                // 初始化模块列表
                this.shuffleLayoutItemList = [];
                this.templateHeight = '';
                for (let k = 0; k < this.templateType.split('+').length; k++) {
                    this.shuffleLayoutItemList[k] = [];
                    this.shuffleLayoutItemList[k].listClass = templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].style;
                    for (let i = 0; i < templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].count; i++) {
                        this.shuffleLayoutItemList[k].push({});
                    }
                    this.templateHeight = this.templateHeight + '_' + templateTypeInfo.NAME_TO_INFO[this.templateType.split('+')[k]].height;
                }
                this.templateHeight = this.templateHeight.slice(1);
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
                this.originItemState = {};
                switch (mode) {
                    // 设置为节目
                    case 'PROGRAMME':
                        this.dialogVisible.programmeDialogVisible = true;
                        if (item.layoutItemType === 'PROGRAMME' || item.layoutItemType === 'PROGRAMME_LIST') {
                            this.originItemState = item;
                        }
                        break;
                    // 设置为人物
                    case 'FIGURE':
                        this.dialogVisible.figureDialogVisible = true;
                        if (item.layoutItemType === 'FIGURE') {
                            this.originItemState = item;
                        }
                        break;
                    // 设置为节目专题
                    case 'PROGRAMME_SUBJECT':
                        this.dialogVisible.subjectDialogVisible = true;
                        if (item.layoutItemType === 'SUBJECT') {
                            this.originItemState = item;
                        }
                        break;
                    // 设置为频道
                    case 'CHANNEL':
                        this.dialogVisible.channelDialogVisible = true;
                        if (item.layoutItemType === 'CHANNEL') {
                            this.originItemState = item;
                        }
                        break;
                    // 设置为网页
                    case 'WEB_PAGE':
                        this.dialogVisible.webPageDialogVisible = true;
                        if (item.layoutItemType === 'LINK') {
                            this.originItemState = item;
                        }
                        break;
                    // 设置为节目中的视频
                    case 'PROGRAMME_VIDEO':
                        this.dialogVisible.programmeVideoDialogVisible = true;
                        if (item.layoutItemType === 'PROGRAMME_VIDEO') {
                            this.originItemState = item;
                        }
                        break;
                    // 设置为筛选页面
                    case 'FILTER':
                        this.dialogVisible.filterDialogVisible = true;
                        if (item.layoutItemType.indexOf('PROGRAMME_CATEGORY') !== -1) {
                            this.originItemState = item;
                        }
                        break;
                    default:
                        break;
                }
                imageModel = imageModel.split('-')[0] + '-' + imageModel.split('-')[1];
                this.imageSpec = LAYOUT_IMAGE_DIMENSION[imageModel].coverImage;
                if (mode === 'CHANNEL') {
                    this.imageSpec = [{
                        value: this.imageSpec.width + '*' + this.imageSpec.height,
                        label: '当前块尺寸：' + this.imageSpec.width + '*' + this.imageSpec.height
                    }];
                }
                this.currentRow = row;
                this.currentIndex = index;
            },
            // 设置混排中某一项内容
            setShuffleItem(item) {
                for (let key in item) {
                    this.shuffleLayoutItemList[this.currentRow][this.currentIndex][key] = item[key];
                }
                this.closeDialog();
            },
            // 关闭弹窗
            closeDialog() {
                for (let key in this.dialogVisible) {
                    this.dialogVisible[key] = false;
                }
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
                let allSetting = true;
                // 检查是否设置完成模块的每一项
                this.shuffleLayoutItemList.map(rowArray => {
                    rowArray.map(programme => {
                        if (!programme.coverImage || !programme.coverImage.id) {
                            allSetting = false;
                        }
                    });
                });
                if (!allSetting) {
                    this.$message({
                        message: '请完整设置模块',
                        type: 'warning'
                    });
                    return;
                }
                // 定义模块布局模式
                let layoutTemplate = 'LT';
                for (let i = 0; i < this.shuffleLayoutItemList.length; i++) {
                    layoutTemplate = layoutTemplate + '_' + this.shuffleLayoutItemList[i].length;
                }
                // 组建混排对象
                let programmeModel = {
                    layoutTemplate: layoutTemplate,
                    height: this.templateHeight,
                    renderType: 'SHUFFLE',
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
                    message: '设置混排模块成功',
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

    .item-type {
        position: absolute;
        width: 100%;
        left: 0px;
        bottom: -30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
