<!--管理员登录列表项组件-->
<template>
    <div>
        <el-table
            :data="adminLoginList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                label="登录时间">
                <template slot-scope="scope">
                    {{scope.row.loginAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="id"
                label="浏览器/终端版本">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                label="操作系统">
            </el-table-column>
            <el-table-column
                align="center"
                prop="email"
                label="设备名称">
            </el-table-column>
            <el-table-column
                align="center"
                prop="mobile"
                label="MAC 地址">
            </el-table-column>
            <el-table-column
                align="center"
                prop="department"
                label="登录 IP">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'AdminLoginTable',
        props: {
            adminLoginList: {
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
