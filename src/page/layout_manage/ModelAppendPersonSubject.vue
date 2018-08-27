<!--内容管理-栏目管理-人物模块设置-->
<template>
    <div class="text-left">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'栏目管理'},
            {name:currentNavBarInfo.name + '-人物模块设置'}]">
        </custom-breadcrumb>
        <!--人物模块名称-->
        <div class="vice-block">
            <h3 class="block-vice-title">1.请输入人物模块名称：</h3>
            <el-input
                placeholder="请输入人物模块名称，30个字符以内"
                v-model="title"
                clearable>
            </el-input>
        </div>
        <!--选择人物专题-->
        <div class="vice-block">
            <h3 class="block-vice-title">2.{{mode === 'EDIT' ? '当前推荐的专题' : '请选择要推荐的人物专题'}}：</h3>
            <select-single-subject
                v-show="mode === 'NORMAL'"
                ref="selectSingleSubject"
                mode="FIGURE"
                v-on:resetSubjectInfo='resetSubjectInfo'
                v-on:setSubject="setSubject">
            </select-single-subject>
            <template v-if="mode === 'EDIT'">
                <single-subject-table
                    :singleSubjectList="currentSubjectList">
                </single-subject-table>
            </template>
        </div>
        <div class="vice-block">
            <h3 class="block-vice-title">3.请对专题中的人物排序：</h3>
            <label v-if="personList.length === 0">暂无选中的人物</label>
            <el-card v-else>
                <ul id="person-list">
                    <li v-for="(item, index) in personList" :key="index" :data-id="item.id">
                        <img :src="item.avatarImage ? item.avatarImage.uri : '' | imageUrl" :alt="item.name"/>
                        <label>{{item.name}}</label>
                    </li>
                </ul>
            </el-card>
        </div>
        <div class="text-center save-btn">
            <el-button type="primary" @click="switchMode" v-if="mode === 'EDIT'" class="page-main-btn">更换专题</el-button>
            <el-button type="primary" @click="saveBlock" class="page-main-btn">保 存</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import SingleSubjectTable from './SingleSubjectTable';

    export default {
        name: 'ModelAppendPersonSubject',
        components: {
            SelectSingleSubject,
            SingleSubjectTable
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
                        this.$refs.selectSingleSubject.initRecommendIdList(this.recommendSubjectIdList);
                        this.$refs.selectSingleSubject.getSubjectList();
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
                this.$refs.selectSingleSubject.initRecommendIdList(this.recommendSubjectIdList);
                this.$refs.selectSingleSubject.getSubjectList();
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

<style lang="scss" scoped>

    .vice-block {
        margin-top: 60px;
    }

    .el-table {
        margin: 0px;
    }

    .el-input, .el-select {
        width: 500px;
    }

    #person-list {
        display: flex;
        margin-top: 20px;
        justify-content: left;
        flex-wrap: wrap;
        li {
            display: flex;
            margin-right: 30px;
            margin-bottom: 30px;
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
        margin: 120px 0 80px 0;
    }
</style>
