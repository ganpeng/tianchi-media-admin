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
                    <div class="float-left">
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="exportOrderPartDataExcel">
                            导出列表
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="exportOrderAllDataExcel">
                            导出全部
                        </el-button>
                    </div>
                </div>
                <order-operate-table
                    :orderList="orderList">
                </order-operate-table>
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
    </div>
</template>

<script>
    import OrderFilterParams from '../search_filter_params/OrderFilterParams';
    import OrderOperateTable from './components/OrderOperateTable';

    export default {
        name: 'OrderList',
        components: {
            OrderFilterParams,
            OrderOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                orderList: [
                    {
                        id: 1,
                        userName: '更上一层楼'
                    }
                ]
            };
        },
        mounted() {
            this.init();
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
            exportOrderPartDataExcel() {
            },
            exportOrderAllDataExcel() {
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>
