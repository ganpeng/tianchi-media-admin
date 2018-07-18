<!--导航栏布局组件-->
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
                    @click="setViewChannel">
                    <div class="ab-center">点击设置 / 查看
                        <label>直播频道
                            {{liveChannelList[0] && liveChannelList[0].liveChannel ?
                            liveChannelList[0].liveChannel.name : ''}}</label>
                    </div>
                </div>
                <div
                    :class="'first-win settable ' + (navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'small' : 'big')">
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
                    <!--设置除了频道栏目外的单个推荐位-->
                    <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
                        <div class="recommend-operate">
                            <el-dropdown
                                @command="setRecommend($event,0,0,0,(navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'carousel-2' : 'carousel-1'))"
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
                    <!--设置频道的单个推荐位-->
                    <template v-else>
                        <div class="recommend-operate"
                             @click="appendSingleChannel(0,0,0,(navBarSignCode === 'RECOMMEND' || navBarSignCode === 'LIVE_CHANNEL' ? 'carousel-2' : 'carousel-1'))">
                            <i class="el-icon-edit"></i>
                        </div>
                    </template>
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
                <div
                    v-if="judgeModelRenderType(layoutBlockItem.renderType, ['PROGRAMME', 'FIGURE', 'CHANNEL', 'SHUFFLE'])"
                    :class="'feature ' + (layoutBlockItem.subjectId ? 'settable' : '')">
                    <h3>{{layoutBlockItem.title}}</h3>
                    <ul
                        v-for="(rowItem, rowIndex) in layoutBlockItem.layoutItemMultiList" :key="rowIndex"
                        :class="'model-line '+ (rowItem.listClass ? rowItem.listClass : (judgeModelRenderType(layoutBlockItem.renderType, ['FIGURE']) ? 'model-figure' : 'model-' + rowItem.length))">
                        <!--单个节目、人物、专题、频道、网页、节目视频、筛选项-->
                        <li v-for="(item, index) in rowItem" :key="index"
                            :class="!layoutBlockItem.subjectId ? 'settable' : ''">
                            <div class="ab-center">
                                <!--人物专题中的人物的图片-->
                                <div class="figure-image"
                                     v-if="judgeModelRenderType(layoutBlockItem.renderType, ['FIGURE'])">
                                    <img class="item-image" :src="item.coverImage? item.coverImage.uri : '' | imageUrl"
                                         :alt="item.coverImage ? item.coverImage.name:''"/>
                                </div>
                                <!-- 节目、混排中的人物、专题、频道、网页、节目视频、筛选项的封面图片-->
                                <img
                                    v-if="judgeModelRenderType(layoutBlockItem.renderType, ['PROGRAMME', 'CHANNEL', 'SHUFFLE'])"
                                    class="item-image"
                                    :src="item.coverImage? item.coverImage.uri : '' | imageUrl"
                                    :alt="item.coverImage ? item.coverImage.name:''"/>
                                <!-- 节目出格背景图片图片-->
                                <img
                                    v-if="judgeModelRenderType(layoutBlockItem.renderType, ['PROGRAMME']) && item.coverImageBackground && item.coverImageBackground.uri"
                                    class="background-image"
                                    :src="item.coverImageBackground? item.coverImageBackground.uri : '' | imageUrl"
                                    :alt="item.coverImageBackground ? item.coverImageBackground.name:''"/>
                                <div class="figure-name"
                                     v-if="judgeModelRenderType(layoutBlockItem.renderType, ['FIGURE']) || rowItem.length === 6">
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
                                     v-if="!judgeIsModel(layoutBlockItem)">
                                    <el-dropdown
                                        @command="setRecommend($event,blockIndex + 1,rowIndex,index,('model-' + rowItem.length))"
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
                            <template v-if="navBarSignCode === 'LIVE_CHANNEL'">
                                <div v-if="!layoutBlockItem.subjectId"
                                     class="recommend-operate"
                                     @click="appendSingleChannel(blockIndex + 1,rowIndex,index,('model-' + rowItem.length))">
                                    <i class="el-icon-edit"></i>
                                </div>
                            </template>
                        </li>
                    </ul>
                    <!--模块推荐操作-->
                    <div class="model-operate" v-if="judgeIsModel(layoutBlockItem)">
                        <!--除了频道栏目外的设置-->
                        <template v-if="navBarSignCode !== 'LIVE_CHANNEL'">
                            <el-dropdown @command="addModel($event,blockIndex + 1)" placement="bottom">
                                <span class="el-dropdown-link"><i class="el-icon-circle-plus-outline"></i></span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="SHUFFLE">新增混排模块</el-dropdown-item>
                                    <el-dropdown-item command="PROGRAMME">新增节目专题</el-dropdown-item>
                                    <el-dropdown-item command="FIGURE">新增人物专题</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit"
                                   @click="editModel(layoutBlockItem.renderType,blockIndex + 1)"></i>
                            </el-tooltip>
                        </template>
                        <!--频道栏目设置-->
                        <template v-else>
                            <el-tooltip class="item" effect="dark" content="添加" placement="top">
                                <i class="el-icon-circle-plus-outline"
                                   @click="setModelChannel(blockIndex + 1, 'add')"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="el-icon-edit"
                                   @click="setModelChannel(blockIndex + 1, 'edit')"></i>
                            </el-tooltip>
                        </template>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete"
                               @click="removeModel(layoutBlockItem.title,blockIndex + 1)"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <!--底部模块操作-->
            <div class="append-model">
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
        <el-button v-if="modified" type="primary" @click="clearModify" class="column-publish">清除修改</el-button>
        <el-button type="primary" @click="publish" class="column-publish">发 布</el-button>
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
            // 设置直播频道
            setChannel(model, row, index, imageSpec) {
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
<style lang="less" scoped>

    .nav-bar-name {
        font-style: italic;
        font-weight: bold;
        font-size: 16px;
    }

    #setting {
        margin: 30px 0px;
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
        .first-win {
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
