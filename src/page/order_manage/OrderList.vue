<template>
    <!-- 订单管理列表 -->
    <div class="order-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.keyword"
                            clearable
                            class="border-input"
                            @input="inputHandler($event, 'keyword')"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler" icon="el-icon-search" type="primary" plain>搜索</el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">商品</label>
                        <el-select
                            :value="searchFields.visible"
                            @change="inputHandler($event, 'visible')"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in []"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="search-field-item">
                        <label class="search-field-item-label">方式</label>
                        <el-select
                            :value="searchFields.visible"
                            @change="inputHandler($event, 'visible')"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in []"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            :value="searchFields.visible"
                            @change="inputHandler($event, 'visible')"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in []"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="reset"
                            class-name="svg-box">
                        </svg-icon>
                        重置
                    </el-button>
                    <span
                        @click="toggleSearchField"
                        :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                        更多筛选<i v-if="searchFieldVisible" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i><i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                    </span>
                </div>
                <div v-show="searchFieldVisible" class="field-row">
                    <div class="search-field-item">
                        <label class="search-field-item-label">提交时间</label>
                        <el-date-picker
                            :value="searchFields.dateRange"
                            type="daterange"
                            @input="inputHandler($event, 'dateRange')"
                            value-format="timestamp"
                            :unlink-panels="true"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">订单列表</h2>
                <el-table
                    row-class-name=''
                    :header-row-class-name='"common-table-header"'
                    class="my-table-style" :data="state.list" border>
                    <el-table-column align="center" label="订单编号">
                        <template slot-scope="scope">
                            {{scope.row.id | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="提交时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="用户">
                        <template slot-scope="scope">
                            {{scope.row.apkVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品包">
                        <template slot-scope="scope">
                            {{scope.row.apkVersionCode | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单金额">
                        <template slot-scope="scope">
                            {{scope.row.apkVersionCode | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付金额">
                        <template slot-scope="scope">
                            {{scope.row.mac | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付方式">
                        <template slot-scope="scope">
                            {{scope.row.no | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.sdkVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="display(scope.row.id)">查看</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="state.pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="state.pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.pagination.total">
        </el-pagination>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
    name: 'OrderList',
    data() {
        return {
            dialogVisible: false,
            //  toggle搜索区域
            searchFieldVisible: false,
            errLog: {}
        };
    },
    created() {
        this.getClientErrorLogList();
    },
    computed: {
        ...mapGetters({
            state: 'clientErrorLog/state',
            searchFields: 'clientErrorLog/searchFields'
        })
    },
    methods: {
        ...mapMutations({
            updatePagination: 'clientErrorLog/updatePagination',
            updateSearchFields: 'clientErrorLog/updateSearchFields',
            resetSearchFields: 'clientErrorLog/resetSearchFields'
        }),
        ...mapActions({
            getClientErrorLogList: 'clientErrorLog/getClientErrorLogList'
        }),
        toggleSearchField() {
            this.searchFieldVisible = !this.searchFieldVisible;
        },
        display(id) {
            let errLog = this.state.list.find((log) => log.id === id);
            this.errLog = errLog;
            this.dialogVisible = true;
        },
        handlePaginationChange(value, key) {
            this.updatePagination({key, value});
            this.getClientErrorLogList();
        },
        inputHandler(value, key) {
            this.updateSearchFields({key, value});
            this.getClientErrorLogList();
        },
        searchHandler() {
            this.getClientErrorLogList();
        },
        clearSearchFields() {
            this.resetSearchFields();
            this.getClientErrorLogList();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
