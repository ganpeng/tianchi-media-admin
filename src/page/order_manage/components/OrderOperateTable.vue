<!--订单列表table组件-->
<template>
    <el-table
        :data="orderList"
        header-row-class-name="common-table-header"
        border
        class="my-table-style"
        style="width: 100%">
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
        </el-table-column>
        <el-table-column
            prop="subjectName"
            align="center"
            min-width="120px"
            label="商品包">
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
                {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
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
</template>

<script>
    import _ from 'lodash';
    import role from '../../../util/config/role';
    export default {
        name: 'OrderOperateTable',
        props: {
            orderList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
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
            toOrderDetail(item) {
                this.$router.push({name: 'OrderDetail', params: {id: item.id}});
            }
        }
    };
</script>

<style scoped>

</style>
