<!--商品列表项组件-->
<template>
    <div>
        <el-table
            :data="goodsList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                prop="code"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                min-width="220px"
                label="名称">
                <template slot-scope="scope">
                <span @click="toGoodsDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="goodsList"
                min-width="130px"
                label="包含产品包">
                <template slot-scope="scope">
                    <label v-if="scope.row.goodsList && scope.row.goodsList.length !== 0">
                        {{scope.row.goodsList | jsonJoin('name') }}</label>
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateGoodsStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                    <i v-else class="off-the-shelf">已下架</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editGoods(scope.row)">编辑</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'GoodsOperateTable',
        props: {
            goodsList: {
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
            // 更改单个状态
            updateGoodsStatus(item) {
                this.$confirm('此操作将' + (item.visible ? '下架' : '上架') + item.name + '商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setGoodsVisible(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"商品' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            },
            // 查看详情
            toGoodsDetail(item) {
                this.$router.push({
                    name: 'GoodsDetail',
                    params: {id: item.id}
                });
            },
            editGoods(item) {
                this.$router.push({
                    name: 'EditGoods',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
