<!--导出列表搜索参数设置组件-->
<template>
    <div class="exportFile-search-container">
        <div @keyup.enter="getExportFileList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getExportFileList(true)"
                        clearable
                        class="border-input"
                        placeholder="请输入需要查找的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getExportFileList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.status"
                        @change="getExportFileList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearFilters"
                        type="primary">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ExportFileFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    status: ''
                },
                statusOptions: [{
                    value: 'ON_GOING',
                    label: '下载中'
                }, {
                    value: 'SUCCESS',
                    label: '成功'
                }, {
                    value: 'FAILED',
                    label: '失败'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.category = params.category ? params.category : '';
                this.listQueryParams.programmeCategoryId = params.programmeCategoryId ? params.programmeCategoryId : '';
                this.listQueryParams.createdAtBegin = params.createdAtBegin ? params.createdAtBegin : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.createRangeTime = params.createdAtBegin ? [params.createdAtBegin, params.createdAtEnd] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.refCount = params.refCount ? params.refCount : '';
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
            },
            init() {
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryOptions = response.data;
                    }
                });
            },
            getExportFileList(isReset) {
                if (!this.$authority.isHasAuthority('content:exportFile:page')) {
                    for (let key in this.listQueryParams) {
                        if (Array.isArray(this.listQueryParams[key])) {
                            this.listQueryParams[key] = [];
                        } else {
                            this.listQueryParams[key] = '';
                        }
                    }
                    this.createRangeTime = [];
                    return;
                }
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtBegin = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtBegin = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getExportFileList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.createRangeTime = [];
                this.getExportFileList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .exportFile-search-container {
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
