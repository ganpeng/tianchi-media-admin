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
            prop="mobile"
            align="center"
            width="120px"
            label="用户账号">
            <template slot-scope="scope">
                <span @click="toUserDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.mobile}}
                </span>
            </template>
        </el-table-column>
        <el-table-column
            prop="caNo"
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
            label="注册来源">
            <template slot-scope="scope">
                <div>TV</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="registeredAt"
            label="注册时间">
            <template slot-scope="scope">
                <div>{{scope.row.registeredAt | formatDate('yyyy-MM-DD')}}</div>
            </template>
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
        },
        methods: {
            toUserDetail(item) {
                this.$router.push({
                    name: 'UserDetail',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<style scoped>

</style>
