<!--内容管理-栏目管理-节目选择组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item
                :to="'/nav-bar-manage/layout-setting/' + currentNavBarInfo.signCode + '/' + currentNavBarInfo.id">
                {{currentNavBarInfo.name}}页面设置
            </el-breadcrumb-item>
            <el-breadcrumb-item>节目选择</el-breadcrumb-item>
        </el-breadcrumb>
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="选择节目资源"></el-step>
            <el-step title="步骤2" description="选择节目图片"></el-step>
            <el-step title="步骤3" description="设置节目角标"></el-step>
        </el-steps>
        <keep-alive>
            <component v-show="mode !== 'EDIT' || activeStep !== 0"
                       :is="currentView"
                       :selectedProgrammeList="selectedProgrammeList"
                       ref="currentComponent"
                       model="SINGLE"
                       v-on:setProgramme="setProgramme"
                       v-on:setPosterImage="setPosterImage"
                       v-on:setCornerMarks="setCornerMarks"
                       :programmeId="programmeId"
                       :programme="selectedProgrammeList[0]"
                       :originState="currentRecommendItem"
                       :posterImages="posterImages">
            </component>
        </keep-alive>
        <template v-if="mode === 'EDIT' && activeStep === 0">
            <el-table
                :data="currentProgramme"
                border
                style="width: 100%">
                <el-table-column
                    prop="code"
                    label="编号">
                    <template slot-scope="scope">
                        <i class="el-icon-success"></i>
                        <label>{{scope.row.code}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                             :alt="scope.row.coverImage.name"
                             v-if="scope.row.coverImage">
                        <label v-else>------</label>
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
                    prop="featureVideoCount"
                    label="正片数量">
                </el-table-column>
                <el-table-column
                    prop="extraVideoCount"
                    label="相关视频数量">
                </el-table-column>
                <el-table-column
                    prop="announceAt"
                    label="上映时间">
                    <template slot-scope="scope">
                        {{scope.row.announceAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="releaseArea"
                    label="地区">
                </el-table-column>
                <el-table-column
                    label="分类">
                    <template slot-scope="scope">
                        {{scope.row.categoryList | jsonJoin('name')}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="typeList"
                    label="类型">
                    <template slot-scope="scope">
                        {{scope.row.typeList | jsonJoin('name')}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="主演">
                    <template slot-scope="scope">
                        <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="导演">
                    <template slot-scope="scope">
                        <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="visible"
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' :'已下架'}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="step-button">
            <el-button @click="switchMode" v-if="activeStep === 0 && mode === 'EDIT'">更换节目</el-button>
            <el-button @click="previous" v-if="activeStep === 1 || activeStep === 2">上一步</el-button>
            <el-button @click="next" v-if="activeStep === 0 ||activeStep === 1">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 2">完成</el-button>
        </div>
    </div>
</template>

<script>
    import ProgrammeSecondStep from './ProgrammeSecondStep';
    import SelectProgramme from '../subject_manage/programme_subject/SelectProgramme';
    import SetCornerMarks from './SetCornerMarks';

    export default {
        name: 'AppendProgramme',
        components: {
            ProgrammeSecondStep,
            SelectProgramme,
            SetCornerMarks
        },
        data() {
            return {
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                selectedProgrammeList: [],
                activeStep: 0,
                // 当前选择的节目的id
                programmeId: '',
                // 当前选择的节目的封面图的列表
                posterImages: [],
                // 当前选择的节目的封面图
                posterImage: {},
                checkedCornerMarks: {},
                // 当前模式，'EDIT'为回填编辑模式, 'NORMAL'为正常的选择模式
                mode: 'EDIT',
                // 当前store中推荐项的信息
                currentRecommendItem: {},
                // 当前节目
                currentProgramme: []
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectProgramme';
                    case 1:
                        return 'ProgrammeSecondStep';
                    case 2:
                        return 'SetCornerMarks';
                    default:
                        return 'SelectProgramme';
                }
            },
            currentNavBarInfo() {
                return this.$store.getters['layout/getNavBarInfo']({
                    navBarId: this.navBarId
                });
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.currentRecommendItem = this.$store.getters['layout/getRecommendItemInfo']({
                    navBarSignCode: this.$route.params.navBarSignCode,
                    model: this.$route.params.model,
                    row: this.$route.params.row,
                    index: this.$route.params.index
                });
                if (this.currentRecommendItem.layoutItemType === 'PROGRAMME') {
                    this.mode = 'EDIT';
                } else {
                    this.mode = 'NORMAL';
                }
                if (this.mode !== 'EDIT') {
                    this.$nextTick(function () {
                        this.$refs.currentComponent.init();
                    });
                } else {
                    this.initCurrentRecommendItem();
                }
            },
            switchMode() {
                this.mode = 'RESET';
                this.$refs.currentComponent.init();
            },
            // 初始化当前推荐项的数据
            initCurrentRecommendItem() {
                this.$service.getProgrammeInfo({id: this.currentRecommendItem.id}).then(response => {
                    if (response && response.code === 0) {
                        this.currentProgramme.push(response.data);
                        this.selectedProgrammeList[0] = response.data;
                        this.posterImages = response.data.posterImageList;
                        this.programmeId = this.currentRecommendItem.id;
                        this.posterImage = this.currentRecommendItem.coverImage;
                    } else {
                        this.mode = 'NORMAL';
                        this.$refs.currentComponent.init();
                    }
                });
            },
            // 获取节目详情
            getProgrammeDetail() {
                this.$service.getProgrammeInfo({id: this.programmeId}).then(response => {
                    if (response && response.code === 0) {
                        // 根据尺寸筛选图片
                        this.posterImages = response.data.posterImageList;
                    }
                });
            },
            setProgramme(programme) {
                this.selectedProgrammeList[0] = programme;
                this.programmeId = programme.id;
                this.getProgrammeDetail();
            },
            setPosterImage(posterImage) {
                this.posterImage = posterImage;
            },
            setCornerMarks(cornerMarks) {
                this.checkedCornerMarks = cornerMarks;
            },
            // 点击下一步
            next() {
                if (this.activeStep === 0 && !this.programmeId && this.mode !== 'EDIT') {
                    this.$message({
                        message: '请先选择节目',
                        type: 'warning'
                    });
                } else if (this.activeStep === 1 && !this.posterImage.id) {
                    this.$message({
                        message: '请先选择图片',
                        type: 'warning'
                    });
                } else {
                    this.activeStep++;
                }
            },
            // 点击上一步
            previous() {
                this.activeStep--;
            },
            // 完成
            complete() {
                // 检测当前是否完成角标设置
                if (!this.$refs.currentComponent.setCornerMarksSetting()) {
                    return;
                }
                // 组建推荐节目对象，保存到store中
                let programme = {
                    cornerMark: this.checkedCornerMarks,
                    coverImage: this.posterImage,
                    name: this.selectedProgrammeList[0].name,
                    id: this.programmeId,
                    layoutItemType: 'PROGRAMME'
                };
                this.$store.commit('layout/setSingleRecommendItem', {
                    navBarId: this.$route.params.navBarId,
                    navBarSignCode: this.$route.params.navBarSignCode,
                    model: this.$route.params.model,
                    row: this.$route.params.row,
                    index: this.$route.params.index,
                    item: programme
                });
                this.$message({
                    message: '设置节目成功',
                    type: 'success'
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-table {
        img {
            width: 120px;
        }
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }

        .el-icon-success {
            margin-right: 5px;
            color: #409EFF;
            visibility: hidden;
        }
        .current-row {
            .el-icon-success {
                visibility: visible;
            }
        }
    }

    .el-steps {
        margin: 30px 60px 0 60px;
    }

    .step-button {
        margin: 50px 0px;
    }
</style>
