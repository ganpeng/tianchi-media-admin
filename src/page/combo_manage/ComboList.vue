<!--套餐管理-套餐列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <combo-filter-params
            ref="comboFilterParams"
            v-on:getComboList="getComboList">
        </combo-filter-params>
        <div class="content-title">套餐列表</div>
        <div class="table-operator-field">
            <div class="float-left">
                <sort-item :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
            </div>
            <el-button
                class="btn-style-two contain-svg-icon"
                @click="createCombo">
                <svg-icon icon-class="add"></svg-icon>
                添加
            </el-button>
        </div>
        <combo-operate-table
            ref="comboOperateTable"
            :comboList="comboList"
            :setComboList="setComboList"
            v-on:getComboList="getComboList">
        </combo-operate-table>
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
    import ComboFilterParams from '../search_filter_params/ComboFilterParams';
    import ComboOperateTable from './components/ComboOperateTable';
    import SortItem from 'sysComponents/custom_components/custom/SortItem';
    export default {
        name: 'ComboList',
        components: {
            ComboFilterParams,
            ComboOperateTable,
            SortItem
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                comboList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('comboFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('comboFilter');
                    this.$refs.comboFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getComboList();
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getComboList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getComboList();
            },
            getComboList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('comboFilter', this.listQueryParams);
                this.$service.getComboList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.comboList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            createCombo() {
                if (!this.$authority.isHasAuthority('user:membershipScheme:add')) {
                    return;
                }
                this.$router.push({name: 'CreateCombo'});
            },
            // dev2.9新增
            setComboList(list) {
                this.comboList = list;
            },
            sortQueryChangeHandler(obj) {
                let {sortKey, sortDirection} = obj;
                this.listQueryParams.sortKey = sortKey;
                this.listQueryParams.sortDirection = sortDirection;
                this.getComboList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>
