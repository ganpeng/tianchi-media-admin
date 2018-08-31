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
                v-show="!(mode === 'EDIT' && activeStep === 0)"
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
        <!--展示当前选择的节目的table表格-->
        <template v-if="mode === 'EDIT' && activeStep === 0">
            <single-programme-table
                :singleProgrammeList="[programme]">
            </single-programme-table>
            <div>
                <el-button type="primary" plain @click="switchMode">更换节目</el-button>
            </div>
        </template>
        <div class="step-button text-right">
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="next" v-if="activeStep < 3">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 3">完 成</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleProgramme from '../SelectSingleProgramme';
    import SingleProgrammeTable from '../SingleProgrammeTable';
    import SetItemProgrammeCoverImage from './SetItemProgrammeCoverImage';
    import SetCornerMarks from '../SetCornerMarks';
    import SetProgrammeDisplayMode from './SetProgrammeDisplayMode';

    export default {
        name: 'SetItemProgramme',
        components: {
            SelectSingleProgramme,
            SingleProgrammeTable,
            SetItemProgrammeCoverImage,
            SetCornerMarks,
            SetProgrammeDisplayMode
        },
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originProgramme 需要回填的节目的信息
         * */
        props: ['imageSpec', 'originState'],
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
                currentState: {},
                // 当前是否为item编辑状态
                mode: 'NORMAL'
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectSingleProgramme';
                    case 1:
                        return 'SetItemProgrammeCoverImage';
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
                if (this.originState && this.originState.coverImage) {
                    this.mode = 'EDIT';
                    this.currentState = this.originState;
                    this.programme.id = this.originState.id;
                    this.programme.name = this.originState.name;
                    this.coverImage = this.originState.coverImage;
                    this.checkedCornerMarks = this.originState.cornerMark;
                    this.displayMode = this.originState.layoutItemType;
                    this.getProgrammeDetail();
                } else {
                    this.mode = 'NORMAL';
                }
            },
            // 获取节目详情
            getProgrammeDetail() {
                this.$service.getProgrammeInfo({id: this.programme.id}).then(response => {
                    if (response && response.code === 0) {
                        this.programme = response.data;
                    }
                });
            },
            switchMode() {
                this.mode = 'NORMAL';
                this.resetProgramme();
                this.currentState = {};
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
                // 组成节目
                let programmeItem = {
                    id: this.programme.id,
                    name: this.programme.name,
                    // 详情的layoutItemType对应：'PROGRAMME_DETAIL',列表对应'PROGRAMME_LIST'
                    layoutItemType: this.displayMode,
                    coverImage: this.coverImage,
                    cornerMark: this.checkedCornerMarks
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

    .step-button {
        margin-top: 50px;
    }
</style>
