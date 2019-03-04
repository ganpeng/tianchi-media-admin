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
                        :value="searchFields.adType"
                        clearable
                        placeholder="请选择广告类型"
                        @input="inputHandler($event, 'adType')"
                    >
                        <el-option
                            v-for="(item, index) in adTypeOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">是否上架</label>
                    <el-select
                        :value="searchFields.adVisible"
                        clearable
                        placeholder="请选择"
                        @input="inputHandler($event, 'adVisible')"
                    >
                        <el-option
                            v-for="(item, index) in adVisibleOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">广告状态</label>
                    <el-select
                        :value="searchFields.adStatus"
                        clearable
                        placeholder="请选择广告状态"
                        @input="inputHandler($event, 'adStatus')"
                    >
                        <el-option
                            v-for="(item, index) in adStatusOptions"
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
                    <label class="search-field-item-label">资源类型</label>
                    <el-select
                        :value="searchFields.mediaType"
                        clearable
                        placeholder="请选择资源类型"
                        @input="inputHandler($event, 'mediaType')"
                    >
                        <el-option
                            v-for="(item, index) in mediaTypeOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
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
            <el-table
                @sort-change="sortChangeHandler"
                header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                <el-table-column prop="id" align="center" width="120px" label="编号"></el-table-column>
                <el-table-column prop="name" align="center" min-width="120px" label="广告主名称">
                    <template slot-scope="scope">
                        <span @click="displayAdvertisingOwner(scope.row.id)" class="ellipsis two name">
                            {{scope.row.name}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" align="center" min-width="120px" label="广告主备注">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.description}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" min-width="120px" align="center" label="广告资源">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.videoMaterialCount + scope.row.imageMaterialCount}}个
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" min-width="120px" align="center" label="所投广告">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.adCount}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column sortable align="center" min-width="160" label="创建时间" prop="createdAt">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column sortable align="center" min-width="160" label="更新时间" prop="updatedAt">
                    <template slot-scope="scope">
                        {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column width="220px" align="center" label="操作">
                    <template slot-scope="scope">
                        <div id="channel-operator" class="operator-btn-wrapper">
                            <span class="btn-text" @click="editAdvertisingOwner(scope.row.id)">编辑</span>
                            <span class="btn-text text-danger" @click="deleteAdvertisingOwner(scope.row.id)">删除</span>
                        </div>
                    </template>
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
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import role from '../../../util/config/role';
export default {
    name: 'AdvertisingOwnerList',
    data() {
        return {
            searchFieldVisible: false,
            adTypeOptions: role.AD_TYPE_OPTIONS,
            adVisibleOptions: [
                {
                    name: '上架',
                    value: true
                },
                {
                    name: '下架',
                    value: false
                }
            ],
            adStatusOptions: role.AD_STATUS_OPTIONS,
            mediaTypeOptions: [
                {
                    name: '视频',
                    value: 'VIDEO'
                },
                {
                    name: '图片',
                    value: 'IMAGE'
                }
            ]
        };
    },
    created() {
        this.getAdvertisingOwnerList();
    },
    computed: {
        ...mapGetters({
            list: 'advertising/list',
            pagination: 'advertising/pagination',
            searchFields: 'advertising/searchFields'
        })
    },
    methods: {
        ...mapMutations({
            updateSearchFields: 'advertising/updateSearchFields',
            updatePagination: 'advertising/updatePagination',
            resetSearchFields: 'advertising/resetSearchFields',
            setList: 'advertising/setList'
        }),
        ...mapActions({
            getAdvertisingOwnerList: 'advertising/getAdvertisingOwnerList'
        }),
        addAdvertisingOwner() {
            let routeData = this.$router.resolve({
                name: 'AddAdvertisingOwner'
            });
            window.open(routeData.href, '_blank');
        },
        editAdvertisingOwner(id) {
            this.$router.push({name: 'EditAdvertisingOwner', params: {id}});
        },
        displayAdvertisingOwner(id) {
            this.$router.push({name: 'DisplayAdvertisingOwner', params: {id}});
        },
        inputHandler(value, key) {
            this.updateSearchFields({key, value});
            if (key !== 'keyword') {
                this.searchHandler();
            }
        },
        searchHandler() {
            this.updatePagination({key: 'pageNum', value: 1});
            this.getAdvertisingOwnerList();
        },
        clearSearchFields() {
            this.resetSearchFields();
            this.getAdvertisingOwnerList();
        },
        handlePaginationChange(value, key) {
            this.updatePagination({key, value});
            this.getAdvertisingOwnerList();
        },
        toggleSearchField() {
            this.searchFieldVisible = !this.searchFieldVisible;
        },
        sortChangeHandler(obj) {
            let {prop, order} = obj;
            if (prop === 'createdAt') {
                let sortedListByCreatedAt = [];
                if (order === 'ascending') {
                    sortedListByCreatedAt = _.chain(this.list).sortBy('createdAt').value();
                } else {
                    sortedListByCreatedAt = _.chain(this.list).sortBy('createdAt').reverse().value();
                }
                this.setList({list: sortedListByCreatedAt});
            }
            if (prop === 'updatedAt') {
                let sortedListByCreatedAt = [];
                if (order === 'ascending') {
                    sortedListByCreatedAt = _.chain(this.list).sortBy('updatedAt').value();
                } else {
                    sortedListByCreatedAt = _.chain(this.list).sortBy('updatedAt').reverse().value();
                }
                this.setList({list: sortedListByCreatedAt});
            }
        },
        async deleteAdvertisingOwner(id) {
            try {
                let confirm = await this.$confirm(`您确定要删除广告主吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                if (confirm) {
                    let res = await this.$service.deleteAdvertisingOwnerById(id);
                    if (res && res.code === 0) {
                        this.$message.success('删除成功');
                        this.getAdvertisingOwnerList();
                    } else {
                        this.$message.error(res.message);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
