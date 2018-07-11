<!--内容管理-栏目管理-设置混排内的人物组件-->
<template>
    <div class="text-center">
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="请选择人物"></el-step>
            <el-step title="步骤2" description="选择人物图片"></el-step>
        </el-steps>
        <keep-alive>
            <component
                ref="currentComponent"
                :is="currentView"
                :figure="figure"
                :imageSpec="imageSpec"
                :originState="currentState"
                v-on:setFigure="setFigure"
                v-on:setCoverImage="setCoverImage">
            </component>
        </keep-alive>
        <div class="step-button">
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="next" v-if="activeStep < 1">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 1">完成</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleFigure from '../SelectSingleFigure';
    import SetItemFigureCoverImage from './SetItemFigureCoverImage';

    export default {
        name: 'SetItemFigure',
        components: {
            SelectSingleFigure,
            SetItemFigureCoverImage
        },
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originFigure 需要回填的节目的信息
         * */
        props: ['imageSpec', 'originFigure'],
        data() {
            return {
                activeStep: 0,
                // 当前设置的人物
                figure: {},
                // 当前人物选择的封面图片
                coverImage: {},
                // 当前选择的人物的状态信息
                currentState: {}
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectSingleFigure';
                    case 1:
                        return 'SetItemFigureCoverImage';
                    default:
                        return 'SelectSingleFigure';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originFigure && this.originFigure.coverImage) {
                    this.currentState = this.originFigure;
                    this.coverImage = this.originFigure.coverImage;
                }
            },
            // 设置选择人物
            setFigure(figure) {
                this.figure = figure;
                this.currentState = {};
            },
            setCoverImage(coverImage) {
                this.coverImage = coverImage;
            },
            // 点击下一步
            next() {
                if (this.activeStep === 0 && !this.figure.id) {
                    this.$message({
                        message: '请选择人物',
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
                        message: '请设置人物的图片',
                        type: 'warning'
                    });
                    return;
                }
                // 组成人物
                let figureItem = {
                    id: this.figure.id,
                    name: this.figure.name,
                    layoutItemType: 'FIGURE',
                    coverImage: this.coverImage
                };
                this.$emit('setShuffleItem', figureItem);
                this.$message({
                    message: '成功设置混排模块的人物',
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
