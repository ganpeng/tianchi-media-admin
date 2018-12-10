<!--节目包选择多个节目组件-->
<template>
    <div>
        <programme-filter-params
            v-on:getProgrammeList="getProgrammeList">
        </programme-filter-params>
        <el-table
            :data="programmeList"
            header-row-class-name="common-table-header"
            border
            row-class-name=programme-row
            ref="selectProgramme"
            style="width: 100%"
            @select-all="selectAll"
            @select="selectRow">
            <el-table-column
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
                width="80px"
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
                align="center"
                min-width="100px"
                label="演员">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="visible"
                min-width="100px"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.visible ? '已上架' :'已下架'}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-button
            type="primary"
            class="btn-style-two"
            @click="appendProgramme"
            size="small">
            添加
        </el-button>
    </div>
</template>

<script>
    import store from 'store';
    import ProgrammeFilterParams from '../../search_filter_params/ProgrammeFilterParams';

    export default {
        name: 'ProductSelectMultipleProgramme',
        components: {
            ProgrammeFilterParams
        },
        // 当前外部选中的节目列表
        props: ['selectedProgrammeList'],
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                totalAmount: 0,
                programmeList: [],
                multipleSelection: [],
                // 曾经被移除过的节目数组
                removedSelection: []
            };
        },
        mounted() {
        },
        methods: {
            init() {
                // 下架状态的节目可以被选为专题中
                // 初始化选中的项
                for (let i = 0; i < this.selectedProgrammeList.length; i++) {
                    this.multipleSelection.push(this.selectedProgrammeList[i]);
                }
                this.getProgrammeList();
            },
            // 请求数据
            getProgrammeList(searchParams) {
                this.listQueryParams.pageNum = this.pageNum - 1;
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                this.$service.getProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的多选项项进行勾选
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            for (let k = 0; k < this.programmeList.length; k++) {
                                if (this.multipleSelection[i].id === this.programmeList[k].id) {
                                    this.$nextTick(function () {
                                        this.$refs.selectProgramme.toggleRowSelection(this.programmeList[k], true);
                                    });
                                }
                            }
                        }
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getProgrammeList();
            },
            areaLabel(areaList) {
                return areaList.reduce((res, curr) => {
                    let area = store.get('areaList').find((item) => item.code === curr);
                    return area ? `${res}, ${area.name}` : res;
                }, '').replace(/^,/, '');
            },
            // 添加节目
            appendProgramme() {
                this.$emit('setProgramme', this.multipleSelection, this.removedSelection);
            },
            // 将一个节目放入曾经取消的列表中
            pushRemovedSelection(programme) {
                if (this.removedSelection.length === 0) {
                    this.removedSelection.push(programme);
                } else {
                    for (let i = 0; i < this.removedSelection.length; i++) {
                        if (programme.id === this.removedSelection[i]) {
                            return;
                        }
                        if (i === this.removedSelection.length - 1) {
                            this.removedSelection.push(programme);
                            return;
                        }
                    }
                }
            },
            // 将一个节目去除曾经取消的列表中
            spliceRemovedSelection(programme) {
                for (let i = 0; i < this.removedSelection.length; i++) {
                    if (programme.id === this.removedSelection[i].id) {
                        this.removedSelection.splice(i, 1);
                    }
                }
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
                    this.spliceRemovedSelection(row);
                    for (let k = 0; k < this.multipleSelection.length; k++) {
                        if (this.multipleSelection[k].id === row.id) {
                            return;
                        }
                    }
                    this.multipleSelection.push(row);
                } else {
                    // 取消选择
                    this.pushRemovedSelection(row);
                    for (let n = 0; n < this.multipleSelection.length; n++) {
                        if (this.multipleSelection[n].id === row.id) {
                            this.multipleSelection.splice(n, 1);
                        }
                    }
                }
            },
            selectAll(selections) {
                // 判断是添加还是删除所有当前personList
                // 取消全选
                if (selections.length === 0) {
                    for (let i = 0; i < this.programmeList.length; i++) {
                        this.pushRemovedSelection(this.programmeList[i]);
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
                            this.spliceRemovedSelection(this.programmeList[i]);
                            this.multipleSelection.push(this.programmeList[i]);
                        }
                    }
                }
            },
            // 取消关联某一个节目
            cancelSelectRow(row) {
                this.pushRemovedSelection(row);
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (row.id === this.multipleSelection[i].id) {
                        this.multipleSelection.splice(i, 1);
                    }
                }
                for (let i = 0; i < this.programmeList.length; i++) {
                    if (row.id === this.programmeList[i].id) {
                        this.$refs.selectProgramme.toggleRowSelection(this.programmeList[i], false);
                    }
                }
            },
            // 恢复关联某一个节目
            recoverSelectRow(row) {
                this.multipleSelection.push(row);
                this.spliceRemovedSelection(row);
                for (let i = 0; i < this.programmeList.length; i++) {
                    if (row.id === this.programmeList[i].id) {
                        this.$refs.selectProgramme.toggleRowSelection(this.programmeList[i], true);
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-table {
        margin-top: 0px;
        margin-bottom: 10px;
    }

</style>
