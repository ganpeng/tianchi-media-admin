<!--用户列表组件-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户中心</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <user-filter-params
            v-on:getUserList="getUserList">
        </user-filter-params>
        <el-table
            :data="userList"
            border
            style="width: 100%">
            <el-table-column
                width="60px"
                label="序号">
                <template slot-scope="scope">
                    <label>{{scope.$index + 1}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
            <el-table-column
                prop="nationalId"
                label="身份证号">
            </el-table-column>
            <el-table-column
                prop="deviceIdList"
                label="设备ID">
                <template slot-scope="scope">
                    <label>{{scope.row.deviceIdList | jsonJoin('id')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="telephone"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机">
            </el-table-column>
            <el-table-column
                label="账号创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="checkUserDetailInfo(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="editUserInfo(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
    </div>
</template>

<script>
    import UserFilterParams from './UserFilterParams';

    export default {
        name: 'UserList',
        components: {
            UserFilterParams
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                totalAmount: 0,
                userList: [
                    {
                        id: '334',
                        name: '欧阳锋',
                        address: '河北省石家庄市栾城区7号',
                        nationalId: '1302338347408484X',
                        deviceIdList: [{id: '2323232323'}, {id: '5555567777'}],
                        telephone: '0311-45878743',
                        mobile: '15022547876',
                        createdAt: 2342342344343
                    }
                ]
            };
        },
        mounted() {
            this.getUserList();
        },
        methods: {
            getUserList(searchParams) {
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
            },
            handleSizeChange() {
                this.getSubjectList();
            },
            handleCurrentChange() {
                this.getSubjectList();
            },
            checkUserDetailInfo(row) {
                this.$router.push({
                    name: 'UserDetailInfo',
                    params: {id: row.id}
                });
            },
            editUserInfo(row) {
                this.$router.push({
                    name: 'EditUserInfo',
                    params: {id: row.id}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-breadcrumb {
        margin-bottom: 50px;
    }

</style>
