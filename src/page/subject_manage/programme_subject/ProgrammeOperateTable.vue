<!--节目操作组件-->
<template>
    <div>
        <el-table
            ref="programmeTable"
            :data="programmeList"
            header-row-class-name="common-table-header"
            border
            row-class-name=programme-row
            style="width: 100%"
            @select-all="selectAll"
            @select="selectRow">
            <el-table-column
                v-if="model === 'CANCEL' || model === 'DETAIL'"
                align="center"
                width="60px"
                label="序号">
                <template slot-scope="scope">
                    <label>{{scope.$index + 1}}</label>
                </template>
            </el-table-column>
            <el-table-column
                v-if="model==='MULTIPLE'"
                type="selection"
                width="40px">
            </el-table-column>
            <el-table-column
                align="center"
                width="120px"
                prop="code"
                label="节目编号">
                <template slot-scope="scope">
                    <label>{{scope.row.code}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                prop="name"
                label="节目名称">
            </el-table-column>
            <el-table-column
                align="center"
                width="100px"
                label="节目图片">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100px"
                prop="featureVideoCount"
                label="正片数量">
            </el-table-column>
            <el-table-column
                width="100px"
                align="center"
                prop="announceAt"
                label="上映时间">
                <template slot-scope="scope">
                    <label v-if="scope.row.announceAt">{{scope.row.announceAt | formatDate('yyyy-MM-DD')}}</label>
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                min-width="150px"
                align="center"
                prop="produceAreaList"
                label="地区">
                <template slot-scope="scope">
                    {{(scope.row.produceAreaList && scope.row.produceAreaList.length !== 0) ?
                    areaLabel(scope.row.produceAreaList) : '------'}}
                </template>
            </el-table-column>
            <el-table-column
                width="100px"
                align="center"
                label="分类">
                <template slot-scope="scope">
                    {{scope.row.categoryList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="typeList"
                align="center"
                min-width="100px"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.typeList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                v-if="model === 'CANCEL'"
                align="center"
                label="操作"
                class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="remove-btn"
                               @click="cancelLinkProgramme(scope.$index)">
                        取消关联
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import store from 'store';

    export default {
        name: 'ProgrammeOperateTable',
        // 当前外部选中的节目列表
        props: {
            // 含有三种模型，多选：'MULTIPLE',取消关联：'CANCEL',展示：'DETAIL'
            model: {
                type: String,
                default: ''
            },
            // 节目列表
            programmeList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            // 多选的模式下已选中的节目列表
            selectedProgrammeList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                multipleSelection: []
            };
        },
        methods: {
            // programmeList为节目源数据
            initSelection(programmeList) {
                this.multipleSelection = this.selectedProgrammeList.slice(0);
                // 对于选择的多选项进行勾选
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    for (let k = 0; k < programmeList.length; k++) {
                        if (this.multipleSelection[i].id === programmeList[k].id) {
                            this.$nextTick(function () {
                                this.$refs.programmeTable.toggleRowSelection(programmeList[k], true);
                            });
                        }
                    }
                }
            },
            areaLabel(areaList) {
                return areaList.reduce((res, curr) => {
                    let area = store.get('areaList').find((item) => item.code === curr);
                    return area ? `${res}, ${area.name}` : res;
                }, '').replace(/^,/, '');
            },
            // 多选的模式中选择或取消某一行
            selectRow(selection, row) {
                // 判断当前行为，选择或者取消
                let checkStatus;
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i].id === row.id) {
                        checkStatus = true;
                    }
                }
                if (checkStatus) {
                    for (let k = 0; k < this.multipleSelection.length; k++) {
                        if (this.multipleSelection[k].id === row.id) {
                            return;
                        }
                    }
                    this.multipleSelection.push(row);
                } else {
                    for (let n = 0; n < this.multipleSelection.length; n++) {
                        if (this.multipleSelection[n].id === row.id) {
                            this.multipleSelection.splice(n, 1);
                        }
                    }
                }
                this.$emit('setSelectedProgrammeList', this.multipleSelection);
            },
            // 多选模式下的全选
            selectAll(selections) {
                // 判断是添加还是删除所有当前list
                // 取消全选
                if (selections.length === 0) {
                    for (let i = 0; i < this.programmeList.length; i++) {
                        for (let k = 0; k < this.multipleSelection.length; k++) {
                            if (this.programmeList[i].id === this.multipleSelection[k].id) {
                                this.multipleSelection.splice(k, 1);
                            }
                        }
                    }
                    // 全选添加
                } else {
                    for (let i = 0; i < this.programmeList.length; i++) {
                        let tag = false;
                        // 去掉当前已选择的
                        for (let k = 0; k < this.multipleSelection.length; k++) {
                            if (this.programmeList[i].id === this.multipleSelection[k].id) {
                                tag = true;
                            }
                        }
                        // 去掉原先已选择的
                        for (let m = 0; m < this.multipleSelection.length; m++) {
                            if (this.programmeList[i].id === this.multipleSelection[m].id) {
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.multipleSelection.push(this.programmeList[i]);
                        }
                    }
                }
                this.$emit('setSelectedProgrammeList', this.multipleSelection);
            },
            // 取消选择
            cancelSelectRow(row) {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (row.id === this.multipleSelection[i].id) {
                        this.multipleSelection.splice(i, 1);
                    }
                }
                for (let i = 0; i < this.programmeList.length; i++) {
                    if (row.id === this.programmeList[i].id) {
                        this.$refs.programmeTable.toggleRowSelection(this.programmeList[i], false);
                    }
                }
            },
            // 取消模式下取消关联
            cancelLinkProgramme(index) {
                this.$emit('cancelLinkProgramme', index);
            },
            // 获取当前选中的节目列表
            getSelectedProgramme() {
                return this.multipleSelection;
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-table {
        margin-top: 0px;
        img {
            width: 70px;
            height: auto;
        }
    }

</style>
