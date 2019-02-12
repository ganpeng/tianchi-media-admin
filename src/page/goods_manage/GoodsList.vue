<!--商品管理-商品列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <goods-filter-params
            ref="goodsFilterParams"
            v-on:getGoodsList="getGoodsList">
        </goods-filter-params>
        <div class="content-title">商品列表</div>
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
                label="商品名称">
                <template slot-scope="scope">
                <span class="ellipsis four">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="desc"
                label="描述">
                <template slot-scope="scope">
                    <label>{{scope.row.desc}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="goodsList"
                min-width="130px"
                label="包含产品">
                <template slot-scope="scope">
                    <label v-if="scope.row.goodsList && scope.row.goodsList.length !== 0">
                        {{scope.row.goodsList | jsonJoin('name') }}</label>
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="status"
                label="状态">
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
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="失效时间">
                <template slot-scope="scope">
                    {{scope.row.loseEffectAt | formatDate('yyyy-MM-DD')}}
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
</template>

<script>
    import GoodsFilterParams from './GoodsFilterParams';

    export default {
        name: 'SubjectList',
        components: {
            GoodsFilterParams
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
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>
