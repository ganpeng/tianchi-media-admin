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
                       ref="currentComponent"
                       v-on:setProgramme="setProgramme"
                       v-on:resetProgramme="resetProgramme"
                       v-on:setProgrammeCoverImage="setProgrammeCoverImage"
                       v-on:setProgrammeCoverImageBackground="setProgrammeCoverImageBackground"
                       v-on:setCornerMarks="setCornerMarks"
                       :programme="currentSelectedProgramme"
                       :originState="currentRecommendItem">
            </component>
        </keep-alive>
        <template v-if="mode === 'EDIT' && activeStep === 0">
            <single-programme-table
                :singleProgrammeList="currentProgramme">
            </single-programme-table>
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
    import SelectSingleProgramme from './SelectSingleProgramme';
    import SetCornerMarks from './SetCornerMarks';
    import SingleProgrammeTable from './SingleProgrammeTable';

    export default {
        name: 'AppendProgramme',
        components: {
            ProgrammeSecondStep,
            SelectSingleProgramme,
            SetCornerMarks,
            SingleProgrammeTable
        },
        data() {
            return {
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                // 当前选中的节目
                currentSelectedProgramme: {},
                activeStep: 0,
                // 当前选择的节目的封面图
                coverImage: {},
                // 当前选择的节目的出格背景图
                coverImageBackground: {},
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
                        return 'SelectSingleProgramme';
                    case 1:
                        return 'ProgrammeSecondStep';
                    case 2:
                        return 'SetCornerMarks';
                    default:
                        return 'SelectSingleProgramme';
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
                if (this.mode === 'EDIT') {
                    this.initCurrentRecommendItem();
                }
            },
            switchMode() {
                this.mode = 'RESET';
                this.resetProgramme();
            },
            // 重置选择的节目
            resetProgramme() {
                this.currentSelectedProgramme = {};
                this.coverImageBackground = {};
                this.coverImage = {};
                this.currentRecommendItem = {};
            },
            // 初始化当前推荐项的数据
            initCurrentRecommendItem() {
                this.$service.getProgrammeInfo({id: this.currentRecommendItem.id}).then(response => {
                    if (response && response.code === 0) {
                        this.currentProgramme.push(response.data);
                        this.currentSelectedProgramme = response.data;
                        this.coverImage = this.currentRecommendItem.coverImage;
                        this.coverImageBackground = this.currentRecommendItem.coverImageBackground;
                    } else {
                        this.mode = 'NORMAL';
                    }
                });
            },
            // 获取节目详情
            getProgrammeDetail() {
                this.$service.getProgrammeInfo({id: this.currentSelectedProgramme.id}).then(response => {
                    if (response && response.code === 0) {
                        this.currentSelectedProgramme = response.data;
                    }
                });
            },
            setProgramme(programme) {
                this.currentSelectedProgramme = programme;
                this.getProgrammeDetail();
            },
            // 设置正常封面
            setProgrammeCoverImage(coverImage) {
                this.coverImage = coverImage;
            },
            // 设置出格背景图
            setProgrammeCoverImageBackground(coverImageBackground) {
                this.coverImageBackground = coverImageBackground;
            },
            setCornerMarks(cornerMarks) {
                this.checkedCornerMarks = cornerMarks;
            },
            // 点击下一步
            next() {
                if (this.activeStep === 0 && !this.currentSelectedProgramme.id && this.mode !== 'EDIT') {
                    this.$message({
                        message: '请先选择节目',
                        type: 'warning'
                    });
                } else if (this.activeStep === 1 && !this.coverImage.id) {
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
                    coverImage: this.coverImage,
                    coverImageBackground: this.coverImageBackground,
                    name: this.currentSelectedProgramme.name,
                    desc: this.currentSelectedProgramme.desc,
                    id: this.currentSelectedProgramme.id,
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

    .el-steps {
        margin: 30px 60px 0 60px;
    }

    .step-button {
        margin: 50px 0px;
    }

</style>
