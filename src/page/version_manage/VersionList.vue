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
                    <el-button class="btn-style-one" @click="getVersionList" icon="el-icon-search" type="primary" plain>搜索</el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            :value="searchFields.productType"
                            filterable
                            clearable
                            @input="inputHandler($event, 'productType')"
                            placeholder="请选择升级类型">
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
                            placeholder="请选择升级方式">
                            <el-option
                                v-for="(item, index) in forcedOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <div class="search-field-item">
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
                    </div> -->
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        重置
                    </el-button>
                    <span
                        @click="toggleSearchField"
                        class="el-dropdown-link">
                        更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                </div>
                <div v-show="searchFieldVisible" class="field-row">
                    <div class="search-field-item">
                        <label class="search-field-item-label">开始时间</label>
                        <el-date-picker
                            :value="searchFields.releaseAtStart"
                            type="date"
                            clearable
                            value-format="timestamp"
                            style="width:180px;"
                            @input="inputHandler($event, 'releaseAtStart')"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">结束时间</label>
                        <el-date-picker
                            :value="searchFields.releaseAtEnd"
                            type="date"
                            clearable
                            value-format="timestamp"
                            style="width:180px;"
                            @input="inputHandler($event, 'releaseAtEnd')"
                            placeholder="请选择结束时间">
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
                <el-table header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                    <el-table-column align="center" width="120px" label="编号" prop="id"></el-table-column>
                    <el-table-column label="版本名称" width="120px" align="center" prop="version">
                        <template slot-scope="scope">
                            <span class="ellipsis two">
                                {{scope.row.version}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="版本号" align="center" prop="versionCode"></el-table-column>
                    <el-table-column align="center" label="升级类型">
                        <template slot-scope="scope">
                            {{scope.row.productType === 'TV_LAUNCHER' ? '应用升级' : '系统升级'}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="硬件类型">
                        <template slot-scope="scope">
                            {{hardwareType(scope.row.hardwareType)}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="center" label="升级方式">
                        <template slot-scope="scope">
                            {{scope.row.forced ? '强制升级' : '选择升级'}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120px" align="center" label="发布时间" prop="releaseAt">
                        <template slot-scope="scope">
                            {{scope.row.releaseAt | formatDate('yyyy-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="设备统计">
                        <template slot-scope="scope">
                            {{scope.row.installed | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="升级包下载">
                        <template slot-scope="scope">
                            <a class="text-primary" :href="packageUrl(scope.row.fullPackageUri)">{{scope.row.version}}</a>
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
    import role from '@/util/config/role';
    export default {
        name: 'VersionList',
        data() {
            return {
                //  toggle搜索区域
                searchFieldVisible: true,
                productTypeOptions: role.PRODUCT_TYPE_OPTIONS,
                forcedOptions: role.FORCED_OPTIONS
            };
        },
        created() {
            this.resetState();
            this.getVersionList();
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
                searchFields: 'version/searchFields'
            }),
            packageUrl(uri) {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
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
                resetState: 'version/resetState'
            }),
            ...mapActions({
                postVersion: 'version/postVersion',
                getVersionList: 'version/getVersionList'
            }),
            createVersion() {
                this.$router.push({name: 'CreateVersion'});
            },
            toggleSearchField() {
                this.searchFieldVisible = !this.searchFieldVisible;
            },
            hardwareType(hardwareType) {
                return hardwareType ? (hardwareType === 'HARDWARE_3796' ? '3796' : '3798') : '------';
            },
            clearSearchFields() {
                this.resetSearchFields();
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
            }
        }
    };
</script>
<style scoped lang="less">
</style>
