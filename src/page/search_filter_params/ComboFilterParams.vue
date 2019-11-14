<!--套餐列表搜索参数设置组件-->
<template>
    <div class="combo-search-container">
        <div @keyup.enter="getComboList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getComboList(true)"
                        clearable
                        class="border-input"
                        placeholder="套餐名称等">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getComboList(true)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="时长">
                    <el-select
                        v-model="listQueryParams.validityDays"
                        @change="getComboList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in validityDaysOptions"
                            :key="item.day"
                            :label="item.name"
                            :value="item.day">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getComboList(true)"
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
        name: 'ComboFilterParams',
        data() {
            return {
                listQueryParams: {
                    createdAtStart: '',
                    createdAtEnd: '',
                    keyword: '',
                    visible: '',
                    validityDays: ''
                },
                validityDaysOptions: [{
                    name: '1个月',
                    day: 30
                }, {
                    name: '3个月',
                    day: 90
                }, {
                    name: '6个月',
                    day: 180
                }, {
                    name: '1年',
                    day: 365
                }],
                visibleOptions: [{
                    value: true,
                    label: '已上架'
                }, {
                    value: false,
                    label: '已下架'
                }]
            };
        },
        mounted() {
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.validityDays = params.validityDays ? params.validityDays : '';
            },
            getComboList(isReset) {
                if (isReset) {
                    if (!this.$authority.isHasAuthority('user:membershipScheme:page')) {
                        for (let key in this.listQueryParams) {
                            this.listQueryParams[key] = '';
                        }
                        return;
                    }
                }
                this.$emit('getComboList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.getComboList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .combo-search-container {
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
