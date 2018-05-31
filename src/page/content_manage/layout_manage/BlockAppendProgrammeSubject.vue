<!--内容管理-栏目管理-节目模块设置-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入节目模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="blockName"
            clearable>
        </el-input>
        <h3 class="text-left">2.请选择要推荐的节目专题：</h3>
        <select-single-subject
            ref="selectSingleSubject"
            v-on:setSubject="setSubject">
        </select-single-subject>
        <h3 class="text-left">3.请选择模块板式：</h3>
        <el-select v-model="model" clearable placeholder="请选择模块板式" @change="setBlockModel">
            <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <div class="model-block">
            <ul :class="'model-' + modelArray[0].length">
                <li v-for="(item,index) in modelArray[0]" :key="index" @click="dialogTableVisible = true">{{item}}</li>
            </ul>
            <ul :class="'model-' + modelArray[1].length">
                <li v-for="(item,index) in modelArray[1]" :key="index">{{item}}</li>
            </ul>
            <ul :class="'model-' + modelArray[2].length">
                <li v-for="(item,index) in modelArray[2]" :key="index">{{item}}</li>
            </ul>
        </div>
        <div class="text-center save-btn">
            <el-button type="success" @click="saveBlock">保 存</el-button>
        </div>
        <el-dialog title="设置模块内的节目" :visible.sync="dialogTableVisible">
            <set-subject-programme></set-subject-programme>
        </el-dialog>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import SetSubjectProgramme from './SetSubjectProgramme';
    import blockModel from '@/util/config/block_model';

    export default {
        name: 'BlockAppendProgrammeSubject',
        components: {
            SelectSingleSubject,
            SetSubjectProgramme
        },
        data() {
            return {
                dialogTableVisible: false,
                blockName: '',
                currentSubject: {},
                modelOptions: blockModel.TYPE,
                model: '',
                programmeList: []
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
            setSubject(item) {
                if (!item.subjectItemList || item.subjectItemList.length < 7) {
                    this.$message({
                        message: '该专题人物数少于7个，不可选择',
                        type: 'warning'
                    });
                    this.currentSubject = {};
                    this.programmeList = [];
                    // 取消选择
                    this.$refs.selectSingleSubject.cancelSubject();
                } else {
                    this.currentSubject = item;
                    this.programmeList = item.subjectItemList;
                }
            },
            // 选择模块板式
            setBlockModel() {
                let num = 0;
                let array = this.model.split('+');
                for (let k = 0; k < this.model.split('+').length; k++) {
                    num = num + parseInt(array[k]);
                }
            },
            // 保存信息到store中
            saveBlock() {
                if (!this.title) {
                    this.$message({
                        message: '请填写模块名称',
                        type: 'warning'
                    });
                    return;
                }
                if (!this.currentSubject.id) {
                    this.$message({
                        message: '请选择专题',
                        type: 'warning'
                    });
                    return;
                }
                // 组建模块专题对象
                let programme = {};
                // 保存到store中
                this.$store.dispatch('todayRecommend/setSubjectLayoutItem', {
                    row: this.$route.params.row,
                    item: programme
                }).then(response => {
                    if (response === 'success') {
                        this.$message({
                            message: '设置模块专题成功',
                            type: 'success'
                        });
                        this.$store.dispatch('todayRecommend/setTodayRecommendCache');
                    } else {
                        this.$message({
                            message: '设置模块专题失败',
                            type: 'warning'
                        });
                    }
                });
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
                width: 100%;
                padding-bottom: 12%;
            }
        }

        .model-2 {
            li {
                width: 48%;
                padding-top: 13%;
            }
        }

        .model-3 {
            li {
                width: 31%;
                padding-top: 13%;
            }
        }

        .model-4 {
            li {
                width: 23%;
                padding-top: 13%;
            }
        }

        .model-6 {
            li {
                width: 14%;
                padding-top: 20%;
            }
        }
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
