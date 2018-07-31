<!--导航栏布局组件-->
<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{navBarName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="setting">
            <ul id="nav-bar-list">
                <li v-for="(item, index) in navBarList"
                    :key="index"
                    @click="switchNavBar(item.id,item.signCode)"
                    :class="item.id === navBarId ? 'current-nav-bar' : ''">
                    {{item.name}}
                </li>
            </ul>
            <!--布局第一行-->
            <div id="first-view">
                <!--播放历史记录，不可设置-->
                <div class="record"
                     v-if="navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL'">
                </div>
                <!--直播窗口-->
                <div
                    :class="'live-channel settable ' + (navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'small' : 'big')"
                    @click="setViewChannel">
                    <win-live-channel
                        :navBarSignCode="navBarSignCode"
                        :liveChannelList="liveChannelList">
                    </win-live-channel>
                </div>
                <!--首屏右上侧位置-->
                <div
                    :class="'first-right-win settable ' + (navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'small' : 'big')">
                    <layout-single-square-item
                        :navBarId="navBarId"
                        :navBarSignCode="navBarSignCode"
                        :modelIndex="0"
                        :rowIndex="0"
                        :indexIndex="0"
                        :itemInfo="rightTopRecommend">
                    </layout-single-square-item>
                </div>
            </div>
            <!--整个List布局-->
            <div v-for="(layoutBlockItem,blockIndex) in massLayoutBlockList" :key="blockIndex">
                <!--色块-->
                <sort-catalogue
                    v-if="layoutBlockItem.renderType === 'CATALOGUE'"
                    :navBarId="navBarId"
                    :navBarSignCode="navBarSignCode"
                    :pickedCatalogueList="layoutBlockItem.layoutItemMultiList[0]"
                    :blockIndex="blockIndex + 1"
                    :setCatalogueTitle="'设置' + navBarName + '推荐'"
                    v-on:setCatalogue="setCatalogue">
                </sort-catalogue>
                <!--节目、人物、频道、混排-->
                <div v-else :class="'feature ' + (layoutBlockItem.subjectId ? 'settable' : '')">
                    <layout-common-model
                        :navBarId="navBarId"
                        :navBarSignCode="navBarSignCode"
                        :modelIndex="blockIndex + 1"
                        :layoutModelItemInfo="layoutBlockItem">
                    </layout-common-model>
                </div>
            </div>
            <!--底部模块操作-->
            <div class="model-operate">
                <!--除了频道栏目外，添加模块-->
                <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
                    <el-dropdown @command="addModel($event,layoutBlockList.length)" placement="bottom">
                   <span class="el-dropdown-link">
                   <i class="el-icon-circle-plus-outline"></i>
                   </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="SHUFFLE">新增混排模块</el-dropdown-item>
                            <el-dropdown-item command="PROGRAMME">新增节目专题</el-dropdown-item>
                            <el-dropdown-item command="FIGURE">新增人物专题</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <!--频道栏目添加模块-->
                <template v-else>
                    <el-tooltip class="item"
                                effect="dark"
                                content="添加模块频道"
                                placement="top">
                        <i class="el-icon-circle-plus-outline"
                           @click="setModelChannel(layoutBlockList.length, 'add')">
                        </i>
                    </el-tooltip>
                </template>
                <el-tooltip v-if="massLayoutBlockList.length > 1"
                            class="item"
                            effect="dark"
                            content="模块排序"
                            placement="top">
                    <i class="el-icon-sort" @click="initSortModel"></i>
                </el-tooltip>
            </div>
        </div>
        <el-button v-if="modified" type="primary" @click="clearModify" class="column-operate">清除修改</el-button>
        <el-button type="primary" @click="publish" class="column-operate">发 布</el-button>
        <el-dialog title="模块专题排序" :visible.sync="sortDialogVisible">
            <ul v-dragula="{direction:'horizontal'}" id="model-sort-list" v-if="sortDialogVisible">
                <li v-if="item.subjectId || item.renderType === 'SHUFFLE'"
                    :data-sign="item.sign"
                    v-for="(item,index) in massLayoutBlockList"
                    :key="index">
                    {{item.title}}
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
            <el-button @click="sortDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sortModelList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import WinLiveChannel from './WinLiveChannel';
    import LayoutSingleSquareItem from './LayoutSingleSquareItem';
    import LayoutCommonModel from './LayoutCommonModel';
    import SortCatalogue from '../layout_manage/SortCatalogue';

    export default {
        name: 'NavBarLayoutSetting',
        components: {
            WinLiveChannel,
            LayoutSingleSquareItem,
            LayoutCommonModel,
            SortCatalogue
        },
        data() {
            return {
                navBarList: [],
                navBarName: '',
                sortDialogVisible: false,
                // 推荐位布局结构
                layoutInfo: {},
                // 直播频道列表
                liveChannelList: [],
                // 布局模块整体列表
                layoutBlockList: [],
                layoutBlockFirstLayer: {},
                massLayoutBlockList: [],
                // 右上角推荐位
                rightTopRecommend: {},
                modified: false
            };
        },
        computed: {
            navBarId() {
                return this.$route.params.navBarId;
            },
            navBarSignCode() {
                return this.$route.params.navBarSignCode;
            }
        },
        watch: {
            '$route'(to, from) {
                this.init();
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.modified = this.$store.getters['layout/getCurrentLayoutStatus']({
                    navBarSignCode: this.navBarSignCode
                });
                this.navBarName = this.$store.getters['layout/getNavBarInfo']({
                    navBarId: this.navBarId
                }).name;
                this.getNavBarList();
                // 获取本地数据展示
                if (this.modified) {
                    this.displayLocalData();
                } else {
                    this.getOnlionLayoutInfo();
                }
            },
            // 获取当前导航栏的id
            getNavBarList() {
                this.$service.getNavBarList().then(response => {
                    if (response && response.code === 0) {
                        this.navBarList = response.data;
                    }
                });
            },
            // 展示本地数据
            displayLocalData() {
                this.layoutInfo = this.$store.getters['layout/getCurrentLayout']({
                    navBarSignCode: this.navBarSignCode,
                    navBarId: this.navBarId,
                    navBarName: this.navBarName
                });
                this.layoutBlockList = this.layoutInfo.layoutBlockList;
                this.layoutBlockFirstLayer = this.layoutBlockList[0];
                this.massLayoutBlockList = this.layoutBlockList.slice();
                this.massLayoutBlockList.shift();
                // 设置massLayoutBlockList每一项的二维数组中的某个数组的listClass属性
                this.setLayoutListClass(this.massLayoutBlockList);
                this.rightTopRecommend = this.layoutBlockFirstLayer ? this.layoutBlockFirstLayer.layoutItemMultiList[0][0] : {};
                this.modified = true;
            },
            // 获取线上的布局,并保存在state中
            getOnlionLayoutInfo() {
                this.$service.getContentLayout({navBarId: this.navBarId}).then(response => {
                    if (response && response.code === 0) {
                        this.layoutBlockList = response.data.layoutBlockList;
                        this.layoutBlockFirstLayer = this.layoutBlockList[0];
                        this.massLayoutBlockList = this.layoutBlockList.slice();
                        this.massLayoutBlockList.shift();
                        // 设置massLayoutBlockList每一项的二维数组中的某个数组的listClass属性
                        this.setLayoutListClass(this.massLayoutBlockList);
                        this.rightTopRecommend = this.layoutBlockFirstLayer.layoutItemMultiList[0][0];
                        this.setStoreData();
                        this.modified = false;
                    }
                });
            },
            // 设置massLayoutBlockList每一项的二维数组中的某个数组的listClass属性
            setLayoutListClass(layoutBlockList) {
                // 对于每一个model，根据layoutTemplate和height设置相应的每层的listClass样式
                for (let i = 0; i < layoutBlockList.length; i++) {
                    if (layoutBlockList[i].height) {
                        for (let m = 0; m < layoutBlockList[i].layoutItemMultiList.length; m++) {
                            layoutBlockList[i].layoutItemMultiList[m].listClass = 'model-' + layoutBlockList[i].layoutTemplate.split('_')[m + 1] + '-' + layoutBlockList[i].height.split('_')[m];
                        }
                    }
                }
            },
            // 本地没有更改数据的情况下，将线上数据同步到本地store中
            setStoreData() {
                this.$store.commit('layout/setSingleNavBarLayout', {
                    navBarSignCode: this.navBarSignCode,
                    singleNavBarLayout: {
                        modified: false,
                        navBarId: this.navBarId,
                        navBarName: this.navBarName,
                        liveChannelList: this.liveChannelList,
                        layoutBlockList: this.layoutBlockList
                    }
                });
            },
            // 跳转到响应的导航栏布局页面
            switchNavBar(navBarId, navBarSignCode) {
                if (navBarSignCode === 'SEARCH') {
                    return;
                }
                if (navBarId !== this.navBarId) {
                    this.$router.push({
                        name: 'NavBarLayoutSetting',
                        params: {navBarSignCode: navBarSignCode, navBarId: navBarId}
                    });
                }
            },
            setViewChannel() {
                this.$router.push({
                    name: 'AppendViewChannel',
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode
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
            // 设置节目类型推荐
            setCatalogue(pickedCatalogueList, blockIndex) {
                this.$set(this.massLayoutBlockList, blockIndex - 1, pickedCatalogueList);
                this.modified = true;
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
            initSortModel() {
                // 设置标记
                for (let k = 0; k < this.massLayoutBlockList.length; k++) {
                    this.massLayoutBlockList[k].sign = 'sign_' + k;
                }
                this.sortDialogVisible = true;
            },
            // 更新模块排序
            sortModelList() {
                let nodes = this.$el.querySelectorAll('#model-sort-list li');
                let modelSubjectSignList = [];
                for (let i = 0; i < nodes.length; i++) {
                    modelSubjectSignList.push(nodes[i].getAttribute('data-sign'));
                }
                this.$store.commit('layout/sortModelList', {
                    navBarId: this.$route.params.navBarId,
                    navBarSignCode: this.$route.params.navBarSignCode,
                    modelSubjectSignList: modelSubjectSignList,
                    sortList: this.massLayoutBlockList
                });
                this.$message({
                    message: '模块成功排序',
                    type: 'success'
                });
                this.sortDialogVisible = false;
                this.displayLocalData();
                this.modified = true;
            },
            // 恢复state中的数据，清除localStorage中的当前页面数据
            clearModify() {
                this.$confirm('此操作将清除当前页面本地数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getOnlionLayoutInfo();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消清除'
                    });
                });
            },
            // 点击发布
            publish() {
                this.$confirm('此操作将发布设置数据到线上, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 设置推荐位布局
                    this.$service.modifyContentLayout({
                        id: this.navBarId,
                        contentLayout: this.$store.getters['layout/getCurrentLayout']({
                            navBarSignCode: this.navBarSignCode,
                            navBarId: this.navBarId,
                            navBarName: this.navBarName
                        })
                    }).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                message: '设置布局成功',
                                type: 'success'
                            });
                            this.modified = false;
                            this.getOnlionLayoutInfo();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发布'
                    });
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

    .nav-bar-name {
        font-size: 16px;
        color: #606060;
    }

    #setting {
        margin: 30px 0px;
        padding: 30px;
        width: 100%;
        background-color: white;
    }

    // 导航栏列表
    #nav-bar-list {
        display: flex;
        margin-bottom: 30px;
        justify-content: space-around;
        li {
            padding: 8px 16px;
            flex-shrink: 1;
            font-size: 0.5rem;
            color: #1989FA;
            text-align: center;
            cursor: pointer;
            &.current-nav-bar, &:hover {
                border-radius: 16px;
                background: $stillGray;
            }
        }
    }

    // 第一行主推荐
    #first-view {
        display: flex;
        justify-content: space-between;
        // 左侧观看记录
        .record {
            background: $stillGray;
            cursor: not-allowed;
            width: 11%;
            padding-top: 24%;
        }
        // 直播窗口
        .live-channel {
            position: relative;
            font-size: 1rem;
            background-color: #154F8B;
            cursor: pointer;
            &.small {
                width: 43%;
                padding-top: 24%;
            }
            &.big {
                width: 48.5%;
                padding-top: 27%;
            }
        }
        // 右侧设置项
        .first-right-win {
            position: relative;
            width: 43%;
            padding-top: 24%;
            font-size: 30px;
            background-color: #154F8B;
            &.small {
                width: 43%;
                padding-top: 24%;
            }
            &.big {
                width: 48.5%;
                padding-top: 27%;
            }
        }
    }

    // 模块通用样式
    .feature {
        position: relative;
        margin-top: 30px;
        overflow: hidden;
    }

    // 模块操作
    .model-operate {
        margin-top: 40px;
        padding-left: 40px;
        text-align: left;
        .el-dropdown {
            margin-right: 40px;
        }
        i {
            font-size: 80px;
            color: $baseBlue;
            cursor: pointer;
        }
    }

    // 栏目操作按钮
    .column-operate {
        margin-right: 60px;
        margin-bottom: 50px;
        width: 180px;
        height: 60px;
        font-size: 24px;
    }

    // 模块排序列表
    #model-sort-list {
        display: flex;
        padding: 0px 20px 20px 20px;
        border: 1px solid gray;
        flex-wrap: wrap;
        li {
            margin-right: 20px;
            margin-top: 20px;
            padding: 10px 20px;
            background: #008178;
            border-radius: 5px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            cursor: grab;
        }
    }

    /*
    * 设置拖拽效果样式
    */

    .gu-mirror {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        background-color: rgba(0, 0, 0, 0.2);
        transition: opacity 0.4s ease-in-out;
        margin-right: 20px;
        margin-top: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        cursor: grab;
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

</style>
