<!--管理员登录列表项组件-->
<template>
    <div>
        <el-table
            :data="logList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                label="登录时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="brower"
                label="浏览器/终端版本">
            </el-table-column>
            <el-table-column
                align="center"
                prop="os"
                label="操作系统">
            </el-table-column>
            <el-table-column
                align="center"
                prop="ip"
                label="登录 IP">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'AdminLoginTable',
        props: {
            logList: {
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

<style lang="scss" scoped>

</style>
