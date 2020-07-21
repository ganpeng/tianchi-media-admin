<!--激活码列表搜索参数设置组件-->
<template>
    <div class="code-search-container">
        <div @keyup.enter="getCodeList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getCodeList(true)"
                        clearable
                        class="border-input"
                        placeholder="激活码名称等">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getCodeList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.status"
                        @change="getCodeList(true)"
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
                <el-form-item label="生成时间">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="activeRangeTime"
                        type="daterange"
                        @change="getCodeList(true)"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="使用时间">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="activeRangeTime"
                        type="daterange"
                        @change="getCodeList(true)"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
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
        name: 'ActivationCodeFilterParams',
        data() {
            return {
                listQueryParams: {
                    startActiveAt: '',
                    endActiveAt: '',
                    startCreatedAt: '',
                    endCreatedAt: '',
                    keyword: '',
                    status: ''
                },
                activeRangeTime: [],
                activeRangeTime: [],
                statusOptions: [{
                    value: 'USED',
                    label: '已使用'
                }, {
                    value: 'UNUSED',
                    label: '未使用'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.startActiveAt = params.startActiveAt ? params.startActiveAt : '';
                this.listQueryParams.endActiveAt = params.endActiveAt ? params.endActiveAt : '';
                this.activeRangeTime = params.startActiveAt ? [params.startActiveAt, params.endActiveAt] : [];
                this.listQueryParams.startCreatedAt = params.startCreatedAt ? params.startCreatedAt : '';
                this.listQueryParams.endCreatedAt = params.endCreatedAt ? params.endCreatedAt : '';
                this.activeRangeTime = params.startCreatedAt ? [params.startCreatedAt, params.endCreatedAt] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.status = params.status ? params.status : '';
            },
            init() {
            },
            getCodeList(isReset) {
                if (this.activeRangeTime && this.activeRangeTime.length === 2) {
                    this.listQueryParams.startActiveAt = this.activeRangeTime[0];
                    this.listQueryParams.endActiveAt = this.activeRangeTime[1];
                } else {
                    this.listQueryParams.startActiveAt = '';
                    this.listQueryParams.endActiveAt = '';
                }
                if (this.activeRangeTime && this.activeRangeTime.length === 2) {
                    this.listQueryParams.startCreatedAt = this.activeRangeTime[0];
                    this.listQueryParams.endCreatedAt = this.activeRangeTime[1];
                } else {
                    this.listQueryParams.startCreatedAt = '';
                    this.listQueryParams.endCreatedAt = '';
                }
                this.$emit('getCodeList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.activeRangeTime = [];
                this.activeRangeTime = [];
                this.getCodeList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .code-search-container {
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
