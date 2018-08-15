<!--选择多个节目组件-->
<template>
    <div>
        <programme-filter-params
            v-on:getProgrammeList="getProgrammeList">
        </programme-filter-params>
        <el-table
            :data="programmeList"
            border
            ref="selectProgramme"
            style="width: 100%"
            header-row-class-name="table-header-row"
            @select="selectRow">
            <el-table-column
                type="selection"
                width="40px">
            </el-table-column>
            <el-table-column
                align="center"
                width="120px"
                prop="code"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.row.code}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="126px"
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                align="center"
                width="120px"
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="description"
                width="210px"
                show-overflow-tooltip
                label="简介">
                <template slot-scope="scope">
                    <label>{{scope.row.description ? scope.row.description : '------'}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="88px"
                prop="featureVideoCount"
                label="正片数量">
            </el-table-column>
            <el-table-column
                align="center"
                width="108px"
                prop="extraVideoCount"
                label="相关视频数量">
            </el-table-column>
            <el-table-column
                width="128px"
                align="center"
                prop="announceAt"
                label="上映时间">
                <template slot-scope="scope">
                    <label v-if="scope.row.announceAt">{{scope.row.announceAt | formatDate('yyyy-MM-DD')}}</label>
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                width="200px"
                align="center"
                prop="produceAreaList"
                label="地区">
                <template slot-scope="scope">
                    {{scope.row.produceAreaList.length !== 0 ? areaLabel(scope.row.produceAreaList) : '------'}}
                </template>
            </el-table-column>
            <el-table-column
                width="140px"
                align="center"
                label="分类">
                <template slot-scope="scope">
                    {{scope.row.categoryList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="typeList"
                align="center"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.typeList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="主演">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="导演">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="visible"
                label="状态">
                <template slot-scope="scope">
                    <i class="status-normal" v-if="scope.row.visible">已上架</i>
                    <i class="status-abnormal" v-else>已下架</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
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
        <el-button type="primary" plain class="apppend-programme" @click="appendProgramme" size="small">添加所选节目
        </el-button>
    </div>
</template>

<script>
    import store from 'store';
    import ProgrammeFilterParams from '../../searchFilterParams/ProgrammeFilterParams';

    export default {
        name: 'SelectMultipleProgramme',
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
                // 单选节目
                singleProgramme: {}
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
                this.$emit('setProgramme', this.multipleSelection);
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
            },
            cancelSelectRow(row) {
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
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-table {
        img {
            width: 100px;
            height: 145px;
        }
        .el-icon-success {
            margin-right: 5px;
            color: #409EFF;
            visibility: hidden;
        }
        .current-row {
            .el-icon-success {
                visibility: visible;
            }
        }
    }

    .apppend-programme {
        margin-top: 30px;
    }
</style>
