<!--内容管理-栏目管理-节目选择组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目选择</el-breadcrumb-item>
        </el-breadcrumb>
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="选择节目资源"></el-step>
            <el-step title="步骤2" description="选择节目图片"></el-step>
            <el-step title="步骤3" description="设置节目角标"></el-step>
        </el-steps>
        <keep-alive>
            <component :is="currentView"
                       :selectedProgrammeList="selectedProgrammeList"
                       ref="selectMultipleProgramme"
                       model="SINGLE"
                       v-on:setProgramme="setProgramme"
                       v-on:setPosterImage="setPosterImage"
                       v-on:setCornerMarks="setCornerMarks"
                       :programmeId="programmeId"
                       :posterImages="posterImages">
                <!-- 非活动组件将被缓存！ -->
            </component>
        </keep-alive>
        <div class="step-button">
            <el-button @click="previous" v-if="activeStep === 1 || activeStep === 2">上一步</el-button>
            <el-button @click="next" v-if="activeStep === 0 ||activeStep === 1">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 2">完成</el-button>
        </div>
    </div>
</template>

<script>
    import ProgrammeSecondStep from './ProgrammeSecondStep';
    import SelectMultipleProgramme from '../subject_manage/programme_subject/SelectMultipleProgramme';
    import SetSubjectProgrammeThird from './SetSubjectProgrammeThird';

    export default {
        name: 'AppendProgramme',
        components: {
            ProgrammeSecondStep,
            SelectMultipleProgramme,
            SetSubjectProgrammeThird
        },
        data() {
            return {
                selectedProgrammeList: [],
                activeStep: 0,
                programmeId: '',
                posterImages: [],
                posterImage: {},
                checkedCornerMarks: {}
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectMultipleProgramme';
                    case 1:
                        return 'ProgrammeSecondStep';
                    case 2:
                        return 'SetSubjectProgrammeThird';
                    default:
                        return 'SelectMultipleProgramme';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$refs.selectMultipleProgramme.init();
            },
            // 获取节目详情
            getProgrammeDetail() {
                this.$service.getProgrammeInfo({id: this.programmeId}).then(response => {
                    if (response && response.code === 0) {
                        // 根据尺寸筛选图片
                        this.posterImages = response.data.posterImages;
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
                if (this.activeStep === 0 && !this.programmeId) {
                    this.$message({
                        message: '请先选择节目',
                        type: 'warning'
                    });
                } else if (this.activeStep === 1 && !this.posterImage.uri) {
                    this.$message({
                        message: '请先选择图片',
                        type: 'warning'
                    });
                } else {
                    this.activeStep++;
                }
            },
            // 点击下一步
            previous() {
                this.activeStep--;
            },
            // 完成
            complete() {
                // 组建推荐节目对象，保存到store中
                let programme = {
                    cornerMark: this.checkedCornerMarks,
                    coverImage: this.posterImage,
                    id: this.programmeId,
                    itemType: 'PROGRAMME'
                };
                this.$store.dispatch('todayRecommend/setRecommendItem', {
                    row: this.$route.params.row,
                    index: this.$route.params.index,
                    item: programme
                }).then(response => {
                    if (response === 'success') {
                        this.$message({
                            message: '设置节目成功',
                            type: 'success'
                        });
                        this.$store.dispatch('todayRecommend/setTodayRecommendCache');
                    } else {
                        this.$message({
                            message: '设置节目失败',
                            type: 'warning'
                        });
                    }
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
