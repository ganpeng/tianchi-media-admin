<!--内容管理-栏目管理-以table表格的形式展示一个人物-->
<template>
    <el-table
        :data="singleFigureList"
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
            label="头像">
            <template slot-scope="scope">
                <img v-if="scope.row.avatarImage"
                     :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                     :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="description"
            label="人物简介">
            <template slot-scope="scope">
                <label class="ellipsis-three">{{scope.row.description}}</label>
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
            prop="area"
            label="地区">
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
