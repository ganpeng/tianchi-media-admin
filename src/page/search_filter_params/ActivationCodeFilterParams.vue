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
                        v-model="listQueryParams.visible"
                        @change="getCodeList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生成时间">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="createRangeTime"
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
                        v-model="createRangeTime"
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
                    createdAtBegin: '',
                    createdAtEnd: '',
                    keyword: '',
                    visible: ''
                },
                createRangeTime: [],
                visibleOptions: [{
                    value: true,
                    label: '已使用'
                }, {
                    value: false,
                    label: '未使用'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.createdAtBegin = params.createdAtBegin ? params.createdAtBegin : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.createRangeTime = params.createdAtBegin ? [params.createdAtBegin, params.createdAtEnd] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
            },
            init() {
            },
            getCodeList(isReset) {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtBegin = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtBegin = '';
                    this.listQueryParams.createdAtEnd = '';
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
                this.createRangeTime = [];
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
