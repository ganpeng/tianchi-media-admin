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
                <div class="ad-group settable" @click="toAdGroup">
                    <div class="ab-center">点击设置 / 查看<label>广告组</label></div>
                </div>
            </div>
            <!--单个推荐位第一行三个-->
            <ul class="recommend-three recommend-line">
                <li class="settable recommend-item"
                    v-for="(item,index) in recommendLayoutList[0].recommendLayoutItemMultiList[0]" :key="index">
                    <div class="ab-center image-box">
                        <img v-if='item.coverImage'
                             :src="item.coverImage ? item.coverImage.uri : ''"
                             :alt="item.coverImage ? item.coverImage.name : ''"/>
                        <div class="recommend-operate">
                            <el-dropdown @command="setRecommend($event,0,0,index)" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <span v-if="item.cornerMark && item.cornerMark.leftTop" class="corner-mark left-top">{{item.cornerMark.leftTop.caption}}</span>
                        <span v-if="item.cornerMark && item.cornerMark.leftBottom" class="corner-mark left-bottom">{{item.cornerMark.leftBottom.caption}}</span>
                        <span v-if="item.cornerMark && item.cornerMark.rightTop" class="corner-mark right-top">
                            <img :src="item.cornerMark.rightTop.imageUri" :alt="item.cornerMark.rightTop.caption">
                        </span>
                        <span v-if="item.cornerMark && item.cornerMark.rightBottom" class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                    </div>
                </li>
            </ul>
            <!--单个推荐位第二行两个-->
            <ul class="recommend-two recommend-line">
                <li class="settable recommend-item"
                    v-for="(item,index) in recommendLayoutList[1].recommendLayoutItemMultiList[0]" :key="index">
                    <div class="ab-center image-box">
                        <img v-if='item.coverImage'
                             :src="item.coverImage ? item.coverImage.uri : ''"
                             :alt="item.coverImage ? item.coverImage.name : ''"/>
                        <div class="recommend-operate">
                            <el-dropdown @command="setRecommend($event,1,0,index)" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="PROGRAMME">设置为节目</el-dropdown-item>
                                    <el-dropdown-item command="PERSON">设置为专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <span v-if="item.cornerMark && item.cornerMark.leftTop" class="corner-mark left-top">{{item.cornerMark.leftTop.caption}}</span>
                        <span v-if="item.cornerMark && item.cornerMark.leftBottom" class="corner-mark left-bottom">{{item.cornerMark.leftBottom.caption}}</span>
                        <span v-if="item.cornerMark && item.cornerMark.rightTop" class="corner-mark right-top">
                            <img :src="item.cornerMark.rightTop.imageUri" :alt="item.cornerMark.rightTop.caption">
                        </span>
                        <span v-if="item.cornerMark && item.cornerMark.rightBottom" class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                    </div>
                </li>
            </ul>
            <!--推荐频道或者节目类型-->
            <sort-catalogue
                :pickedCatalogueList="catalogueList"
                :blockIndex="catalogueBlockIndex"
                categoryName="电视剧"
                v-on:setCatalogue="setCatalogue">
            </sort-catalogue>
            <!--模块推荐位-->
            <ul id="feature-model">
                <li class="feature settable"
                    v-if="blockItem"
                    v-for="(blockItem, blockIndex) in subjectLayoutList"
                    :key="blockIndex">
                    <h3>{{blockItem.title}}</h3>
                    <ul
                        :class="'model-line '+ (blockItem.subjectCategory === 'FIGURE' ? 'model-figure' : 'model-' + rowItem.length)"
                        v-for="(rowItem, rowIndex) in blockItem.subjectLayoutItemMultiList" :key="rowIndex">
                        <li v-for="(item, index) in rowItem" :key="index">
                            <div class="ab-center">
                                <img :src="item.coverImage.uri" :alt="item.coverImage.name"/>
                                <div class="figure-name">{{item.name}}</div>
                            </div>
                            <span v-if="item.cornerMark && item.cornerMark.leftTop" class="corner-mark left-top">{{item.cornerMark.leftTop.caption}}</span>
                            <span v-if="item.cornerMark && item.cornerMark.leftBottom" class="corner-mark left-bottom">{{item.cornerMark.leftBottom.caption}}</span>
                            <span v-if="item.cornerMark && item.cornerMark.rightTop" class="corner-mark right-top">
                            <img :src="item.cornerMark.rightTop.imageUri"
                                 :alt="item.cornerMark.rightTop.caption">
                            </span>
                            <span v-if="item.cornerMark && item.cornerMark.rightBottom"
                                  class="corner-mark right-bottom">{{item.cornerMark.rightBottom.caption}}</span>
                        </li>
                    </ul>
                    <div class="model-operate">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit" @click="editModel('PROGRAMME')"></i>
                        </el-tooltip>
                        <el-dropdown @command="addModelSubject($event,blockIndex)" placement="bottom">
                            <span class="el-dropdown-link">
                                <i class="el-icon-circle-plus-outline"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">添加节目专题</el-dropdown-item>
                                <el-dropdown-item command="PERSON">添加人物专题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
            </ul>
            <div class="append-model">
                <el-dropdown @command="addModelSubject($event,subjectLayoutList.length)" placement="bottom">
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
                // 节目分类模块index
                catalogueBlockIndex: 2,
                // 节目分类
                catalogueList: [{}, {}, {}, {}, {}],
                // 直播频道列表
                liveChannelList: [],
                // 单个推荐位
                recommendLayoutList: [{recommendLayoutItemMultiList: []}, {recommendLayoutItemMultiList: []}],
                // 模块推荐位列表
                subjectLayoutList: []
            };
        },
        computed: {
            modified() {
                return this.$store.state.todayRecommend.modified;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.layoutInfo = this.$store.getters['todayRecommend/getCurrentState'];
                this.liveChannelList = this.layoutInfo.liveChannelList;
                this.recommendLayoutList = this.layoutInfo.recommendLayoutList;
                this.catalogueList = this.recommendLayoutList[2] && this.recommendLayoutList[2].recommendLayoutItemMultiList ? this.recommendLayoutList[2].recommendLayoutItemMultiList[0] : [{}, {}, {}, {}, {}];
                this.subjectLayoutList = this.layoutInfo.subjectLayoutList;
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
                // 推荐位布局
                this.$service.getContentLayout({navBarId: this.navBarId}).then(response => {
                    if (response && response.code === 0) {
                        this.recommendLayoutList = response.data.recommendLayoutList;
                        this.subjectLayoutList = response.data.subjectLayoutList;
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
                    recommendLayoutList: this.recommendLayoutList,
                    subjectLayoutList: this.subjectLayoutList
                }).then(response => {
                    if (response === 'success') {
                        this.$store.dispatch('todayRecommend/setTodayRecommendCache');
                    }
                });
            },
            // 设置直播频道
            setChannel() {
                this.$router.push({name: 'SetChannel', params: {navBarId: this.navBarId}});
            },
            // 跳转到广告组列表页面
            toAdGroup() {
                this.$router.push({name: 'AdGroup'});
            },
            // 设置节目类型推荐
            setCatalogue(pickedCatalogueList) {
                this.catalogueList = pickedCatalogueList;
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
            addModelSubject(val, row) {
                this.$router.push({
                    name: val === 'PROGRAMME' ? 'ModelAppendProgrammeSubject' : 'ModelAppendPersonSubject',
                    params: {row: row}
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
        height: 30px;
        width: 60px;
        line-height: 30px;
        background: #5daf34;
        color: #fff;
        font-size: 16px;
        border-radius: 6px;
    }

    span.left-bottom {
        left: 10px;
        bottom: 10px;
    }

    span.left-top {
        left: 10px;
        top: 10px;
    }

    span.right-top {
        right: 10px;
        top: 10px;
    }

    span.right-bottom {
        right: 10px;
        bottom: 10px;
    }

    // 第一行主推荐
    #live {
        display: flex;
        justify-content: space-between;
        .record {
            width: 11%;
            padding-top: 24%;
        }
        .live-channel, .ad-group {
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
    }

    // 推荐位样式设置
    .recommend-line {
        display: flex;
        margin-top: 20px;
        &.recommend-three {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }

        &.recommend-two {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }
    }

    .recommend-item {
        margin-right: 30px;
        flex-grow: 1;
        &:last-child {
            margin-right: 0px;
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
    }

    // 模块列表
    #feature-model {
        overflow: hidden;
        // 模块通用样式
        .feature {
            position: relative;
            margin-top: 30px;
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
                    img {
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
