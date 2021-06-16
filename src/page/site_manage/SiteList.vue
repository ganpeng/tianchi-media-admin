<!--站点管理-站点列表组件-->
<template>
    <div>
        <div class="table-container">
            <div class="content-title">搜索筛选</div>
            <div class="search-field">
                <div class="field-row" @keyup.enter="getSiteList">
                    <div class="search-field-item">
                        <el-input
                            v-model="listQueryParams.keyword"
                            clearable
                            class="border-input"
                            placeholder="请填写站点名称、token等">
                        </el-input>
                    </div>
                    <el-input v-show="false"></el-input>
                    <el-button class="btn-style-one" @click="getSiteList" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">站点列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <sort-item :sortKeyList="[{label: '创建时间', value: 'CREATED_AT'}]" :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createSite">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-table
            header-row-class-name="common-table-header"
            :data="siteList"
            @sort-change="sortChangeHandler"
            border
            row-class-name=site-row
            style="width: 100%">
            <el-table-column
                align="center"
                width="60px"
                label="序号">
                <template slot-scope="scope">
                    {{scope.$index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="200px"
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="token"
                label="token">
            </el-table-column>
            <el-table-column
                align="center"
                sortable
                prop="createdAt"
                min-width="140px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editSite(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeSite(scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
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
    import _ from 'lodash';
    import SortItem from 'sysComponents/custom_components/custom/SortItem';
    export default {
        name: 'SiteList',
        components: {SortItem},
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                siteList: []
            };
        },
        mounted() {
            this.getSiteList();
        },
        methods: {
            getSiteList() {
                this.$service.getChildSiteList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.siteList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getSiteList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getSiteList();
            },
            createSite() {
                this.$prompt('创建站点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[^\s]{1,15}$/,
                    inputErrorMessage: '站点名称不能为空且最多15字'
                }).then(({value}) => {
                    this.$service.createChildSite({name: value}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('成功创建站点');
                            this.getSiteList();
                        }
                    });
                });
            },
            // 更新站点
            editSite(item) {
                this.$prompt('编辑站点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[^\s]{1,15}$/,
                    inputErrorMessage: '站点名称不能为空且最多15字',
                    inputValue: item.name
                }).then(({value}) => {
                    this.$service.updateChildSite({id: item.id, name: value}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('成功更新站点');
                            this.getSiteList();
                        }
                    });
                });
            },
            // 删除站点
            removeSite(item) {
                this.$confirm('此操作将删除当前站点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteChildSite({id: item.id}).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: item.name + '站点删除成功!'
                            });
                            this.getSiteList();
                        }
                    });
                });
            },
            // dev2.9
            sortChangeHandler(obj) {
                let {prop, order} = obj;
                if (prop === 'createdAt') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.siteList).sortBy('createdAt').value();
                    } else {
                        sortedList = _.chain(this.siteList).sortBy('createdAt').reverse().value();
                    }
                    this.siteList = sortedList;
                }
            },
            sortQueryChangeHandler(obj) {
                let {sortKey, sortDirection} = obj;
                this.listQueryParams.sortKey = sortKey;
                this.listQueryParams.sortDirection = sortDirection;
                this.getSiteList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-input {
        width: 360px;
    }

    .el-table {
        margin-top: 0px;
        margin-bottom: 10px;
    }

</style>
