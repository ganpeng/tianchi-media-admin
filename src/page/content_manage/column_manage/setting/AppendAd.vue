<!--内容管理-栏目管理-广告选择组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>广告选择</el-breadcrumb-item>
        </el-breadcrumb>
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="选择广告素材及排序"></el-step>
            <el-step title="步骤2" description="选择广告匹配策略"></el-step>
            <el-step title="步骤3" description="设置广告名称"></el-step>
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
    import AdFirstStep from './AdFirstStep';
    import AdSecondStep from './AdSecondStep';
    import AdThirdStep from './AdThirdStep';

    export default {
        name: 'AppendAd',
        components: {
            AdFirstStep,
            AdSecondStep,
            AdThirdStep
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
                        return 'AdFirstStep';
                    case 1:
                        return 'AdSecondStep';
                    case 2:
                        return 'AdThirdStep';
                    default:
                        return 'AdFirstStep';
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
                    message: '设置广告成功',
                    type: 'success'
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .block-title {
        padding: 30px 0 20px 20px;
        line-height: 2;
        text-align: left;
        font-size: 22px;
    }

    .el-steps {
        margin: 30px 60px 0 60px;
    }

    .step-button {
        margin: 50px 0px;
    }
</style>
