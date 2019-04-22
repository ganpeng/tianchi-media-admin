<template>
    <div class="order-detail-container">
        <div class="basic-info">
            <h4 class="content-sub-title" style="margin-left:20px;">基本信息</h4>
            <el-table
                ref="multipleTable"
                header-row-class-name="common-table-header"
                class="my-table-style" :data="[]" border>
                <el-table-column prop="id" align="center" width="118" label="订单编号"></el-table-column>
                <el-table-column prop="originName" align="center" label="产品包"></el-table-column>
                <el-table-column prop="originName" align="center" label="用户"></el-table-column>
                <el-table-column prop="originName" align="center" label="支付方式"></el-table-column>
                <el-table-column prop="originName" align="center" label="订单来源"></el-table-column>
                <el-table-column prop="originName" align="center" label="订单类型"></el-table-column>
            </el-table>
        </div>
        <div class="cost-info">
            <h4 class="content-sub-title" style="margin-left:20px;">费用信息</h4>
            <el-table
                ref="multipleTable"
                header-row-class-name="common-table-header"
                class="my-table-style" :data="[]" border>
                <el-table-column prop="id" align="center" width="118" label="订单金额"></el-table-column>
                <el-table-column prop="originName" align="center" label=""></el-table-column>
                <el-table-column prop="originName" align="center" label=""></el-table-column>
                <el-table-column prop="originName" align="center" label=""></el-table-column>
                <el-table-column prop="originName" align="center" label="应付金额"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'OrderDetail'
};
</script>
<style lang="scss" scoped>

</style>
