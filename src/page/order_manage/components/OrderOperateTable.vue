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
                <div @click="toOrderDetail(scope.row)">{{scope.row.id}}</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="userName"
            align="center"
            min-width="120px"
            label="用户">
        </el-table-column>
        <el-table-column
            prop="caId"
            align="center"
            min-width="120px"
            label="商品包">
        </el-table-column>
        <el-table-column
            align="center"
            min-width="120px"
            prop="fullAddress"
            label="订单金额">
        </el-table-column>
        <el-table-column
            align="center"
            prop="ownDistrict"
            min-width="120px"
            label="支付金额">
        </el-table-column>
        <el-table-column
            align="center"
            prop="fullAddress"
            min-width="120px"
            label="支付方式">
        </el-table-column>
        <el-table-column
            align="center"
            min-width="120px"
            label="提交时间">
            <template slot-scope="scope">
                {{scope.row.registeredAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="status"
            width="120px"
            label="状态">
        </el-table-column>
    </el-table>
</template>

<script>
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
        methods: {
            toOrderDetail(item) {
                this.$router.push({name: 'OrderDetail', params: {id: item.id}});
            }
        }
    };
</script>

<style scoped>

</style>
