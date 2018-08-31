<!--内容管理-栏目管理-设置专题内的节目组件-->
<template>
    <div class="text-center">
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="请选择节目"></el-step>
            <el-step title="步骤2" description="选择图片"></el-step>
            <el-step title="步骤3" description="设置角标"></el-step>
        </el-steps>
        <keep-alive>
            <component
                ref="SetSubjectProgrammeCornerMarks"
                :is="currentView"
                :programmeList="currentProgrammeList"
                :programme="programme"
                :imageSpec="imageSpec"
                :originState="currentState"
                v-on:setProgramme="setProgramme"
                v-on:resetProgramme="resetProgramme"
                v-on:setCoverImage="setCoverImage"
                v-on:setCornerMarks="setCornerMarks">
            </component>
        </keep-alive>
        <div class="step-button text-right">
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="next" v-if="activeStep < 2">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 2">完 成</el-button>
        </div>
    </div>
</template>

<script>
    import SetSubjectProgrammeFirst from './SetSubjectProgrammeFirst';
    import SetItemProgrammeCoverImage from './shuffle_setting/SetItemProgrammeCoverImage';
    import SetCornerMarks from './SetCornerMarks';

    export default {
        name: 'SetSubjectProgramme',
        components: {
            SetSubjectProgrammeFirst,
            SetItemProgrammeCoverImage,
            SetCornerMarks
        },
        /** programmeList 当前专题中的节目列表
         *  imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originProgramme 需要回填的节目的信息
         *  subjectLayoutItemList 当前已经选择设置的节目的集合
         * */
        props: ['programmeList', 'imageSpec', 'originProgramme', 'subjectLayoutItemList'],
        data() {
            return {
                activeStep: 0,
                // 当前设置的节目
                programme: {},
                // 当前节目选择的封面图片
                coverImage: {},
                // 当前节目选择的角标
                checkedCornerMarks: {},
                // 当前选择的节目的状态信息
                currentState: {}
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SetSubjectProgrammeFirst';
                    case 1:
                        return 'SetItemProgrammeCoverImage';
                    case 2:
                        return 'SetCornerMarks';
                    default:
                        return 'SetSubjectProgrammeFirst';
                }
            },
            currentProgrammeList() {
                return JSON.parse(JSON.stringify(this.programmeList));
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originProgramme.coverImage) {
                    this.currentState = this.originProgramme;
                    this.coverImage = this.originProgramme.coverImage;
                    this.checkedCornerMarks = this.originProgramme.cornerMark;
                }
                // 初始化设置当前节目列表,设置选中以及当前编辑的节目
                this.subjectLayoutItemList.map(list => {
                    list.map(layoutItem => {
                        this.currentProgrammeList.map(item => {
                            if (item.id === this.originProgramme.id) {
                                item.originProgramme = true;
                                this.programme = item;
                            }
                            if (item.id === layoutItem.id) {
                                item.selected = true;
                            }
                        });
                    });
                });
            },
            // 重置选择的节目
            resetProgramme() {
                this.programme = {};
                this.coverImage = {};
                this.checkedCornerMarks = {};
            },
            setProgramme(programme) {
                this.programme = programme;
                this.currentState = {};
                this.coverImage = {};
                this.checkedCornerMarks = {};
            },
            setCoverImage(coverImage) {
                this.coverImage = coverImage;
            },
            setCornerMarks(cornerMarks) {
                this.checkedCornerMarks = cornerMarks;
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
                }
                this.activeStep++;
            },
            // 点击下一步
            previous() {
                this.activeStep--;
            },
            // 完成
            complete() {
                // 检测当前是否完成角标设置
                if (!this.$refs.SetSubjectProgrammeCornerMarks.setCornerMarksSetting()) {
                    return;
                }
                // 组成节目
                let programmeItem = {
                    id: this.programme.id,
                    name: this.programme.name,
                    layoutItemType: 'PROGRAMME',
                    coverImage: this.coverImage,
                    cornerMark: this.checkedCornerMarks
                };
                this.$emit('setCurrentSubjectItem', programmeItem);
                this.$message({
                    message: '设置专题内的节目成功',
                    type: 'success'
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    .step-button {
        margin-top: 50px;
    }

</style>
