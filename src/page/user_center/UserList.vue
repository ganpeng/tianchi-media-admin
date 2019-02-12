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
                            disabled="disabled"
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
                        prop="id"
                        align="center"
                        width="120px"
                        label="ID">
                    </el-table-column>
                    <el-table-column
                        prop="bossId"
                        align="center"
                        width="120px"
                        label="BOSS编号">
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
                        prop="ownDistrict"
                        label="所属区域">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="stbList"
                        label="设备编号">
                        <template slot-scope="scope">
                            <label v-if="!scope.row.stbList || scope.row.stbList.length === 0">------</label>
                            <div v-else
                                 v-for="(item, index) in scope.row.stbList"
                                 :key="index">
                                {{item.no}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="caList"
                        label="CA卡号">
                        <template slot-scope="scope">
                            <label v-if="!scope.row.caList || scope.row.caList.length === 0">------</label>
                            <div v-else
                                 v-for="(item, index) in scope.row.caList"
                                 :key="index">
                                {{item.no}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="所购产品">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text"
                                      @click="checkGoodsList(scope.row)">
                                      查看
                                </span>
                            </div>
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
                        label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="status"
                        width="120px"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        label="操作"
                        class="operate">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text disabled" @click="editUserInfo(scope.row)">编辑</span>
                                <span class="btn-text disabled" @click="operateStb(scope.row)">设备</span>
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
        <!--设备操作-->
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
        <!--所购产品-->
        <el-dialog
            title="所购产品"
            :visible.sync="goodsListVisible"
            :close-on-click-modal="false"
            custom-class="normal-dialog"
            width="60%">
            <div v-if="goodsListVisible">
                <el-table
                    :data="currentGoodsList"
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
                        prop="goodsId"
                        align="center"
                        width="120px"
                        label="产品编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="产品名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="bookStatus"
                        label="购买状态">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="140px"
                        label="订购时间">
                        <template slot-scope="scope">
                            {{scope.row.bookAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="140px"
                        label="订购生效时间">
                        <template slot-scope="scope">
                            {{scope.row.takeEffectAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="140px"
                        label="订购失效时间">
                        <template slot-scope="scope">
                            {{scope.row.loseEffectAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="goodsListVisible = false">关闭</el-button>
            </span>
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
                goodsListVisible: false,
                currentUserInfo: {},
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                userList: [],
                currentGoodsList: []
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
            // 查看所购产品
            checkGoodsList() {
                this.goodsListVisible = true;
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

    .disabled-stb {
        margin-left: 10px;
        color: $baseRed;
    }

    .operate-stb {
        margin-left: 0px;
    }

    .el-pagination {
        margin-top: 10px;
    }

</style>
