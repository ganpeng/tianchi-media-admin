<!--今日推荐组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>今日推荐设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="setting">
            <div id="live">
                <div class="record no-settable"></div>
                <div class="live-channel settable" @click="setChannel">
                    <div class="ab-center">点击设置 / 查看
                        <label>直播频道
                            {{liveChannelList[0] && liveChannelList[0].liveChannel ?
                            liveChannelList[0].liveChannel.name : ''}}</label>
                    </div>
                </div>
                <div class="ad-group settable">
                    <div class="ab-center">
                        <img v-if="rightTopRecommend.coverImage"
                             :src="rightTopRecommend.coverImage ? rightTopRecommend.coverImage.uri : ''"
                             :alt="rightTopRecommend.coverImage ? rightTopRecommend.coverImage.name : ''"/>
                    </div>
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.leftTop"
                          class="corner-mark left-top">
                        <img :src="rightTopRecommend.cornerMark.leftTop.caption | setCopyRightImage"
                             :alt="rightTopRecommend.cornerMark.leftTop.caption">
                    </span>
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.leftBottom"
                          class="corner-mark left-bottom">更新到{{rightTopRecommend.cornerMark.leftBottom.caption}}</span>
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.rightTop"
                          class="corner-mark right-top">
                    <img :src="rightTopRecommend.cornerMark.rightTop.imageUri"
                         :alt="rightTopRecommend.cornerMark.rightTop.caption">
                    </span>
                    <span v-if="rightTopRecommend.cornerMark && rightTopRecommend.cornerMark.rightBottom"
                          class="corner-mark right-bottom">{{rightTopRecommend.cornerMark.rightBottom.caption}}</span>
                    <div class="recommend-operate">
                        <el-dropdown @command="setRecommend($event,0,0,0)" placement="bottom">
                    <span class="el-dropdown-link">
                    <i class="el-icon-circle-plus-outline"></i>
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
                    :pickedCatalogueList="layoutBlockItem.layoutItemMultiList[0]"
                    :blockIndex="blockIndex + 1"
                    categoryName="电视剧"
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
                                <img class="item-image" :src="item.coverImage.uri" :alt="item.coverImage.name"/>
                                <div class="figure-name"
                                     v-if="layoutBlockItem.renderType === 'FIGURE' || rowItem.length === 6">
                                    {{item.name}}
                                </div>
                            </div>
                            <span v-if="item.cornerMark && item.cornerMark.leftTop"
                                  class="corner-mark left-top">
                                 <img :src="item.cornerMark.leftTop.caption | setCopyRightImage"
                                      :alt="item.cornerMark.leftTop.caption">
                             </span>
                            <span v-if="item.cornerMark && item.cornerMark.leftBottom"
                                  class="corner-mark left-bottom">更新到{{item.cornerMark.leftBottom.caption}}</span>
                            <span v-if="item.cornerMark && item.cornerMark.rightTop" class="corner-mark right-top">
                                <img :src="item.cornerMark.rightTop.imageUri"
                                     :alt="item.cornerMark.rightTop.caption">
                                </span>
                            <span v-if="item.cornerMark && item.cornerMark.rightBottom"
                                  class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                            <!--单个位置的设置操作-->
                            <div class="recommend-operate" v-if="!layoutBlockItem.subjectId">
                                <el-dropdown @command="setRecommend($event,blockIndex + 1,rowIndex,index)"
                                             placement="bottom">
                                <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                                  </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                        <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </li>
                        <!--模块推荐操作-->
                        <div class="model-operate" v-if="layoutBlockItem.subjectId">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit" @click="editModel('PROGRAMME')"></i>
                            </el-tooltip>
                            <el-dropdown @command="addModelSubject($event,blockIndex + 1)" placement="bottom">
                        <span class="el-dropdown-link">
                        <i class="el-icon-circle-plus-outline"></i>
                        </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">添加节目专题</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">添加人物专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </ul>
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
                <el-tooltip class="item" effect="dark" content="模块排序" placement="top">
                    <i class="el-icon-sort" @click="sortModel"></i>
                </el-tooltip>
            </div>
        </div>
        <el-button v-if="modified" type="primary" @click="clearModify" class="column-publish">清除修改</el-button>
        <el-button type="primary" @click="publish" class="column-publish">发 布</el-button>
        <el-dialog title="模块排序" :visible.sync="sortDialogVisible">
            <ul v-dragula="{direction:'horizontal'}" id="model-sort-list">
                <li>
                    <el-tag type="success">最新上线大片</el-tag>
                </li>
                <li>
                    <el-tag type="success">热播电视剧</el-tag>
                </li>
                <li>
                    <el-tag type="success">热门人物</el-tag>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
    import SortCatalogue from '../layout_manage/SortCatalogue';
    import copyRightImage from '@/util/config/import_image.js';

    export default {
        name: 'TodayRecommended',
        components: {SortCatalogue},
        data() {
            return {
                navBarName: '今日推荐',
                navBarId: '',
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
                rightTopRecommend: {}
            };
        },
        computed: {
            modified() {
                return this.$store.state.todayRecommend.modified;
            }
        },
        filters: {
            setCopyRightImage(copyRightCaptain) {
                return copyRightImage[copyRightCaptain];
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 获取本地数据展示
                this.layoutInfo = this.$store.getters['todayRecommend/getCurrentState'];
                this.liveChannelList = this.layoutInfo.liveChannelList;
                this.layoutBlockList = this.layoutInfo.layoutBlockList;
                this.layoutBlockFirstLayer = this.layoutBlockList[0];
                this.massLayoutBlockList = this.layoutBlockList.slice();
                this.massLayoutBlockList.shift();
                this.rightTopRecommend = this.layoutBlockFirstLayer ? this.layoutBlockFirstLayer.layoutItemMultiList[0][0] : {};
                this.setNavBarId();
            },
            // 获取当前导航栏的id
            setNavBarId() {
                this.$service.getNavBarList().then(response => {
                    if (response && response.code === 0) {
                        let navBarList = response.data;
                        navBarList.map(navBar => {
                            if (navBar.name === this.navBarName) {
                                this.navBarId = navBar.id;
                                if (!this.layoutInfo.modified) {
                                    // 获取线上布局，展示
                                    this.getOnlionLayoutInfo();
                                }
                            }
                        });
                    }
                });
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
                    if (response && response.code === 0 && response.data.list.length !== 0) {
                        this.liveChannelList = response.data.list;
                        if (++count === 2) {
                            this.setStoreData();
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
                        }
                    }
                });
            },
            setStoreData() {
                // 本地没有更改数据的情况下，将线上数据同步到本地store中
                this.$store.dispatch('todayRecommend/reloadData', {
                    modified: false,
                    liveChannelList: this.liveChannelList,
                    layoutBlockList: this.layoutBlockList
                });
            },
            // 设置直播频道
            setChannel() {
                this.$router.push({name: 'SetChannel', params: {navBarId: this.navBarId}});
            },
            // 设置节目类型推荐
            setCatalogue(pickedCatalogueList, blockIndex) {
                this.$set(this.massLayoutBlockList, blockIndex - 1, pickedCatalogueList);
            },
            // 设置推荐位为节目或者专题
            setRecommend(val, model, row, index) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'AppendProgramme' : 'SingleAppendSubject',
                    params: {model: model, row: row, index: index}
                });
            },
            // 编辑节目模块或者人物模块内容
            editModel(val) {
                this.$router.push({name: val === 'PROGRAMME' ? 'ModelAppendProgrammeSubject' : 'ModelAppendPersonSubject'});
            },
            // 添加模块，设置模块内的专题
            addModelSubject(val, model) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'ModelAppendProgrammeSubject' : 'ModelAppendPersonSubject',
                    params: {model: model}
                });
            },
            // 模块排序
            sortModel() {
                this.sortDialogVisible = true;
            },
            // 恢复state中的数据，清除localStorage中的当前页面数据
            clearModify() {
                this.$confirm('此操作将清除当前页面本地数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('todayRecommend/resumeState').then(response => {
                        if (response === 'success') {
                            this.$message('当前页面修改数据已清除');
                            this.getOnlionLayoutInfo();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消清除'
                    });
                });
            },
            // 点击发布
            publish() {
                this.$confirm('此操作将发布数据到线上, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 设置直播频道
                    let liveChannelList = this.$store.state.todayRecommend.liveChannelList;
                    if (liveChannelList.length !== 0) {
                        this.$service.setLiveChannelLayout(liveChannelList).then(response => {
                            if (response) {
                                this.$wsCache.localStorage.remove('todayRecommend');
                                this.$message({
                                    message: '直播频道设置成功',
                                    type: 'success'
                                });
                            }
                        });
                    }
                    // 设置推荐位布局
                    this.$service.modifyContentLayout({
                        id: this.navBarId,
                        contentLayout: this.$store.state.todayRecommend
                    }).then(response => {
                        if (response && response.code === 0) {
                            this.$message({message: '设置布局成功', type: 'success'});
                            this.$store.dispatch('todayRecommend/resumeState');
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
<style lang="less" scoped>
    #setting {
        margin: 50px 0px;
        padding: 30px 0px;
        background-image: linear-gradient(0deg, #283974 3%, #022c68 35%, #011530 100%);
        width: 100%;
    }

    // 角标样式
    span.corner-mark {
        position: absolute;
        line-height: 30px;
        background: #5daf34;
        color: #fff;
        font-size: 16px;
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
            width: 43%;
            padding-top: 24%;
            font-size: 30px;
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                label {
                    padding-top: 30px;
                    font-size: 34px;
                    font-weight: bold;
                }
            }
        }
        .ad-group {
            position: relative;
            width: 43%;
            padding-top: 24%;
            font-size: 30px;
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
            font-size: 50px;
            color: #ffffff;
            text-align: left;
        }
        ul.model-line {
            display: flex;
            margin-top: 30px;
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
            img {
                border-radius: 50%;
            }
            .figure-name {
                margin-top: 20px;
                font-size: 20px;
                color: #fff;
            }
        }
    }

    .model-operate {
        position: absolute;
        right: 20px;
        top: 18px;
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
        li {
            text-align: left;
            margin-right: 20px;
            cursor: grab;
        }
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
