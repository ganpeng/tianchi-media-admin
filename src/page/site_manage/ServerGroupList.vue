<template>
    <div class="server-group-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.keyword"
                            @input="inputHandler($event, 'keyword')"
                            clearable
                            class="border-input"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            :value="searchFields.code"
                            filterable
                            clearable
                            @input="inputHandler($event, 'code')"
                            placeholder="全部">
                            <el-option
                                v-for="(item, index) in serverGroupTypeOPtions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">服务器组</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <sort-item :sortKeyList="sortKeyList" :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createServerGroupHandler">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                    </div>
                </div>
                <el-table
                    @sort-change="sortChangeHandler"
                    header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                    <el-table-column align="center" width="120px" label="组名" prop="name"></el-table-column>
                    <el-table-column align="center" label="组类型" prop="type">
                        <template slot-scope="scope">
                            {{typeNameList(scope.row.typeList)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="IP" prop="ip"></el-table-column>
                    <el-table-column align="center" label="频道数" prop="currentCount"></el-table-column>
                    <el-table-column width="120px" align="center" label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="center" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="190px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span  class="btn-text" @click="editServerGroupHandler(scope.row.id)">编辑</span>
                                <span  class="btn-text text-danger" @click="deleteServerGroupHandler(scope.row.id)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import role from '@/util/config/role';
// dev2.9
import SortItem from 'sysComponents/custom_components/custom/SortItem';
export default {
    name: 'ServerGroupList',
    components: {SortItem},
    data() {
        return {
            serverGroupTypeOPtions: role.SERVER_GROUP_TYPE_OPTIONS,
            sortKeyList: [
                {
                    label: 'IP',
                    value: 'IP'
                },
                {
                    label: '创建时间',
                    value: 'CREATED_AT'
                },
                {
                    label: '更新时间',
                    value: 'UPDATED_AT'
                }
            ]
        };
    },
    created() {
        this.resetState();
        this.getServerGroupList();
        window.addEventListener('keyup', this.keyupHandler);
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.keyupHandler);
    },
    computed: {
        ...mapGetters({
            list: 'serverGroup/list',
            pagination: 'serverGroup/pagination',
            searchFields: 'serverGroup/searchFields'
        }),
        typeNameList() {
            return (typeList) => {
                return _.chain(this.serverGroupTypeOPtions)
                        .filter((item) => {
                            let index = typeList.findIndex((type) => type === item.value);
                            return index >= 0;
                        })
                        .map((item) => item.name)
                        .join(',')
                        .value();
            };
        }
    },
    methods: {
        ...mapMutations({
            updateSearchFields: 'serverGroup/updateSearchFields',
            updatePagination: 'serverGroup/updatePagination',
            resetPagination: 'serverGroup/resetPagination',
            resetSearchFields: 'serverGroup/resetSearchFields',
            resetState: 'serverGroup/resetState',
            setList: 'serverGroup/setList'
        }),
        ...mapActions({
            getServerGroupList: 'serverGroup/getServerGroupList'
        }),
        createServerGroupHandler() {
            this.$router.push({name: 'CreateServerGroup'});
        },
        clearSearchFields() {
            this.resetSearchFields();
        },
        searchHandler() {
            this.getServerGroupList();
        },
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchHandler();
            }
        },
        // 跳转到详情页面
        handlePaginationChange(value, key) {
            this.updatePagination({value, key});
            if (key === 'pageSize') {
                window.localStorage.setItem('serverGroupPageSize', value);
            }
            this.searchHandler();
        },
        inputHandler(value, key) {
            this.updateSearchFields({key, value});
            if (key !== 'keyword') {
                this.searchHandler();
            }
        },
        sortChangeHandler(obj) {
            let {prop, order} = obj;
            if (prop === 'stbCount') {
                let sortedListByCreatedAt = [];
                if (order === 'ascending') {
                    sortedListByCreatedAt = _.chain(this.list).sortBy('stbCount').value();
                } else {
                    sortedListByCreatedAt = _.chain(this.list).sortBy('stbCount').reverse().value();
                }
                this.setList({list: sortedListByCreatedAt});
            }
        },
        //  dev_v2.5 新增
        editServerGroupHandler(id) {
            this.$router.push({name: 'EditServerGroup', params: {id}});
        },
        async deleteServerGroupHandler(id) {
            try {
                let confirm = await this.$confirm(`您确定要删除当前版本吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    console.log('delete');
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
</style>
