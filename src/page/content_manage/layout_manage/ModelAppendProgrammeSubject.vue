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
            v-model="title"
            clearable>
        </el-input>
        <h3 class="text-left">2.请选择要推荐的节目专题：</h3>
        <select-single-subject
            ref="selectSingleSubject"
            v-on:setSubject="setSubject">
        </select-single-subject>
        <h3 class="text-left">3.请选择模块板式：</h3>
        <el-select v-model="model" clearable placeholder="请选择模块板式" @change="setBlockModel"
                   :disabled="!currentSubject.id">
            <el-option
                v-for="item in modelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <div class="model-block">
            <ul :class="'model-' + row.length" v-for="(row,rowIndex) in subjectLayoutItemList" :key="rowIndex">
                <li v-for="(item,index) in row" :key="index" @click="setModelItem(rowIndex,index)">
                    <div class="ab-center">
                        <img :src="item.coverImage ? item.coverImage.uri : ''"
                             :alt="item.coverImage.name"
                             v-if="item.coverImage">
                    </div>
                </li>
            </ul>
        </div>
        <div class="text-center save-btn">
            <el-button type="success" @click="saveBlock">保 存</el-button>
        </div>
        <el-dialog title="设置模块内的节目" :visible.sync="dialogTableVisible">
            <set-subject-programme
                v-if="dialogTableVisible"
                :programmeList="programmeList"
                v-on:setCurrentSubjectItem="setCurrentSubjectItem">
            </set-subject-programme>
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
                title: '',
                currentSubject: {},
                modelOptions: blockModel.TYPE,
                model: '',
                // 布局一定的节目列表
                subjectLayoutItemList: [[], [], []],
                // 当前专题中的节目列表
                programmeList: [],
                // 当前设置节目所在行数
                currentRow: '',
                // 当前设置节目所在某行的index
                currentIndex: ''
            };
        },
        methods: {
            // 选择某一个专题
            setSubject(item) {
                if (!item.subjectItemList || item.subjectItemList.length === 0) {
                    this.$message({
                        message: '该专题中没有节目，不可选择',
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
                if (!this.model) {
                    return;
                }
                if (this.getModelCount() > this.programmeList.length) {
                    this.$message({
                        message: '该模块板式需要节目数量多于专题节目数量，不可选择',
                        type: 'warning'
                    });
                    this.model = '';
                    return;
                } else if (this.getModelCount() === this.programmeList.length) {
                    // 模块板式没有最后一个'更多'的位置
                } else {
                    // 模块板式有最后一个'更多'的位置
                }
                // 初始化模块列表
                this.subjectLayoutItemList = [[], [], []];
                for (let k = 0; k < this.model.split('+').length; k++) {
                    for (let i = 0; i < this.model.split('+')[k]; i++) {
                        this.subjectLayoutItemList[k].push(i);
                    }
                }
                // 重置节目列表
                this.programmeList.map(programme => {
                    delete programme.selected;
                });
            },
            getModelCount() {
                let num = 0;
                let array = this.model.split('+');
                for (let k = 0; k < this.model.split('+').length; k++) {
                    num = num + parseInt(array[k]);
                }
                return num;
            },
            // 设置模板样式中的节目项
            setModelItem(row, index) {
                this.currentRow = row;
                this.currentIndex = index;
                this.dialogTableVisible = true;
            },
            // 设置专题某一项内容
            setCurrentSubjectItem(programmeItem) {
                this.subjectLayoutItemList[this.currentRow][this.currentIndex] = programmeItem;
                this.dialogTableVisible = false;
                // 设置节目为已选
                this.programmeList.map(programme => {
                    if (programme.id === programmeItem.id) {
                        programme.selected = true;
                    }
                });
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
                let completeItemCount = 0;
                // 检查是否设置完成模块的每一项
                this.subjectLayoutItemList.map(rowArray => {
                    rowArray.map(programme => {
                        if (programme.id) {
                            completeItemCount++;
                        }
                    });
                });
                if (completeItemCount < this.getModelCount()) {
                    this.$message({
                        message: '请完整设置模块中的节目',
                        type: 'warning'
                    });
                    return;
                }
                // 定义模块布局模式
                let layoutTemplate = 'LT_' + this.model.replace(/\+/g, '_');
                // 组建模块专题对象
                let programmeModel = {
                    layoutTemplate: layoutTemplate,
                    renderType: 'PROGRAMME',
                    subjectId: this.currentSubject.id,
                    title: this.title,
                    layoutItemMultiList: this.subjectLayoutItemList
                };
                // 保存到store中
                this.$store.dispatch('todayRecommend/setSubjectLayoutItem', {
                    model: this.$route.params.model,
                    subjectModel: programmeModel
                }).then(response => {
                    if (response === 'success') {
                        this.$message({
                            message: '设置模块专题成功',
                            type: 'success'
                        });
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
                position: relative;
                margin-right: 30px;
                flex-grow: 1;
                background: #5daf34;
                cursor: pointer;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
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
