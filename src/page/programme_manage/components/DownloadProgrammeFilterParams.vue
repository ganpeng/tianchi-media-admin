<!--节目下载列表搜索-->
<template>
    <div class="downloadProgramme-search-container">
        <div @keyup.enter="getDownloadProgrammeList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getDownloadProgrammeList(true)"
                        clearable
                        class="border-input"
                        placeholder="请输入需要查找的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getDownloadProgrammeList(true)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.downloadStatus"
                        @change="getDownloadProgrammeList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in downloadStatusOptions"
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
        name: 'DownloadProgrammeFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    downloadStatus: ''
                },
                downloadStatusOptions: [{
                    value: 'ON_GOING',
                    label: '下载中'
                }, {
                    value: 'SUCCESS',
                    label: '下载成功'
                }, {
                    value: 'FAILED',
                    label: '下载失败'
                }]
            };
        },
        mounted() {
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.downloadStatus = params.downloadStatus ? params.downloadStatus : '';
            },
            getDownloadProgrammeList(isReset) {
                this.$emit('getDownloadProgrammeList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.getDownloadProgrammeList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .downloadProgramme-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }
    }

</style>
