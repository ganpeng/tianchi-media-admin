<!--选择多个节目组件-->
<template>
    <div id="select-multiple-programme" class="text-left">
        <div id="selected-tags">
            <div>
                <span>已选{{localSelectedProgrammeList.length}}项</span>
                <label
                    @click="tagListVisible = false"
                    v-if="tagListVisible && localSelectedProgrammeList.length !== 0">
                    收起
                    <i class="el-icon-arrow-up"></i>
                </label>
                <label
                    @click="tagListVisible = true"
                    v-if="!tagListVisible && localSelectedProgrammeList.length !== 0">
                    展开
                    <i class="el-icon-arrow-down"></i>
                </label>
            </div>
            <p v-if="tagListVisible && localSelectedProgrammeList.length !== 0">
                <el-tag
                    v-for="(item, index) in localSelectedProgrammeList"
                    :key="index"
                    :disable-transitions="true"
                    @close="cancelSelectedProgramme(item)"
                    closable>
                    {{item.name}}
                </el-tag>
            </p>
        </div>
        <div class="search-field-item" @keyup.enter="getProgrammeList">
            <el-input
                v-model="listQueryParams.keyword"
                @change="getProgrammeList"
                clearable
                class="border-input"
                placeholder="节目名称等">
            </el-input>
            <el-button
                class="btn-style-one"
                @click="getProgrammeList"
                icon="el-icon-search"
                type="primary"
                plain>
                搜索
            </el-button>
        </div>
        <programme-operate-table
            ref="programmeOperateTable"
            model="MULTIPLE"
            :programmeList="programmeList"
            :selectedProgrammeList="localSelectedProgrammeList"
            v-on:setSelectedProgrammeList="setSelectedProgrammeList">
        </programme-operate-table>
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import ProgrammeOperateTable from './ProgrammeOperateTable';

    export default {
        name: 'SelectMultipleProgramme',
        components: {
            ProgrammeOperateTable
        },
        // 当前外部选中的节目列表
        props: {
            selectedProgrammeList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                // 本地选择节目列表
                localSelectedProgrammeList: this.selectedProgrammeList,
                listQueryParams: {
                    keyword: '',
                    pageNum: 0,
                    pageSize: 5
                },
                pageNum: 1,
                total: 0,
                programmeList: [],
                tagListVisible: true
            };
        },
        mounted() {
            this.getProgrammeList();
        },
        methods: {
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
                        this.total = response.data.total;
                        // 初始化节目列表的勾选项
                        this.$refs.programmeOperateTable.initSelection(this.programmeList);
                    }
                });
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getProgrammeList();
            },
            // 节目列表选择或取消节目
            setSelectedProgrammeList(programmeList) {
                this.localSelectedProgrammeList = programmeList;
            },
            // 取消选择某一个节目
            cancelSelectedProgramme(programme) {
                this.$refs.programmeOperateTable.cancelSelectRow(programme);
            },
            // 获取选择的节目列表
            getSelectedProgrammeList() {
                return this.$refs.programmeOperateTable.getSelectedProgramme();
            }
        }
    };
</script>

<style lang="scss" scoped>

    #selected-tags {
        div {
            margin-top: -30px;
            height: 45px;
            border-bottom: 1px solid #3E495E;
            span {
                margin-right: 60px;
                padding-left: 5px;
                height: 45px;
                line-height: 55px;
                font-size: 14px;
                color: #FFFFFF;
            }
            label {
                font-size: 14px;
                color: #1989FA;
                cursor: pointer;
                i {
                    color: #3E495E;
                }
            }
        }
        p {
            padding-top: 10px;
            border-bottom: 1px solid #3E495E;
            max-height: 264px;
            overflow-y: scroll;
        }
    }

    .search-field-item {
        margin-top: 24px;
        margin-left: 40px;
        margin-bottom: 20px;
        .el-input {
            margin-right: 20px;
            width: 180px;
        }
    }

</style>

<style lang="scss">

    #select-multiple-programme {
        .el-tag {
            margin-bottom: 10px;
            margin-right: 10px;
            background: #1989FA;
            border-radius: 4px;
            font-size: 14px;
            color: #FFFFFF;
            .el-icon-close {
                height: 20px;
                width: 20px;
                line-height: 20px;
                background: #C0C4CC;
            }
            &:hover {
                .el-icon-close {
                    background: #C35757;
                    color: #409EFF;
                }
            }
        }
        .el-pagination__sizes {
            display: none;
        }
    }

</style>
