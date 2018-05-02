<!--添加节目到专题组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加专题节目</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <select-multiple-program
                v-on:setProgram="setProgram">
            </select-multiple-program>
            <el-tag>已选节目</el-tag>
            <div v-if="selectedProgramList.length === 0" class="no-program">目前暂无选择的节目</div>
            <ul class="program-list" v-else>
                <li v-for="(item,index) in selectedProgramList" :key="index">
                    <el-card :body-style="{ padding: '0px' }" class="text-center">
                        <img :src="item.url">
                        <label>{{item.name}}</label>
                        <el-button type="text" @click="removeProgram(index)">删除</el-button>
                    </el-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SelectMultipleProgram from './SelectMultipleProgram';

    export default {
        name: 'AppendProgramsToSubject',
        components: {
            SelectMultipleProgram
        },
        data() {
            return {
                selectedProgramList: []
            };
        },
        methods: {
            // 删除选中的节目
            removeProgram(index) {
                this.selectedProgramList.splice(index, 1);
            },
            // 设置选择的节目
            setProgram(selectedProgram) {
                this.selectedProgramList = selectedProgram;
            }
        }
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
        .el-tag {
            margin-top: 50px;
        }
    }

    .program-list {
        display: flex;
        margin-top: 30px;
        margin-bottom: 30px;
        justify-content: left;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            .el-card {
                position: relative;
                padding-bottom: 10px;
            }
            img {
                display: block;
                margin-bottom: 10px;
                height: 180px;
            }
            label {
                font-size: 16px;
            }
            .el-button {
                position: absolute;
                bottom: 0px;
                right: 10px;
            }
        }
    }

    .no-program {
        margin-top: 40px;
        margin-bottom: 50px;
    }
</style>
