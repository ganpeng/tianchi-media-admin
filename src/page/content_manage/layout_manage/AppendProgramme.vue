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
        </el-steps>
        <keep-alive>
            <component :is="currentView"
                       :selectedProgrammeList="selectedProgrammeList"
                       ref="selectMultipleProgramme"
                       model="SINGLE"
                       v-on:setProgramme="setProgramme"
                       :programmeId="programmeId">
                <!-- 非活动组件将被缓存！ -->
            </component>
        </keep-alive>
        <div class="step-button">
            <el-button @click="next" v-if="activeStep === 0">下一步</el-button>
            <el-button @click="previous" v-if="activeStep === 1">上一步</el-button>
            <el-button @click="complete" v-if="activeStep === 1">完成</el-button>
        </div>
    </div>
</template>

<script>
    import ProgrammeSecondStep from './ProgrammeSecondStep';
    import SelectMultipleProgramme from '../subject_manage/programme_subject/SelectMultipleProgramme';

    export default {
        name: 'AppendProgramme',
        components: {
            ProgrammeSecondStep,
            SelectMultipleProgramme
        },
        data() {
            return {
                selectedProgrammeList: [],
                activeStep: 0,
                programmeId: ''
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectMultipleProgramme';
                    case 1:
                        return 'ProgrammeSecondStep';
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
            setProgramme(programme) {
                this.selectedProgrammeList[0] = programme;
                this.programmeId = programme.id;
            },
            // 点击下一步
            next() {
                if (!this.programmeId) {
                    this.$message({
                        message: '请先选择节目',
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
