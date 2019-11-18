<!--版本列表组件-->
<template>
    <div class="version-container">
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
                    <el-button class="btn-style-one" @click="getVersionList" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            :value="searchFields.productType"
                            filterable
                            clearable
                            @input="inputHandler($event, 'productType')"
                            placeholder="全部">
                            <el-option
                                v-for="(item, index) in productTypeOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">方式</label>
                        <el-select
                            :value="searchFields.forced"
                            filterable
                            clearable
                            @input="inputHandler($event, 'forced')"
                            placeholder="全部">
                            <el-option
                                v-for="(item, index) in forcedOptions"
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
                    <span
                        @click="toggleSearchField"
                        :class="{active:searchFieldVisible}"
                        class="more-filters">
                        更多筛选
                        <i class="el-icon-arrow-up" v-if="searchFieldVisible"></i>
                        <i class="el-icon-arrow-down" v-else></i>
                    </span>
                </div>
                <div v-show="searchFieldVisible" class="field-row">
                    <div class="search-field-item">
                        <label class="search-field-item-label">公共频道</label>
                        <el-select
                            :value="searchFields.allCompanyUpdate"
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'allCompanyUpdate')"
                        >
                            <el-option
                                v-for="(item, index) in [{name: '是', value: true}, {name: '否', value: false}]"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">区域</label>
                        <el-select
                            :value="searchFields.companyCode"
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'companyCode')"
                        >
                            <el-option
                                v-for="(item, index) in companyOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">时间</label>
                        <el-date-picker
                            :value="searchFields.dateRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            value-format="timestamp"
                            @input="inputHandler($event, 'dateRange')"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">版本列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left"></div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createVersion">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                    </div>
                </div>
                <el-table
                    @sort-change="sortChangeHandler"
                    header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                    <el-table-column align="center" width="120px" label="编号" prop="id"></el-table-column>
                    <el-table-column label="版本名称" width="120px" align="center" prop="version">
                        <template slot-scope="scope">
                            <span @click="displayVersion(scope.row.id)" class="ellipsis two name">
                                {{scope.row.version}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="版本号" align="center" prop="versionCode"></el-table-column>
                    <el-table-column align="center" width="120px" label="升级类型">
                        <template slot-scope="scope">
                            {{scope.row.productType === 'TV_LAUNCHER' ? '应用升级' : '系统升级'}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="center" label="升级方式">
                        <template slot-scope="scope">
                            {{scope.row.forced ? '强制升级' : '选择升级'}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="硬件类型">
                        <template slot-scope="scope">
                            {{hardwareType(scope.row.hardwareType)}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="140px" label="升级包">
                        <template slot-scope="scope">
                            <a v-if="scope.row.fullPackageUri" class="text-primary"
                               :href="packageUrl(scope.row.fullPackageUri)">{{scope.row.version}}</a>
                            <br />
                            {{convertFileSize(scope.row.packageSize)}}
                        </template>
                    </el-table-column>
                    <el-table-column sortable align="center" width="120px" prop="stbCount" label="设备数">
                        <template slot-scope="scope">
                            {{scope.row.stbCount}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            {{releaseStatus(scope.row.releaseStatus)}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="center" label="发布时间" prop="releaseAt">
                        <template slot-scope="scope">
                            {{scope.row.releaseAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="190px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span v-if="scope.row.releaseStatus !== 'WITHDRAW'" class="btn-text" @click="editVersion(scope.row)">编辑</span>
                                <span v-if="scope.row.releaseStatus === 'PRE_RELEASED'" class="btn-text" @click="releaseVersion(scope.row.id)">发布</span>
                                <span v-if="scope.row.releaseStatus === 'PRE_RELEASED'" class="btn-text text-danger" @click="deleteVersion(scope.row.id)">删除</span>
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
export default {
    name: 'VersionList',
    data() {
        return {
            //  toggle搜索区域
            searchFieldVisible: false,
            productTypeOptions: role.PRODUCT_TYPE_OPTIONS,
            forcedOptions: role.FORCED_OPTIONS
        };
    },
    created() {
        this.resetState();
        this.getVersionList();
        this.getFilialeList();
        window.addEventListener('keyup', this.keyupHandler);
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.keyupHandler);
    },
    computed: {
        ...mapGetters({
            list: 'version/list',
            version: 'version/version',
            pagination: 'version/pagination',
            searchFields: 'version/searchFields',
            filialeList: 'channel/filialeList'
        }),
        packageUrl(uri) {
            return (uri) => {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                return `${baseUri}${uri}`;
            };
        },
        companyOptions() {
            let {allCompanyUpdate} = this.searchFields;
            if (allCompanyUpdate) {
                return [];
            } else {
                return this.filialeList;
            }
        },
        releaseStatus() {
            return (status) => {
                switch (status) {
                    case 'PRE_RELEASED':
                        return '未发布';
                    case 'RELEASED':
                        return '已发布';
                    case 'WITHDRAW':
                        return '已撤回';
                    default:
                        return '';
                }
            };
        }
    },
    methods: {
        ...mapMutations({
            updateSearchFields: 'version/updateSearchFields',
            updatePagination: 'version/updatePagination',
            resetVersion: 'version/resetVersion',
            resetPagination: 'version/resetPagination',
            resetSearchFields: 'version/resetSearchFields',
            setVersion: 'version/setVersion',
            resetState: 'version/resetState',
            setList: 'version/setList'
        }),
        ...mapActions({
            postVersion: 'version/postVersion',
            getVersionList: 'version/getVersionList',
            getFilialeList: 'channel/getFilialeList',
            deleteVersionById: 'version/deleteVersionById'
        }),
        createVersion() {
            this.$router.push({name: 'CreateVersion'});
        },
        displayVersion(id) {
            this.$router.push({name: 'VersionDetail', params: {id}});
        },
        toggleSearchField() {
            this.searchFieldVisible = !this.searchFieldVisible;
        },
        hardwareType(hardwareType) {
            return hardwareType ? (hardwareType === 'HARDWARE_3796' ? '3796' : '3798') : '------';
        },
        clearSearchFields() {
            this.resetSearchFields();
            this.getVersionList();
        },
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.getVersionList();
            }
        },
        getLink(version) {
            return `${version.uriPrefix}${version.fullPackageUri}`;
        },
        // 跳转到详情页面
        handlePaginationChange(value, key) {
            this.updatePagination({value, key});
            if (key === 'pageSize') {
                window.localStorage.setItem('versionPageSize', value);
            }
            this.getVersionList();
        },
        inputHandler(value, key) {
            this.updateSearchFields({key, value});
            if (key !== 'keyword') {
                this.getVersionList();
            }
        },
        submitVersionHandler() {
            this.$refs.versionForm.$refs.createVersion.validate(value => {
                if (value) {
                    if (this.version.fullPackageUri) {
                        this.postVersion()
                            .then((res) => {
                                if (res && res.code === 0) {
                                    this.resetVersion();
                                    this.closeVersionFormDialog();
                                    this.getVersionList();
                                } else {
                                    this.$message.error('新增版本失败');
                                }
                            });
                    } else {
                        this.$message.error('请上传文件');
                    }
                }
            });
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
        convertFileSize(size) {
            return this.$util.convertFileSize(size);
        },
        //  dev_v2.5 新增
        editVersion(version) {
            let {id, releaseStatus} = version;
            if (releaseStatus === 'PRE_RELEASED') {
                this.$router.push({name: 'EditVersion', params: {id}});
            } else {
                this.$router.push({name: 'EditVersionReleased', params: {id}});
            }
        },
        async releaseVersion(id) {
            try {
                let confirm = await this.$confirm(`您确定要发布该版本吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });

                if (confirm) {
                    let res = await this.$service.launchVersion(id, 'RELEASED');
                    if (res && res.code === 0) {
                        this.getVersionList();
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        async deleteVersion(id) {
            try {
                let confirm = await this.$confirm(`您确定要删除当前版本吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.deleteVersionById(id);
                    if (res && res.code === 0) {
                        this.getVersionList();
                    } else {
                        this.$message.error('删除失败');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style scoped lang="scss">
    a.text-primary {
        color: #1989FA;
    }
    // 按钮
    .more-filters {
        margin-left: 20px;
        font-size: 12px;
        color: #6F7480;
        cursor: pointer;
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

</style>
