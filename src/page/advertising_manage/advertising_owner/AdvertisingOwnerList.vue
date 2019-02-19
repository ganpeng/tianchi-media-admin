<!-- 广告主列表页  -->
<template>
    <div class="advertising-owner-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
        </div>
        <div class="search-field">
            <div class="field-row">
                <div class="search-field-item">
                    <el-input
                        :value="searchFields.keyword"
                        placeholder="请输入主名称或编号"
                        @input="inputHandler($event, 'keyword')"
                        clearable
                        class="border-input"
                    >
                    </el-input>
                </div>
                <el-button class="btn-style-one" @click="searchHandler" type="primary">
                    <svg-icon icon-class="search"></svg-icon>
                    搜索
                </el-button>
                <div class="search-field-item">
                    <label class="search-field-item-label">广告类型</label>
                    <el-select
                        :value="searchFields.typeIdList"
                        clearable
                        placeholder="请选择广告类型"
                        @input="inputHandler($event, 'typeIdList')"
                    >
                        <el-option
                            v-for="(item, index) in []"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">资源类型</label>
                    <el-select
                        :value="searchFields.typeIdList"
                        clearable
                        placeholder="请选择资源类型"
                        @input="inputHandler($event, 'typeIdList')"
                    >
                        <el-option
                            v-for="(item, index) in []"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">状态</label>
                    <el-select
                        :value="searchFields.record"
                        clearable
                        placeholder="请选择广告状态"
                        @input="inputHandler($event, 'record')"
                    >
                        <el-option
                            v-for="(item, index) in []"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button class="btn-style-one" type="primary" @click="clearSearchFields">
                    <svg-icon icon-class="reset"></svg-icon>
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
                    <label class="search-field-item-label">创建时间</label>
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
        <div class="tabel-field">
            <h2 class="content-title">广告主列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left"></div>
                <div class="float-right">
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="addAdvertisingOwner">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                </div>
            </div>
            <el-table header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                <el-table-column prop="code" align="center" width="120px" label="编号"></el-table-column>
                <el-table-column prop="innerName" align="center" min-width="120px" label="广告主名称">
                    <template slot-scope="scope">
                        <span @click="displayLiveChannel(scope.row.id)" class="ellipsis two name">
                            {{scope.row.innerName}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" min-width="120px" label="广告主备注">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.name}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" min-width="120px" align="center" label="广告资源">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.id}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" min-width="120px" align="center" label="所投广告">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.id}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column width="220px" align="center" label="操作">
                    <!-- <template slot-scope="scope"> -->
                        <div id="channel-operator" class="operator-btn-wrapper">
                            <span class="btn-text">编辑</span>
                            <span class="btn-text text-danger">删除</span>
                        </div>
                    <!-- </template> -->
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[10, 20, 50,100, 200, 500]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'AdvertisingOwnerList',
    data() {
        return {
            searchFieldVisible: false
        };
    },
    created() {},
    computed: {
        ...mapGetters({
            list: 'advertising/list',
            pagination: 'advertising/pagination',
            searchFields: 'advertising/searchFields'
        })
    },
    methods: {
        addAdvertisingOwner() {},
        inputHandler() {},
        searchHandler() {},
        clearSearchFields() {},
        handlePaginationChange() {},
        toggleSearchField() {
            this.searchFieldVisible = !this.searchFieldVisible;
        }
    }
};
</script>
<style lang="scss" scoped>

</style>
