<!--版本列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'版本管理'},
            {name:'版本列表'}]">
        </custom-breadcrumb>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left" @submit.native.prevent>
            <el-col :span="24">
                <el-form-item class="create-account">
                    <el-button type="primary" plain @click="showFileUploadDialog"><i class="el-icon-circle-plus-outline"></i> 新增版本</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="升级类型">
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
                </el-form-item>
                <el-form-item label="升级方式">
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
                </el-form-item>
                <el-form-item label="起止时间">
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
                </el-form-item>
                <el-form-item class="search">
                    <el-input
                        :value="searchFields.keyword"
                        placeholder="搜索你想要的信息"
                        @input="inputHandler($event, 'keyword')"
                        clearable>
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getVersionList">搜索</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <el-table class="my-table-style" :data="list" border>
            <el-table-column align="center" width="120px" label="编号" prop="id"></el-table-column>
            <el-table-column label="版本名称" align="center" prop="version"></el-table-column>
            <el-table-column label="版本号" align="center" prop="versionCode"></el-table-column>
            <el-table-column label="版本说明" align="center" width="200px" prop="updateLog"></el-table-column>
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
            <el-table-column width="120px" align="center" label="版本发布时间" prop="releaseAt">
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
                    <a class="text-primary" :href="(scope.row.uriPrefix + scope.row.fullPackageUri)">{{scope.row.version}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button class="text-success" type="text" size="small" @click="displayVersion(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <el-dialog
            :title="title"
            :visible.sync="versonFormDialogStatus"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
                <version-form v-if="!display" ref="versionForm"></version-form>
                <version-display v-if="display"></version-display>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeVersionFormDialog">关闭</el-button>
                    <el-button v-if="!display" type="primary" @click="submitVersionHandler">确定</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import VersionForm from './VersionForm';
    import VersionDisplay from './VersionDisplay';
    import role from '@/util/config/role';
    export default {
        name: 'VersionList',
        components: { VersionForm, VersionDisplay },
        data() {
            return {
                display: false,
                title: '新增版本',
                versonFormDialogStatus: false,
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
            })
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'version/updateSearchFields',
                updatePagination: 'version/updatePagination',
                resetVersion: 'version/resetVersion',
                resetPagination: 'version/resetPagination',
                setVersion: 'version/setVersion',
                resetState: 'version/resetState'
            }),
            ...mapActions({
                postVersion: 'version/postVersion',
                getVersionList: 'version/getVersionList'
            }),
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
            closeVersionFormDialog() {
                this.title = '新增版本';
                this.versonFormDialogStatus = false;
                this.resetVersion();
                if (!this.display) {
                    this.$refs.versionForm.$refs.createVersion.resetFields();
                    this.$refs.versionForm.fileList = [];
                }
                this.display = false;
            },
            showFileUploadDialog() {
                this.resetVersion();
                this.versonFormDialogStatus = true;
            },
            displayVersion(id) {
                this.display = true;
                this.title = '显示版本';
                this.showFileUploadDialog();
                let version = this.list.find((version) => version.id === id);
                this.setVersion({version});
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
