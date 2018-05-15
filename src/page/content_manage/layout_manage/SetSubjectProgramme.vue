<!--内容管理-栏目管理-设置专题内的节目组件-->
<template>
    <div>
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="请选择节目"></el-step>
            <el-step title="步骤2" description="选择图片"></el-step>
            <el-step title="步骤3" description="设置角标"></el-step>
        </el-steps>
        <keep-alive>
            <component :is="currentView">
                <!-- 非活动组件将被缓存！ -->
            </component>
        </keep-alive>
        <div class="step-button">
            <el-button @click="next" v-if="activeStep < 2">下一步</el-button>
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="complete" v-if="activeStep === 2">完成</el-button>
        </div>
    </div>
</template>

<script>
    import SetSubjectProgrammeFirst from './SetSubjectProgrammeFirst';
    import SetSubjectProgrammeSecond from './SetSubjectProgrammeSecond';
    import SetSubjectProgrammeThird from './SetSubjectProgrammeThird';

    export default {
        name: 'SetSubjectProgramme',
        components: {
            SetSubjectProgrammeFirst,
            SetSubjectProgrammeSecond,
            SetSubjectProgrammeThird
        },
        data() {
            return {
                activeStep: 0
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SetSubjectProgrammeFirst';
                    case 1:
                        return 'SetSubjectProgrammeSecond';
                    case 2:
                        return 'SetSubjectProgrammeThird';
                    default:
                        return 'SetSubjectProgrammeFirst';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 点击下一步
            next() {
                this.activeStep++;
            },
            // 点击下一步
            previous() {
                this.activeStep--;
            },
            // 完成
            complete() {
                this.$message({
                    message: '设置专题内的节目成功',
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
