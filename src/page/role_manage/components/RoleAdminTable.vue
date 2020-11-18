<!--角色详情管理员列表项组件-->
<template>
    <div>
        <el-table
            :data="roleAdminList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                prop="name"
                width="120px"
                label="姓名">
            </el-table-column>
            <el-table-column
                align="center"
                prop="departmentList"
                min-width="220px"
                label="部门">
                <template slot-scope="scope">
                    {{scope.row.departmentList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm:SS')}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'RoleAdminTable',
        props: {
            roleAdminList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
