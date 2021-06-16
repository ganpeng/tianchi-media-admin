<!--用户列表组件-->
<template>
    <div class="order-list-container">
        <div class="table-container">
            <div class="content-title">搜索筛选</div>
            <order-filter-params
                ref="orderFilterParams"
                v-on:getOrderList="getOrderList">
            </order-filter-params>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">订单列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left"></div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="exportOrderPartDataExcel">
                            <svg-icon icon-class="import"></svg-icon>
                            导出
                        </el-button>
                    </div>
                </div>
                <el-table
                    :data="orderList"
                    header-row-class-name="common-table-header"
                    @selection-change="handleSelectionChange"
                    border
                    class="my-table-style"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        align="center"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        align="center"
                        width="120px"
                        label="订单编号">
                        <template slot-scope="scope">
                            <span
                                @click="toOrderDetail(scope.row)"
                                class="ellipsis three name">
                                {{scope.row.id | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        align="center"
                        min-width="120px"
                        label="用户">
                        <template slot-scope="scope">
                            <span
                                @click="toOrderDetail(scope.row)"
                                class="ellipsis three">
                                {{scope.row.userInfo.mobile | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="subjectName"
                        align="center"
                        min-width="120px"
                        label="商品">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="120px"
                        label="订单金额">
                        <template slot-scope="scope">
                            {{scope.row.totalAmount | changeMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="120px"
                        label="支付金额">
                        <template slot-scope="scope">
                            {{scope.row.totalAmount | changeMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="paymentMethod"
                        min-width="120px"
                        label="支付方式">
                        <template slot-scope="scope">
                            {{payWay(scope.row.paymentMethod)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        min-width="120px"
                        label="提交时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:MM:SS')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="orderStatus"
                        width="120px"
                        label="状态">
                        <template slot-scope="scope">
                            {{payStatus(scope.row.orderStatus)}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="listQueryParams.pageNum"
                    :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
                    :page-size="listQueryParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import XLSX from 'xlsx';
    import OrderFilterParams from '../search_filter_params/OrderFilterParams';
    import role from '../../util/config/role';

    export default {
        name: 'OrderList',
        components: {
            OrderFilterParams
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                orderList: [],
                //  和导出相关的属性
                multipleSelection: []
            };
        },
        mounted() {
            this.init();
        },
        computed: {
            payWay() {
                return (type) => {
                    return _.get(role.PAY_WAY_OPTIONS.find((item) => item.value === type), 'label');
                };
            },
            payStatus() {
                return (type) => {
                    return _.get(role.PAY_STATUS_OPTIONS.find((item) => item.value === type), 'label');
                };
            }
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('orderFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('orderFilter');
                    this.$refs.orderFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getOrderList();
            },
            getOrderList(searchParams, isReset) {
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$service.getOrderList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.orderList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getOrderList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getOrderList();
            },
            toOrderDetail(item) {
                if (!this.$authority.isHasAuthority('user:order:get')) {
                    return;
                }
                this.$router.push({name: 'OrderDetail', params: {id: item.id}});
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            exportOrderPartDataExcel() {
                if (this.multipleSelection.length === 0) {
                    this.$message.warning(`请先选择订单`);
                    return false;
                }
                let exportChannelData = [];
                // 设置导出的数据
                this.multipleSelection.map(item => {
                    let exportVideo = {};
                    exportVideo['视频编号'] = item.id;
                    exportVideo['用户'] = item.userName;
                    exportVideo['商品包'] = item.subjectName;
                    exportVideo['订单金额'] = item.totalAmount;
                    exportVideo['支付金额'] = item.totalAmount;
                    exportVideo['支付方式'] = this.payWay(item.paymentMethod);
                    exportVideo['提交时间'] = this.$util.formatDate(new Date(item.createdAt), 'yyyy-MM-DD HH:mm:SS');
                    exportVideo['支付状态'] = this.payStatus(item.host);
                    exportChannelData.push(exportVideo);
                });
                let wb = XLSX.utils.book_new();
                let newWsName = '表1';
                let ws = XLSX.utils.json_to_sheet(exportChannelData);
                XLSX.utils.book_append_sheet(wb, ws, newWsName);
                XLSX.writeFile(wb, '视频下载列表_' + new Date() + '.xlsx');
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>
