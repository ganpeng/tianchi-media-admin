<!--内容管理-栏目管理-以table表格的形式展示单个专题-->
<template>
    <el-table
        :data="singleSubjectList"
        border
        style="width: 100%">
        <el-table-column
            prop="code"
            width="60px"
            label="编号">
            <template slot-scope="scope">
                <label>{{scope.row.code}}</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称">
        </el-table-column>
        <el-table-column
            label="包含节目/人物数">
            <template slot-scope="scope">
                <label>{{scope.row.subjectItemList ? scope.row.subjectItemList.length : 0}}</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="description"
            label="简介">
            <template slot-scope="scope">
                <label>{{scope.row.description}}</label>
                <el-popover
                    placement="right"
                    :title="scope.row.name + '简介'"
                    width="250"
                    trigger="hover"
                    :content="scope.row.description">
                    <el-button slot="reference" type="text" class="more">更多</el-button>
                </el-popover>
            </template>
        </el-table-column>
        <el-table-column
            prop="tagList"
            label="专题标签">
            <template slot-scope="scope">
                <label>{{scope.row.tagList ? scope.row.tagList.join(',') : '-------'}}</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="owner"
            label="专题创建者">
        </el-table-column>
        <el-table-column
            prop="category"
            label="专题类型">
            <template slot-scope="scope">
                <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="节目专题类型">
            <template slot-scope="scope">
                <label>{{scope.row.type ? scope.row.type : '------' }}</label>
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

    .el-table {
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }
    }

</style>
