<!--内容管理-栏目管理-设置专题内的节目第一步--选择节目组件-->
<template>
    <div>
        <el-table
            :data="programmeList"
            border
            highlight-current-row
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column
                width="55px"
                align="center"
                label="选择">
                <template slot-scope="scope">
                    <el-radio
                        v-model="singleProgramme.id"
                        :label="scope.row.id"
                        @change="selectProgramme(scope.row)">
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column
                width="60px"
                align="center"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.$index + 1}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                label="节目名称">
            </el-table-column>
            <el-table-column
                align="center"
                label="演员">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'SetSubjectProgrammeFirst',
        props: ['programmeList', 'currentState'],
        data() {
            return {
                singleProgramme: {}
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            tableRowClassName({row}) {
                if (row.selected && !row.originProgramme) {
                    return 'warning-row';
                }
                if (row.originProgramme) {
                    return 'current-row';
                }
                return '';
            },
            // 选择某一个专题
            selectProgramme(item) {
                if (!item) {
                    return;
                }
                if (item.selected && !item.originProgramme) {
                    this.$message({
                        message: '当前节目已经选过，请选择其它节目',
                        type: 'warning'
                    });
                    this.$emit('resetProgramme');
                    this.singleProgramme = {};
                    return;
                }
                this.$emit('setProgramme', item);
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
