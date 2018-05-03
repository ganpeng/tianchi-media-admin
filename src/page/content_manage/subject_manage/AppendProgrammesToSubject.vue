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
            <select-multiple-programme
                v-on:setProgram="setProgramme">
            </select-multiple-programme>
            <el-tag>已选节目</el-tag>
            <div v-if="selectedProgrammeList.length === 0" class="no-programme">目前暂无选择的节目</div>
            <ul class="programme-list" v-else>
                <li v-for="(item,index) in selectedProgrammeList" :key="index">
                    <el-card :body-style="{ padding: '0px' }" class="text-center">
                        <img :src="item.url">
                        <label>{{item.name}}</label>
                        <el-button type="text" @click="removeProgramme(index)">删除</el-button>
                    </el-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SelectMultipleProgramme from './SelectMultipleProgramme';

    export default {
        name: 'AppendProgrammesToSubject',
        components: {
            SelectMultipleProgramme
        },
        data() {
            return {
                selectedProgrammeList: []
            };
        },
        methods: {
            // 删除选中的节目
            removeProgramme(index) {
                this.selectedProgrammeList.splice(index, 1);
            },
            // 设置选择的节目
            setProgramme(selectedProgramme) {
                this.selectedProgrammeList = selectedProgramme;
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

    .programme-list {
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

    .no-programme {
        margin-top: 40px;
        margin-bottom: 50px;
    }
</style>
