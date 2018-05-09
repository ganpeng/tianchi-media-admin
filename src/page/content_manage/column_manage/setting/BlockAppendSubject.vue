<!--内容管理-栏目管理-模块推荐位选择专题-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>模块推荐位选择专题</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="blockName"
            clearable>
        </el-input>
        <h3 class="text-left">2.请选择要推荐的专题：</h3>
        <select-single-subject
            v-on:selectSubject="selectSubject">
        </select-single-subject>
        <h3 class="text-left">3.请选择模块板式：</h3>
        <el-select v-model="model" clearable placeholder="请选择模块板式">
            <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <div class="model-block">
            <ul :class="'model-' + modelArray[0].length">
                <li v-for="(item,index) in modelArray[0]" :key="index">{{item}}</li>
            </ul>
            <ul :class="'model-' + modelArray[1].length">
                <li v-for="(item,index) in modelArray[1]" :key="index">{{item}}</li>
            </ul>
            <ul :class="'model-' + modelArray[2].length">
                <li v-for="(item,index) in modelArray[2]" :key="index">{{item}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import blockModel from '@/util/config/block_model';

    export default {
        name: 'BlockAppendSubject',
        components: {
            SelectSingleSubject
        },
        data() {
            return {
                blockName: '',
                currentSubject: {},
                modelOptions: blockModel.TYPE,
                model: ''
            };
        },
        computed: {
            modelArray() {
                let array = {
                    0: [],
                    1: [],
                    2: []
                };
                for (let k = 0; k < this.model.split('+').length; k++) {
                    for (let i = 0; i < this.model.split('+')[k]; i++) {
                        array[k].push(i);
                    }
                }
                return array;
            }
        },
        methods: {
            // 选择某一个专题
            selectSubject(item) {
                this.currentSubject = item;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-input {
        width: 500px;
    }

    .el-select {
        width: 500px;
    }

    // 根据一行节目数量，确定模块样式
    .model-block {
        ul {
            display: flex;
            margin-top: 30px;
            justify-content: space-between;
            li {
                margin-right: 30px;
                flex-grow: 1;
                background: #5daf34;
                cursor: pointer;
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
        .model-1 {
            li {
                height: 0;
                width: 89%;
                padding-bottom: 11%;
            }
        }

        .model-2 {
            li {
                height: 0;
                width: 79%;
                padding-bottom: 21%;
            }
        }

        .model-3 {
            li {
                height: 0;
                width: 70%;
                padding-bottom: 30%;
            }
        }

        .model-4 {
            li {
                height: 0;
                width: 63%;
                padding-bottom: 37%;
            }
        }

        .model-6 {
            li {
                height: 0;
                width: 41%;
                padding-bottom: 59%
            }
        }
    }

</style>
