<!--添加人物到专题组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加专题人物</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <select-multiple-person
                v-on:setPerson="setPerson">
            </select-multiple-person>
            <el-tag>已选人物</el-tag>
            <div v-if="selectedPersonList.length === 0" class="no-person">目前暂无选择的人物</div>
            <ul class="person-list" v-else>
                <li v-for="(item,index) in selectedPersonList" :key="index">
                    <el-card :body-style="{ padding: '0px' }" class="text-center">
                        <img :src="item.url">
                        <label>{{item.name}}</label>
                        <el-button type="text" @click="removePerson(index)">删除</el-button>
                    </el-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SelectMultiplePerson from './SelectMultiplePerson';

    export default {
        name: 'AppendPersonsToSubject',
        components: {
            SelectMultiplePerson
        },
        data() {
            return {
                selectedPersonList: []
            };
        },
        methods: {
            // 删除选中的人物
            removePerson(index) {
                this.selectedPersonList.splice(index, 1);
            },
            // 设置选择的人物
            setPerson(selectedPerson) {
                this.selectedPersonList = selectedPerson;
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

    .person-list {
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

    .no-person {
        margin-top: 40px;
        margin-bottom: 50px;
    }
</style>
