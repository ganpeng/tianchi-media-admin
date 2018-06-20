<!--内容管理-栏目管理-设置专题内的节目第一步--选择节目组件-->
<template>
    <div>
        <el-table
            ref="singleProgrammeTable"
            :data="programmeList"
            border
            highlight-current-row
            @current-change="selectProgramme"
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column
                width="60px"
                label="编号">
                <template slot-scope="scope">
                    <label><i class="el-icon-success"></i>{{scope.$index + 1}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="节目名称">
            </el-table-column>
            <el-table-column
                label="主演">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                label="导演">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="area"
                label="地区">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'SetSubjectProgrammeFirst',
        props: ['programmeList'],
        data() {
            return {};
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            tableRowClassName({row}) {
                if (row.selected) {
                    return 'warning-row';
                }
                return '';
            },
            // 选择某一个专题
            selectProgramme(item) {
                if (!item) {
                    return;
                }
                if (item.selected) {
                    this.$message({
                        message: '当前节目已经选过，请选择其它节目',
                        type: 'warning'
                    });
                    this.$refs.singleProgrammeTable.setCurrentRow();
                    return;
                }
                this.$emit('setProgramme', item);
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-table {
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
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

</style>
