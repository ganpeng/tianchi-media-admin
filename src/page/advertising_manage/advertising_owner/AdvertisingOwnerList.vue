<!-- 广告主列表页  -->
<template>
    <div class="advertising-owner-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
        </div>
        <!--筛选开始-->
        <div class="ad-owner-search-container">
            <div @keyup.enter="searchHandler" class="text-left filters-container">
                <el-form :inline="true" class="filter-form">
                    <el-form-item>
                        <el-input
                            :value="searchFields.keyword"
                            placeholder="搜索你想要的信息"
                            @input="inputHandler($event, 'keyword')"
                            clearable
                            class="border-input">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="btn-style-one"
                            @click="searchHandler"
                            type="primary">
                            <svg-icon icon-class="search"></svg-icon>
                            搜索
                        </el-button>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select
                            :value="searchFields.adType"
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'adType')">
                            <el-option
                                v-for="(item, index) in adTypeOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上下架" v-if="false">
                        <el-select
                            :value="searchFields.adVisible"
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'adVisible')">
                            <el-option
                                v-for="(item, index) in adVisibleOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select
                            :value="searchFields.adStatus"
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'adStatus')">
                            <el-option
                                v-for="(item, index) in adStatusOptions"
                                :key="index"
                                :label="item.name"
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
                            @click="searchFieldVisible = !searchFieldVisible"
                            class="more-filters"
                            :class="{active:searchFieldVisible}">
                            更多筛选
                            <i class="el-icon-arrow-up" v-if="searchFieldVisible"></i>
                            <i class="el-icon-arrow-down" v-else></i>
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="more-filter-box filter-form" v-if="searchFieldVisible">
                    <el-form-item label="资源类型">
                        <el-select
                            :value="searchFields.mediaType"
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'mediaType')">
                            <el-option
                                v-for="(item, index) in mediaTypeOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
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
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--筛选结束-->
        <div class="seperator-line"></div>
        <div class="tabel-field">
            <h2 class="content-title">广告主列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left">
                    <sort-item :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
                </div>
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
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:MM:SS') | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column sortable align="center" min-width="160" label="更新时间" prop="updatedAt">
                    <template slot-scope="scope">
                        {{scope.row.updatedAt | formatDate('yyyy-MM-DD HH:MM:SS') | padEmpty}}
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
            :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
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
    import SortItem from 'sysComponents/custom_components/custom/SortItem';
    export default {
        name: 'AdvertisingOwnerList',
        components: {SortItem},
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
                if (!this.$authority.isHasAuthority('ad:advertiser:add')) {
                    return;
                }
                let routeData = this.$router.resolve({name: 'AddAdvertisingOwner'});
                window.open(routeData.href, '_blank');
            },
            editAdvertisingOwner(id) {
                if (!this.$authority.isHasAuthority('ad:advertiser:put')) {
                    return;
                }
                this.$router.push({name: 'EditAdvertisingOwner', params: {id}});
            },
            displayAdvertisingOwner(id) {
                if (!this.$authority.isHasAuthority('ad:advertiser:get')) {
                    return;
                }
                this.$router.push({name: 'DisplayAdvertisingOwner', params: {id}});
            },
            inputHandler(value, key) {
                if (!this.$authority.isHasAuthority('ad:advertiser:page')) {
                    return;
                }
                this.updateSearchFields({key, value});
                if (key !== 'keyword') {
                    this.searchHandler();
                }
            },
            searchHandler() {
                if (!this.$authority.isHasAuthority('ad:advertiser:page')) {
                    return;
                }
                this.updatePagination({key: 'pageNum', value: 1});
                this.getAdvertisingOwnerList();
            },
            clearSearchFields() {
                if (!this.$authority.isHasAuthority('ad:advertiser:page')) {
                    return;
                }
                this.resetSearchFields();
                this.getAdvertisingOwnerList();
            },
            handlePaginationChange(value, key) {
                if (!this.$authority.isHasAuthority('ad:advertiser:page')) {
                    return;
                }
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
                    if (!this.$authority.isHasAuthority('ad:advertiser:delete')) {
                        return;
                    }
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
            },
            // dev2.9
            sortQueryChangeHandler(obj) {
                let {sortKey, sortDirection} = obj;
                this.updateSearchFields({key: 'sortKey', value: sortKey});
                this.updateSearchFields({key: 'sortDirection', value: sortDirection});
                this.searchHandler();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .ad-owner-search-container {
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
