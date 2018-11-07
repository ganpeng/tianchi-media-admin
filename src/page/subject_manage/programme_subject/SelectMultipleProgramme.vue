<!--选择多个节目组件-->
<template>
    <div>
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
            :selectedProgrammeList="selectedProgrammeList">
        </programme-operate-table>
        <el-pagination
            @size-change="handleSizeChange"
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
                listQueryParams: {
                    keyword: '',
                    pageNum: 0,
                    pageSize: 5
                },
                pageNum: 1,
                total: 0,
                programmeList: []
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
