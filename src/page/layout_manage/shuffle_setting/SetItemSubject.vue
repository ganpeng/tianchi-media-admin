<!--内容管理-栏目管理-设置混排内的专题组件-->
<template>
    <div class="text-center">
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="请选择专题"></el-step>
            <el-step title="步骤2" description="选择专题图片"></el-step>
        </el-steps>
        <keep-alive>
            <component
                v-show="!(mode === 'EDIT' && activeStep === 0)"
                ref="currentComponent"
                :is="currentView"
                :subject="subject"
                mode="PROGRAMME"
                :imageSpec="imageSpec"
                :originState="currentState"
                :backgroundFilter=true
                v-on:setSubject="setSubject"
                v-on:resetSubjectInfo='resetSubjectInfo'
                v-on:setCoverImage="setCoverImage">
            </component>
        </keep-alive>
        <!--展示当前选择的专题的table表格-->
        <template v-if="mode === 'EDIT' && activeStep === 0">
            <single-subject-table
                :singleSubjectList="[subject]">
            </single-subject-table>
            <div>
                <el-button type="primary" plain @click="switchMode">更换专题</el-button>
            </div>
        </template>
        <div class="step-button text-right">
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="next" v-if="activeStep < 1">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 1">完 成</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleSubject from '../SelectSingleSubject';
    import SingleSubjectTable from '../SingleSubjectTable';
    import SetItemSubjectCoverImage from './SetItemSubjectCoverImage';

    export default {
        name: 'SetItemSubject',
        components: {
            SelectSingleSubject,
            SingleSubjectTable,
            SetItemSubjectCoverImage
        },
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originState 需要回填的专题的信息
         * */
        props: ['imageSpec', 'originState'],
        data() {
            return {
                activeStep: 0,
                // 当前设置的专题
                subject: {},
                // 当前专题选择的封面图片
                coverImage: {},
                // 当前选择的专题的状态信息
                currentState: {},
                mode: 'NORMAL'
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectSingleSubject';
                    case 1:
                        return 'SetItemSubjectCoverImage';
                    default:
                        return 'SelectSingleSubject';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originState && this.originState.coverImage) {
                    this.currentState = this.originState;
                    this.subject.id = this.originState.id;
                    this.coverImage = this.originState.coverImage;
                    this.initSubjectDetail();
                    this.mode = 'EDIT';
                } else {
                    this.mode = 'NORMAL';
                }
                this.$refs.currentComponent.getSubjectList();
            },
            initSubjectDetail() {
                this.$service.getSubjectDetail(this.subject.id).then(response => {
                    if (response && response.code === 0) {
                        this.subject = response.data;
                    }
                });
            },
            switchMode() {
                this.mode = 'NORMAL';
                this.subject = {};
                this.coverImage = {};
                this.currentState = {};
            },
            // 设置选择专题
            setSubject(subject) {
                this.subject = subject;
                this.currentState = {};
            },
            resetSubjectInfo() {
                this.subject = {};
                this.currentState = {};
            },
            setCoverImage(coverImage) {
                this.coverImage = coverImage;
            },
            // 点击下一步
            next() {
                if (this.activeStep === 0 && !this.subject.id) {
                    this.$message({
                        message: '请选择专题',
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
                // 检测当前是否完成背景图片设置
                if (!this.coverImage.id) {
                    this.$message({
                        message: '请设置专题的图片',
                        type: 'warning'
                    });
                    return;
                }
                // 组成专题
                let subjectItem = {
                    id: this.subject.id,
                    name: this.subject.name,
                    layoutItemType: 'SUBJECT',
                    coverImage: this.coverImage
                };
                this.$emit('setShuffleItem', subjectItem);
                this.$message({
                    message: '成功设置混排模块的专题',
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
        margin-top: 50px;
    }
</style>
