<!--用户列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'用户中心'},
            {name:'用户列表'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <user-filter-params
                v-on:getUserList="getUserList">
            </user-filter-params>
            <el-table
                :data="userList"
                header-row-class-name="common-table-header"
                border
                style="width: 100%">
                <el-table-column
                    align="center"
                    width="60px"
                    label="序号">
                    <template slot-scope="scope">
                        <label>{{scope.$index + 1}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="140px"
                    prop="name"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="fullAddress"
                    label="地址">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="200px"
                    prop="identityId"
                    label="身份证号">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="stbList"
                    label="设备ID">
                    <template slot-scope="scope">
                        <label v-if="!scope.row.stbList || scope.row.stbList.length === 0">------
                        </label>
                        <label v-else>{{scope.row.stbList | jsonJoin('no')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="150px"
                    prop="mobile"
                    label="手机">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="telephone"
                    width="150px"
                    label="电话">
                    <template slot-scope="scope">
                        <label>{{scope.row.telephone ? scope.row.telephone : '-------'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120px"
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.registeredAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120px"
                    label="操作"
                    class="operate">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="checkUserDetailInfo(scope.row)"
                            class="detail-btn">
                            查看
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="editUserInfo(scope.row)">
                            编辑
                        </el-button>
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
                :total="total">
            </el-pagination>
            <div class="create-item">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-circle-plus-outline"
                    @click="toCreateUser">
                    创建用户
                </el-button>
            </div>
        </div>
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
                total: 0,
                userList: []
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
                this.$service.getUserList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.userList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getUserList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getUserList();
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
            },
            toCreateUser() {
                this.$router.push({name: 'CreateUser'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .block-box {
        position: relative;
        padding-top: 80px;
    }

    .create-item {
        position: absolute;
        right: 0px;
        top: 10px;
    }

    .el-table {
        margin: 0px;
    }

    .el-pagination {
        margin-top: 20px;
        margin-bottom: 126px;
    }

</style>
