<!--内容管理-栏目管理-以table表格的形式展示一个人物-->
<template>
    <el-table
        :data="singleFigureList"
        header-row-class-name="common-table-header"
        row-class-name=figure-row
        border
        style="width: 100%">
        <el-table-column
            prop="id"
            label="编号">
            <template slot-scope="scope">
                <label>{{scope.row.id}}</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名">
        </el-table-column>
        <el-table-column
            label="图片">
            <template slot-scope="scope">
                <img v-if="scope.row.avatarImage"
                     :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                     :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="area"
            label="地区">
        </el-table-column>
        <el-table-column align="center" label="更新时间">
            <template slot-scope="scope">
                {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'SingleFigureTable',
        props: {
            singleFigureList: {
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
        img {
            width: 120px;
        }
        .more {
            float: right;
        }
    }

</style>
