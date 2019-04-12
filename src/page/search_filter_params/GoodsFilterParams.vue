<!--商品列表搜索参数设置组件-->
<template>
    <div class="subject-search-container">
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
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearFilters"
                        type="primary">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
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
                listQueryParams: {
                    createdAtBegin: '',
                    createdAtEnd: '',
                    keyword: '',
                    productId: ''
                },
                productOptions: [],
                createRangeTime: [],
                visibleOptions: [{
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '禁播'
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
                this.listQueryParams.createdAtBegin = params.createdAtBegin ? params.createdAtBegin : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.createRangeTime = params.createdAtBegin ? [params.createdAtBegin, params.createdAtEnd] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.productId = params.productId ? params.productId : '';
            },
            getGoodsList(isReset) {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtBegin = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtBegin = '';
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

    .subject-search-container {
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

</style>
