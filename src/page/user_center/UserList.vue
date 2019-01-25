<!--用户列表组件-->
<template>
    <div class="user-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <user-filter-params
                v-on:getUserList="getUserList">
            </user-filter-params>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">用户列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="toCreateUser">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                    </div>
                </div>
                <el-table
                    :data="userList"
                    header-row-class-name="common-table-header"
                    border
                    class="my-table-style"
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
                        <template slot-scope="scope">
                            <span
                                @click="checkUserDetailInfo(scope.row)"
                                class="name">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
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
                            <label v-if="!scope.row.stbList || scope.row.stbList.length === 0">------</label>
                            <div
                                v-else
                                v-for="(item, index) in scope.row.stbList"
                                :key="index">
                                {{item.no}}
                                <label v-if="item.status === 'FORBIDDEN'" class="disabled-stb">已禁用</label>
                            </div>
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
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="editUserInfo(scope.row)">编辑</span>
                                <span class="btn-text" @click="operateStb(scope.row)">操作设备</span>
                            </div>
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
            </div>
        </div>
        <el-dialog
            class="my-dialog"
            :title='currentUserInfo.name + "的设备操作"'
            :visible.sync="operateStbDialogVisible"
            width="50%">
            <operate-stb
                v-if="operateStbDialogVisible"
                :userInfo="currentUserInfo"
                v-on:closeDialog="closeDialog">
            </operate-stb>
        </el-dialog>
    </div>
</template>

<script>
    import UserFilterParams from './UserFilterParams';
    import OperateStb from './OperateStb';

    export default {
        name: 'UserList',
        components: {
            UserFilterParams,
            OperateStb
        },
        data() {
            return {
                operateStbDialogVisible: false,
                currentUserInfo: {},
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
            },
            // 操作设备
            operateStb(userInfo) {
                this.currentUserInfo = userInfo;
                this.operateStbDialogVisible = true;
            },
            closeDialog(refresh) {
                this.operateStbDialogVisible = false;
                if (refresh) {
                    this.getUserList();
                }
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

    .disabled-stb {
        margin-left: 10px;
        color: $baseRed;
    }

    .operate-stb {
        margin-left: 0px;
    }

    .el-pagination {
        margin-top: 20px;
        margin-bottom: 126px;
    }

</style>
