<!--内容管理-栏目管理-设置混排内的节目组件-->
<template>
    <div class="text-center">
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="请选择节目"></el-step>
            <el-step title="步骤2" description="选择图片"></el-step>
            <el-step title="步骤3" description="设置角标"></el-step>
            <el-step title="步骤4" description="设置展示方式"></el-step>
        </el-steps>
        <keep-alive>
            <component
                ref="currentComponent"
                :is="currentView"
                :programme="programme"
                :imageSpec="imageSpec"
                :originState="currentState"
                v-on:setProgramme="setProgramme"
                v-on:resetProgramme="resetProgramme"
                v-on:setCoverImage="setCoverImage"
                v-on:setCornerMarks="setCornerMarks"
                v-on:setDisplayMode="setDisplayMode">
            </component>
        </keep-alive>
        <div class="step-button">
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="next" v-if="activeStep < 3">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 3">完成</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleProgramme from '../SelectSingleProgramme';
    import SetSubjectProgrammeSecond from '../SetSubjectProgrammeSecond';
    import SetCornerMarks from '../SetCornerMarks';
    import SetProgrammeDisplayMode from './SetProgrammeDisplayMode';

    export default {
        name: 'SetSubjectProgramme',
        components: {
            SelectSingleProgramme,
            SetSubjectProgrammeSecond,
            SetCornerMarks,
            SetProgrammeDisplayMode
        },
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originProgramme 需要回填的节目的信息
         *  subjectLayoutItemList 当前已经选择设置的节目的集合
         * */
        props: ['imageSpec', 'originProgramme', 'subjectLayoutItemList'],
        data() {
            return {
                activeStep: 0,
                // 当前设置的节目
                programme: {},
                // 当前节目选择的封面图片
                coverImage: {},
                // 当前节目选择的角标
                checkedCornerMarks: {},
                // 当前节目的展现方式
                displayMode: '',
                // 当前选择的节目的状态信息
                currentState: {}
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectSingleProgramme';
                    case 1:
                        return 'SetSubjectProgrammeSecond';
                    case 2:
                        return 'SetCornerMarks';
                    case 3:
                        return 'SetProgrammeDisplayMode';
                    default:
                        return 'SelectSingleProgramme';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.currentState = this.originProgramme;
                this.coverImage = this.originProgramme.coverImage;
                this.checkedCornerMarks = this.originProgramme.cornerMark;
                this.displayMode = this.originProgramme.displayMode;
            },
            // 重置选择的节目
            resetProgramme() {
                this.programme = {};
                this.coverImage = {};
                this.checkedCornerMarks = {};
                this.displayMode = '';
            },
            setProgramme(programme) {
                this.programme = programme;
                this.currentState = {};
            },
            setCoverImage(coverImage) {
                this.coverImage = coverImage;
            },
            setCornerMarks(cornerMarks) {
                this.checkedCornerMarks = cornerMarks;
            },
            setDisplayMode(displayMode) {
                console.log('表现形式');
                this.displayMode = displayMode;
            },
            // 点击下一步
            next() {
                if (this.activeStep === 0 && !this.programme.id) {
                    this.$message({
                        message: '请选择节目',
                        type: 'warning'
                    });
                    return;
                } else if (this.activeStep === 1 && !this.coverImage.id) {
                    this.$message({
                        message: '请选择封面图片',
                        type: 'warning'
                    });
                    return;
                } else if (this.activeStep === 2 && !this.$refs.currentComponent.setCornerMarksSetting()) {
                    this.$message({
                        message: '请完整设置节目角标',
                        type: 'warning'
                    });
                    return;
                }
                this.activeStep++;
            },
            // 点击下一步
            previous() {
                this.activeStep--;
            },
            // 完成
            complete() {
                // 检测当前是否完成展现形式设置
                if (!this.displayMode) {
                    this.$message({
                        message: '请设置节目的展现方式',
                        type: 'warning'
                    });
                    return;
                }
                console.log('设置');
                // 组成节目
                let programmeItem = {
                    id: this.programme.id,
                    name: this.programme.name,
                    layoutItemType: 'PROGRAMME',
                    coverImage: this.coverImage,
                    cornerMark: this.checkedCornerMarks,
                    displayMode: this.displayMode
                };
                this.$emit('setShuffleItem', programmeItem);
                this.$message({
                    message: '成功设置混排模块的节目',
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
