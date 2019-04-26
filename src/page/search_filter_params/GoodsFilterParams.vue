<!--商品列表搜索参数设置组件-->
<template>
    <div class="goods-search-container">
        <div @keyup.enter="getGoodsList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getGoodsList(true)"
                        clearable
                        class="border-input"
                        placeholder="商品编号、名称等">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getGoodsList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="产品包">
                    <el-select
                        v-model="listQueryParams.productId"
                        @change="getGoodsList(true)"
                        filterable
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in productOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getGoodsList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearFilters"
                        type="primary">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="text"
                        @click="moreFilters = !moreFilters"
                        class="more-filters"
                        :class="{active:moreFilters}">
                        更多筛选
                        <i class="el-icon-arrow-up" v-if="moreFilters"></i>
                        <i class="el-icon-arrow-down" v-else></i>
                    </el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="more-filter-box filter-form" v-if="moreFilters">
                <el-form-item label="创建时间">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="createRangeTime"
                        type="daterange"
                        @change="getGoodsList(true)"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'GoodsFilterParams',
        data() {
            return {
                moreFilters: false,
                listQueryParams: {
                    createdAtStart: '',
                    createdAtEnd: '',
                    keyword: '',
                    productId: '',
                    visible: ''
                },
                productOptions: [],
                createRangeTime: [],
                visibleOptions: [{
                    value: true,
                    label: '已上架'
                }, {
                    value: false,
                    label: '已下架'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getProductList({
                    pageNum: 1,
                    pageSize: 10000,
                    orderList: 'ID_DESC'
                }).then(response => {
                    if (response && response.code === 0) {
                        this.productOptions = response.data.list;
                    }
                });
            },
            initFilterParams(params) {
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
                this.listQueryParams.createdAtStart = params.createdAtStart ? params.createdAtStart : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.createRangeTime = params.createdAtStart ? [params.createdAtStart, params.createdAtEnd] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.productId = params.productId ? params.productId : '';
            },
            getGoodsList(isReset) {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtStart = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtStart = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getGoodsList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.createRangeTime = [];
                this.getGoodsList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .goods-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }
    }

    // 按钮
    .more-filters {
        font-size: 12px;
        color: #6F7480;
        &.active {
            color: #1989FA;
            i {
                color: #6F7480;
            }
        }
        i {
            margin-left: 8px;
        }
    }

    .more-filter-box {
        background: #252C3D;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

</style>
