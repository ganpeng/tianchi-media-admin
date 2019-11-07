<!--商品管理-商品列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <goods-filter-params
            ref="goodsFilterParams"
            v-on:getGoodsList="getGoodsList">
        </goods-filter-params>
        <div class="content-title">商品列表</div>
        <div class="table-operator-field">
            <div></div>
            <el-button
                class="btn-style-two contain-svg-icon"
                @click="createGoods">
                <svg-icon icon-class="add"></svg-icon>
                添加
            </el-button>
        </div>
        <goods-operate-table
            ref="goodsOperateTable"
            :goodsList="goodsList"
            v-on:getGoodsList="getGoodsList">
        </goods-operate-table>
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
</template>

<script>
    import GoodsFilterParams from '../search_filter_params/GoodsFilterParams';
    import GoodsOperateTable from './components/GoodsOperateTable';

    export default {
        name: 'GoodsList',
        components: {
            GoodsFilterParams,
            GoodsOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                goodsList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('goodsFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('goodsFilter');
                    this.$refs.goodsFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getGoodsList();
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getGoodsList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getGoodsList();
            },
            getGoodsList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('goodsFilter', this.listQueryParams);
                this.$service.getGoodsList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.goodsList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            createGoods() {
                this.$router.push({name: 'CreateGoods'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>
