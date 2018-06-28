<!--今日推荐组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item><label class="nav-bar-name">{{navBarName}}</label> 布局设置</el-breadcrumb-item>
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
            <div id="live">
                <div class="record no-settable"
                     v-if="navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL'"></div>
                <div
                    :class="'live-channel settable ' + (navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'small' : 'big')"
                    @click="setChannel">
                    <div class="ab-center">点击设置 / 查看
                        <label>直播频道
                            {{liveChannelList[0] && liveChannelList[0].liveChannel ?
                            liveChannelList[0].liveChannel.name : ''}}</label>
                    </div>
                </div>
                <div
                    :class="'ad-group settable ' + (navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'small' : 'big')">
                    <div class="ab-center">
                        <img v-if="rightTopRecommend.coverImage"
                             :src="rightTopRecommend.coverImage ? rightTopRecommend.coverImage.uri : '' | imageUrl"
                             :alt="rightTopRecommend.coverImage ? rightTopRecommend.coverImage.name : ''"/>
                    </div>
                    <!--左上角标-->
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.leftTop"
                          class="corner-mark left-top">
                        <img :src="rightTopRecommend.cornerMark.leftTop.caption | setPlatformImage"
                             :alt="rightTopRecommend.cornerMark.leftTop.caption">
                    </span>
                    <!--左下角标-->
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.leftBottom"
                          class="corner-mark left-bottom">{{rightTopRecommend.cornerMark.leftBottom.caption}}</span>
                    <!--右上角标-->
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.rightTop"
                          class="corner-mark right-top">
                    <img :src="rightTopRecommend.cornerMark.rightTop.imageUri | imageUrl"
                         :alt="rightTopRecommend.cornerMark.rightTop.caption">
                    </span>
                    <!--右下角标-->
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.rightBottom"
                          class="corner-mark right-bottom">{{rightTopRecommend.cornerMark.rightBottom.caption}}</span>
                    <div class="recommend-operate">
                        <el-dropdown
                            @command="setRecommend($event,0,0,0,(navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'carousel-2' : 'carousel-1'))"
                            placement="bottom">
                    <span class="el-dropdown-link">
                    <i class="el-icon-edit"></i>
                    </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
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
                <!--节目或者人物-->
                <div v-if="layoutBlockItem.renderType === 'PROGRAMME' || layoutBlockItem.renderType === 'FIGURE'"
                     :class="'feature ' + (layoutBlockItem.subjectId ? 'settable' : '')">
                    <h3>{{layoutBlockItem.title}}</h3>
                    <ul
                        v-for="(rowItem, rowIndex) in layoutBlockItem.layoutItemMultiList" :key="rowIndex"
                        :class="'model-line '+ (layoutBlockItem.renderType === 'FIGURE' ? 'model-figure' : 'model-' + rowItem.length)">
                        <li v-for="(item, index) in rowItem" :key="index"
                            :class="!layoutBlockItem.subjectId ? 'settable' : ''">
                            <div class="ab-center">
                                <div class="figure-image" v-if="layoutBlockItem.renderType === 'FIGURE'">
                                    <img class="item-image" :src="item.coverImage? item.coverImage.uri : '' | imageUrl"
                                         :alt="item.coverImage ? item.coverImage.name:''"/>
                                </div>
                                <img v-else class="item-image"
                                     :src="item.coverImage? item.coverImage.uri : '' | imageUrl"
                                     :alt="item.coverImage ? item.coverImage.name:''"/>
                                <div class="figure-name"
                                     v-if="layoutBlockItem.renderType === 'FIGURE' || rowItem.length === 6">
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
                            <!--单个位置的设置操作-->
                            <div class="recommend-operate" v-if="!layoutBlockItem.subjectId">
                                <el-dropdown
                                    @command="setRecommend($event,blockIndex + 1,rowIndex,index,('model-' + rowItem.length))"
                                    placement="bottom">
                                <span class="el-dropdown-link">
                                <i class="el-icon-edit"></i>
                                  </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                        <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </li>
                    </ul>
                    <!--模块推荐操作-->
                    <div class="model-operate" v-if="layoutBlockItem.subjectId">
                        <el-dropdown @command="addModelSubject($event,blockIndex + 1)" placement="bottom">
                            <span class="el-dropdown-link"><i class="el-icon-circle-plus-outline"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">添加节目专题</el-dropdown-item>
                                <el-dropdown-item command="PERSON">添加人物专题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit"
                               @click="editModelSubject(layoutBlockItem.renderType,blockIndex + 1)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete"
                               @click="removeModel(layoutBlockItem.title,blockIndex + 1)"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div class="append-model">
                <el-dropdown @command="addModelSubject($event,layoutBlockList.length)" placement="bottom">
            <span class="el-dropdown-link">
            <i class="el-icon-circle-plus-outline"></i>
            </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME">添加节目模块</el-dropdown-item>
                        <el-dropdown-item command="PERSON">添加人物模块</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tooltip v-if="massLayoutBlockList.length > 1"
                            class="item"
                            effect="dark"
                            content="模块排序"
                            placement="top">
                    <i class="el-icon-sort" @click="sortDialogVisible = true"></i>
                </el-tooltip>
            </div>
        </div>
        <el-button v-if="modified" type="primary" @click="clearModify" class="column-publish">清除修改</el-button>
        <el-button type="primary" @click="publish" class="column-publish">发 布</el-button>
        <el-dialog title="模块专题排序" :visible.sync="sortDialogVisible">
            <ul v-dragula="{direction:'horizontal'}" id="model-sort-list">
                <li v-if="item.subjectId"
                    :data-id="item.subjectId"
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
    import SortCatalogue from '../layout_manage/SortCatalogue';

    export default {
        name: 'NavBarLayoutSetting',
        components: {SortCatalogue},
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
                this.liveChannelList = this.layoutInfo.liveChannelList;
                this.layoutBlockList = this.layoutInfo.layoutBlockList;
                this.layoutBlockFirstLayer = this.layoutBlockList[0];
                this.massLayoutBlockList = this.layoutBlockList.slice();
                this.massLayoutBlockList.shift();
                this.rightTopRecommend = this.layoutBlockFirstLayer ? this.layoutBlockFirstLayer.layoutItemMultiList[0][0] : {};
                this.modified = true;
            },
            // 获取线上的布局,并保存在state中
            getOnlionLayoutInfo() {
                let count = 0;
                // 直播频道
                this.$service.getLiveChannelLayoutList({
                    navBarId: this.navBarId,
                    releaseStatus: 'RELEASED',
                    pageNum: 1,
                    pageSize: 10
                }).then(response => {
                    if (response && response.code === 0) {
                        this.liveChannelList = response.data.list;
                        if (++count === 2) {
                            this.setStoreData();
                            this.modified = false;
                        }
                    }
                });
                // 线上推荐位布局展示
                this.$service.getContentLayout({navBarId: this.navBarId}).then(response => {
                    if (response && response.code === 0) {
                        this.layoutBlockList = response.data.layoutBlockList;
                        this.layoutBlockFirstLayer = this.layoutBlockList[0];
                        this.massLayoutBlockList = this.layoutBlockList.slice();
                        this.massLayoutBlockList.shift();
                        this.rightTopRecommend = this.layoutBlockFirstLayer.layoutItemMultiList[0][0];
                        if (++count === 2) {
                            this.setStoreData();
                            this.modified = false;
                        }
                    }
                });
            },
            setStoreData() {
                // 本地没有更改数据的情况下，将线上数据同步到本地store中
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
            // 设置直播频道
            setChannel() {
                this.$router.push({
                    name: 'SetChannel',
                    params: {navBarSignCode: this.navBarSignCode, navBarId: this.navBarId}
                });
            },
            // 设置节目类型推荐
            setCatalogue(pickedCatalogueList, blockIndex) {
                this.$set(this.massLayoutBlockList, blockIndex - 1, pickedCatalogueList);
                this.modified = true;
            },
            // 设置推荐位为节目或者专题
            setRecommend(val, model, row, index, imageSpec) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'AppendProgramme' : 'SingleAppendSubject',
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
            },
            // 编辑模块，设置模块内的专题
            editModelSubject(val, model) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'ModelAppendProgrammeSubject' : 'ModelAppendPersonSubject',
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        operate: 'edit'
                    }
                });
            },
            // 添加模块，设置模块内的专题
            addModelSubject(val, model) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'ModelAppendProgrammeSubject' : 'ModelAppendPersonSubject',
                    params: {
                        navBarId: this.navBarId,
                        navBarSignCode: this.navBarSignCode,
                        model: model,
                        operate: 'add'
                    }
                });
            },
            // 更新模块排序
            sortModelList() {
                let nodes = this.$el.querySelectorAll('#model-sort-list li');
                let modelSubjectIdList = [];
                for (let i = 0; i < nodes.length; i++) {
                    modelSubjectIdList.push(nodes[i].getAttribute('data-id'));
                }
                this.$store.commit('layout/sortModelList', {
                    navBarId: this.$route.params.navBarId,
                    navBarSignCode: this.$route.params.navBarSignCode,
                    modelSubjectIdList: modelSubjectIdList
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
                    let count = 0;
                    // 设置直播频道
                    let liveChannelList = this.$store.getters['layout/getLiveChannelList']({
                        navBarSignCode: this.navBarSignCode
                    });
                    if (liveChannelList.length !== 0) {
                        this.$service.setLiveChannelLayout(liveChannelList).then(response => {
                            if (response && response.code === 0) {
                                count++;
                                this.$message({
                                    message: '直播频道设置成功',
                                    type: 'success'
                                });
                                if (++count === 2) {
                                    this.modified = false;
                                    this.getOnlionLayoutInfo();
                                }
                            }
                        });
                    } else {
                        count++;
                    }
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
                            if (++count === 2) {
                                this.modified = false;
                                this.getOnlionLayoutInfo();
                            }
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
<style lang="less" scoped>

    .nav-bar-name {
        font-style: italic;
        font-weight: bold;
        font-size: 16px;
    }

    #setting {
        margin: 50px 0px;
        padding: 30px 0px;
        background-image: linear-gradient(0deg, #283974 3%, #022c68 35%, #011530 100%);
        width: 100%;
    }

    #nav-bar-list {
        display: flex;
        margin-bottom: 30px;
        justify-content: space-around;
        li {
            padding: 8px 16px;
            flex-shrink: 1;
            opacity: 0.5;
            font-size: 0.5rem;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
            &.current-nav-bar, &:hover {
                background: orange;
                border-radius: 16px;
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

    // 第一行主推荐
    #live {
        display: flex;
        justify-content: space-between;
        .record {
            width: 11%;
            padding-top: 24%;
        }
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
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                label {
                    padding-top: 1rem;
                    font-size: 1rem;
                    font-weight: bold;
                }
            }
        }
        .ad-group {
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
            img {
                display: block;
                height: 100%;
                width: 100%;
            }
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

    // 模块通用样式
    .feature {
        position: relative;
        margin-top: 30px;
        overflow: hidden;
        h3 {
            font-size: 1.4rem;
            color: #ffffff;
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

    ul.model-figure {
        padding-bottom: 50px;
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
            color: white;
            cursor: pointer;
        }
    }

    .append-model {
        margin-top: 40px;
        padding-left: 40px;
        text-align: left;
        .el-dropdown {
            margin-right: 40px;
        }
        i {
            font-size: 80px;
            color: white;
            cursor: pointer;
        }
    }

    .column-publish {
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

    .image-box {
        overflow: hidden;
        img {
            display: block;
            height: 100%;
            width: 100%;
        }
    }
</style>
