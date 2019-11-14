<!--搜索用户参数设置组件-->
<template>
    <div class="order-search-container">
        <div @keyup.enter="getOrderList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getOrderList(true)"
                        clearable
                        class="border-input"
                        placeholder="搜索订单编号、用户等">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getOrderList(true)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="商品">
                    <el-select
                        v-model="listQueryParams.membershipSchemeId"
                        @change="getOrderList(true)"
                        clearable
                        filterable
                        placeholder="全部">
                        <el-option
                            v-for="item in productOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="方式">
                    <el-select
                        v-model="listQueryParams.paymentMethod"
                        @change="getOrderList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in payWayOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.orderStatus"
                        @change="getOrderList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearSearchFields"
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
                <el-form-item label="提交时间">
                    <el-date-picker
                        v-model="commitDateRange"
                        type="daterange"
                        @change="getOrderList(true)"
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

    import role from '../../util/config/role';

    export default {
        name: 'OrderFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    membershipSchemeId: '',
                    orderStatus: '',
                    paymentMethod: '',
                    createdAtStart: '',
                    createdAtEnd: ''
                },
                commitDateRange: [],
                productOptions: [],
                payWayOptions: role.PAY_WAY_OPTIONS,
                statusOptions: role.PAY_STATUS_OPTIONS,
                moreFilters: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getComboList({
                    pageNum: 1,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.productOptions = response.data.list;
                    }
                });
            },
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.membershipSchemeId = params.membershipSchemeId !== '' ? params.membershipSchemeId : '';
                this.listQueryParams.orderStatus = params.orderStatus ? params.orderStatus : '';
                this.listQueryParams.paymentMethod = params.paymentMethod ? params.paymentMethod : '';
                this.listQueryParams.createdAtStart = params.createdAtStart ? params.createdAtStart : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.commitDateRange = params.createdAtStart ? [params.createdAtStart, params.createdAtEnd] : [];
            },
            getOrderList(isReset) {
                if (isReset) {
                    if (!this.$authority.isHasAuthority('user:order:page')) {
                        for (let key in this.listQueryParams) {
                            if (Array.isArray(this.listQueryParams[key])) {
                                this.listQueryParams[key] = [];
                            } else {
                                this.listQueryParams[key] = '';
                            }
                        }
                        this.commitDateRange = [];
                        return;
                    }
                }
                if (this.commitDateRange && this.commitDateRange.length === 2) {
                    this.listQueryParams.createdAtStart = this.commitDateRange[0];
                    this.listQueryParams.createdAtEnd = this.commitDateRange[1];
                } else {
                    this.listQueryParams.createdAtStart = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getOrderList', this.listQueryParams, isReset);
            },
            clearSearchFields() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.commitDateRange = [];
                this.getOrderList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .order-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
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
    }

</style>
