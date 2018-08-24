<!--内容管理-栏目管理-以table表格的形式展示单个专题-->
<template>
    <el-table
        :data="singleSubjectList"
        header-row-class-name="common-table-header"
        row-class-name=subject-row
        border
        style="width: 100%">
        <el-table-column
            align="center"
            prop="code"
            width="120px"
            label="编号">
        </el-table-column>
        <el-table-column
            align="center"
            width="186px"
            prop="name"
            label="名称">
        </el-table-column>
        <el-table-column
            align="center"
            width="140px"
            prop="itemCount"
            label="包含节目/人物数">
            <template slot-scope="scope">
                <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="category"
            label="专题类型">
            <template slot-scope="scope">
                <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="programmeCategoryList"
            label="节目专题类型">
            <template slot-scope="scope">
                <label v-if="scope.row.programmeCategoryList && scope.row.programmeCategoryList.length !== 0">
                    {{scope.row.programmeCategoryList | jsonJoin('name') }}</label>
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="创建时间">
            <template slot-scope="scope">
                {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
                <i class="status-normal" v-if="scope.row.visible">已上架</i>
                <i class="status-abnormal" v-else>已下架</i>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'SingleSubjectTable',
        props: {
            singleSubjectList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
