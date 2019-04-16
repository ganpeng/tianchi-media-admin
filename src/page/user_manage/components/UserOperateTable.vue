<!--用户列表table组件-->
<template>
    <el-table
        :data="userList"
        header-row-class-name="common-table-header"
        border
        class="my-table-style"
        style="width: 100%">
        <el-table-column
            prop="id"
            align="center"
            width="120px"
            label="用户编号">
        </el-table-column>
        <el-table-column
            prop="bossId"
            align="center"
            width="120px"
            label="用户账号">
        </el-table-column>
        <el-table-column
            prop="caId"
            align="center"
            width="120px"
            label="CA">
        </el-table-column>
        <el-table-column
            align="center"
            prop="fullAddress"
            label="CA到期日">
        </el-table-column>
        <el-table-column
            align="center"
            prop="ownDistrict"
            label="会员">
        </el-table-column>
        <el-table-column
            align="center"
            prop="fullAddress"
            label="会员到期日">
        </el-table-column>
        <el-table-column
            align="center"
            prop="fullAddress"
            label="注册来源">
        </el-table-column>
        <el-table-column
            align="center"
            width="120px"
            label="注册时间">
            <template slot-scope="scope">
                {{scope.row.registeredAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="120px"
            label="最后登录">
            <template slot-scope="scope">
                {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="status"
            width="120px"
            label="APP版本">
        </el-table-column>
        <el-table-column
            align="center"
            prop="status"
            width="120px"
            label="TV版本">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'UserOperateTable',
        props: {
            userList: {
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

<style scoped>

</style>
