<!--内容管理-栏目管理-人物模块设置-->
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
            <el-breadcrumb-item>人物模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入人物模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="title"
            clearable>
        </el-input>
        <h3 class="text-left">2.{{mode === 'EDIT' ? '当前推荐的专题' : '请选择要推荐的人物专题'}}：</h3>
        <select-single-subject
            v-show="mode === 'NORMAL'"
            ref="selectSingleSubject"
            mode="FIGURE"
            v-on:resetSubjectInfo='resetSubjectInfo'
            v-on:setSubject="setSubject">
        </select-single-subject>
        <template v-if="mode === 'EDIT'">
            <el-table
                :data="currentSubjectList"
                border
                style="width: 100%">
                <el-table-column
                    prop="code"
                    width="60px"
                    label="编号">
                    <template slot-scope="scope">
                        <label>{{scope.row.code}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="包含节目/人物数">
                    <template slot-scope="scope">
                        <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="简介">
                    <template slot-scope="scope">
                        <label>{{scope.row.description}}</label>
                        <el-popover
                            placement="right"
                            :title="scope.row.name + '简介'"
                            width="250"
                            trigger="hover"
                            :content="scope.row.description">
                            <el-button slot="reference" type="text" class="more">更多</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tagList"
                    label="专题标签">
                    <template slot-scope="scope">
                        <label>{{scope.row.tagList.join(',')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="owner"
                    label="专题创建者">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="节目专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.type ?scope.row.type : '------' }}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' : '已下架'}}
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <h3 class="text-left">3.请对专题中的人物排序：</h3>
        <label v-if="personList.length === 0">暂无选中的人物</label>
        <ul id="person-list" v-else>
            <li v-for="(item, index) in personList" :key="index" :data-id="item.id">
                <img :src="item.avatarImage ? item.avatarImage.uri : '' | imageUrl" :alt="item.name"/>
                <label>{{item.name}}</label>
            </li>
        </ul>
        <div class="text-center save-btn">
            <el-button type="success" @click="switchMode" v-if="mode === 'EDIT'">更换专题</el-button>
            <el-button type="success" @click="saveBlock">保 存</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';

    export default {
        name: 'ModelAppendPersonSubject',
        components: {
            SelectSingleSubject
        },
        data() {
            return {
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                // 当前页面选择人物专题的操作，operate有add && edit
                operate: this.$route.params.operate,
                title: '',
                // 当前选中的专题
                currentSubject: {},
                personList: [],
                recommendSubjectIdList: [],
                // 编辑状态，本地对应的模块推荐位回填信息
                recommendModelInfo: {},
                // 当operate是edit的时候的模式,mode含有'NORMAL'和'EDIT'
                mode: this.$route.params.operate === 'edit' ? 'EDIT' : 'NORMAL',
                // 编辑模式下的当前专题
                currentSubjectList: [],
                saveDisabled: false
            };
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
                if (this.mode === 'EDIT') {
                    this.recommendModelInfo = this.$store.getters['layout/getRecommendModelInfo']({
                        navBarSignCode: this.navBarSignCode,
                        model: this.$route.params.model
                    });
                    this.initCurrentRecommendSubject();
                }
                this.recommendSubjectIdList = this.$store.getters['layout/getRecommendModelSubjectIdList']({
                    navBarSignCode: this.navBarSignCode
                });
                if (this.mode !== 'EDIT') {
                    this.$nextTick(function () {
                        this.$refs.selectSingleSubject.initSubjectList(this.recommendSubjectIdList);
                    });
                }
            },
            // 回填选中的专题数据
            initCurrentRecommendSubject() {
                this.title = this.recommendModelInfo.title;
                this.$service.getSubjectDetail(this.recommendModelInfo.subjectId).then(response => {
                    if (response && response.code === 0) {
                        this.currentSubjectList.push(response.data);
                        this.currentSubject = response.data;
                        this.personList = response.data.subjectItemList;
                        this.initDragula();
                    }
                });
            },
            // 初始化人物列表拖拽
            initDragula() {
                this.$nextTick(function () {
                    this.$dragula([document.getElementById('person-list')], {
                        direction: 'horizontal'
                    });
                });
            },
            // 选择某一个专题
            setSubject(item) {
                this.currentSubject = item;
                this.personList = item.subjectItemList;
                this.initDragula();
            },
            // 重置专题信息
            resetSubjectInfo() {
                this.personList = [];
                this.currentSubject = {};
            },
            // 由'EDIT'模式更换为'NORMAL'模式
            switchMode() {
                this.mode = 'NORMAL';
                this.title = '';
                this.resetSubjectInfo();
                this.$refs.selectSingleSubject.initSubjectList(this.recommendSubjectIdList);
            },
            // 保存信息到store中
            saveBlock() {
                if (this.saveDisabled) {
                    return;
                }
                if (!this.title) {
                    this.$message({
                        message: '请填写模块名称',
                        type: 'warning'
                    });
                    return;
                }
                if (!this.currentSubject.id) {
                    this.$message({
                        message: '请选择专题',
                        type: 'warning'
                    });
                    return;
                }
                let nodes = this.$el.querySelectorAll('#person-list li');
                let subjectLayoutItemList = [];
                for (let i = 0; i < nodes.length; i++) {
                    for (let k = 0; k < this.personList.length; k++) {
                        if (nodes[i].getAttribute('data-id') === this.personList[k].id) {
                            subjectLayoutItemList.push({
                                id: this.personList[k].id,
                                name: this.personList[k].name,
                                coverImage: this.personList[k].avatarImage,
                                layoutItemType: 'FIGURE'
                            });
                        }
                    }
                }
                // 组建人物模块专题对象
                let list = [[]];
                list[0] = subjectLayoutItemList;
                let personModel = {
                    layoutTemplate: 'LT_L',
                    subjectId: this.currentSubject.id,
                    title: this.title,
                    renderType: 'FIGURE',
                    layoutItemMultiList: list
                };
                // 保存到store中
                this.$store.commit('layout/setSubjectLayoutItem', {
                    navBarId: this.navBarId,
                    navBarSignCode: this.navBarSignCode,
                    model: this.$route.params.model,
                    subjectModel: personModel,
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

    #person-list {
        display: flex;
        margin-top: 30px;
        padding: 0 20px 20px 20px;
        justify-content: left;
        flex-wrap: wrap;
        border: 1px dotted gray;
        li {
            display: flex;
            margin-right: 30px;
            margin-top: 20px;
            flex-direction: column;
            justify-content: space-between;
            height: 230px;
            img {
                display: block;
                height: 200px;
                width: 200px;
                border-radius: 180px;
                cursor: grab;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
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
        text-align: center;
        img {
            display: block;
            height: 200px;
            width: 200px;
            border-radius: 180px;
            cursor: grab;
        }
        label {
            text-align: center;
            font-size: 16px;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
