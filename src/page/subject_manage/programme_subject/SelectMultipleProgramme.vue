<!--选择多个节目组件-->
<template>
    <div>
        <div>
            <div>
                <span>已选{{localSelectedProgrammeList.length}}项</span>
                <label @click="tagListVisible = false">收起</label>
                <label @click="tagListVisible = true">展开</label>
            </div>
            <p v-if="tagListVisible">
                <el-tag v-for="(item, index) in localSelectedProgrammeList" :key="index">
                    {{item.name}}
                    <span @click="cancelSelectedProgramme(item,index)">X</span>
                </el-tag>
            </p>
        </div>
        <div class="search-field-item">
            <el-input
                v-model="listQueryParams.keyword"
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
            id="select-multiple-programme"
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
        props: ['selectedProgrammeList'],
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
            cancelSelectedProgramme(programme, index) {
                this.$refs.programmeOperateTable.cancelSelectRow(programme);
                this.localSelectedProgrammeList.splice(index, 1);
            },
            // 获取选择的节目列表
            getSelectedProgrammeList() {
                return this.$refs.programmeOperateTable.getSelectedProgramme();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .search-field-item {
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
        .el-pagination__sizes {
            display: none;
        }
    }

</style>
