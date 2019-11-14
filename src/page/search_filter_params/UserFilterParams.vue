<!--搜索用户参数设置组件-->
<template>
    <div class="user-search-container">
        <div @keyup.enter="getUserList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getUserList(true)"
                        clearable
                        class="border-input"
                        placeholder="搜索用户编号、账号">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getUserList(true)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="CA">
                    <el-select
                        v-model="listQueryParams.caNoAvailable"
                        @change="getUserList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in caNoAvailableOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员">
                    <el-select
                        v-model="listQueryParams.isVip"
                        @change="getUserList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in isVipOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="TV版本">
                    <el-select
                        v-model="listQueryParams.tvVersion"
                        @change="getUserList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in tvVersionList"
                            :key="item.versionCode"
                            :label="item.version"
                            :value="item.versionCode">
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
                        @click="moreFilters = !moreFilters"
                        class="more-filters"
                        :class="{active:moreFilters}">
                        更多筛选
                        <i class="el-icon-arrow-up" v-if="moreFilters"></i>
                        <i class="el-icon-arrow-down" v-else></i>
                    </el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="more-filter-box filter-form" v-if="moreFilters">
                <el-form-item label="会员到期">
                    <el-date-picker
                        v-model="vipDateRange"
                        type="daterange"
                        @change="getUserList(true)"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="注册日期">
                    <el-date-picker
                        v-model="registeredDateRange"
                        type="daterange"
                        @change="getUserList(true)"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'UserFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    caNoAvailable: '',
                    isVip: '',
                    tvVersion: '',
                    registeredAtStart: '',
                    registeredAtEnd: '',
                    vipExpireAtStart: '',
                    vipExpireAtEnd: ''
                },
                registeredDateRange: [],
                vipDateRange: [],
                tvVersionList: [],
                caNoAvailableOptions: [
                    {label: '有', value: true},
                    {label: '无', value: false}],
                isVipOptions: [
                    {label: '有', value: true},
                    {label: '无', value: false}],
                moreFilters: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getVersionList({pageNum: 0, pageSize: 1000}).then(response => {
                    if (response && response.code === 0) {
                        this.tvVersionList = response.data.list;
                    }
                });
            },
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.caNoAvailable = params.caNoAvailable !== '' ? params.caNoAvailable : '';
                this.listQueryParams.isVip = params.isVip !== '' ? params.isVip : '';
                this.listQueryParams.tvVersion = params.tvVersion !== '' ? params.tvVersion : '';
                this.listQueryParams.registeredAtStart = params.registeredAtStart ? params.registeredAtStart : '';
                this.listQueryParams.registeredAtEnd = params.registeredAtEnd ? params.registeredAtEnd : '';
                this.registeredDateRange = params.registeredAtStart ? [params.registeredAtStart, params.registeredAtEnd] : [];
                this.listQueryParams.vipExpireAtStart = params.vipExpireAtStart ? params.vipExpireAtStart : '';
                this.listQueryParams.vipExpireAtEnd = params.vipExpireAtEnd ? params.vipExpireAtEnd : '';
                this.vipDateRange = params.vipExpireAtStart ? [params.vipExpireAtStart, params.vipExpireAtEnd] : [];
            },
            getUserList(isReset) {
                if (isReset) {
                    if (!this.$authority.isHasAuthority('user:user:page')) {
                        for (let key in this.listQueryParams) {
                            if (Array.isArray(this.listQueryParams[key])) {
                                this.listQueryParams[key] = [];
                            } else {
                                this.listQueryParams[key] = '';
                            }
                        }
                        this.registeredDateRange = [];
                        this.vipDateRange = [];
                        return;
                    }
                }
                if (this.registeredDateRange && this.registeredDateRange.length === 2) {
                    this.listQueryParams.registeredAtStart = this.registeredDateRange[0];
                    this.listQueryParams.registeredAtEnd = this.registeredDateRange[1];
                } else {
                    this.listQueryParams.registeredAtStart = '';
                    this.listQueryParams.registeredAtEnd = '';
                }
                if (this.vipDateRange && this.vipDateRange.length === 2) {
                    this.listQueryParams.vipExpireAtStart = this.vipDateRange[0];
                    this.listQueryParams.vipExpireAtEnd = this.vipDateRange[1];
                } else {
                    this.listQueryParams.vipExpireAtStart = '';
                    this.listQueryParams.vipExpireAtEnd = '';
                }
                this.$emit('getUserList', this.listQueryParams, isReset);
            },
            clearSearchFields() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.registeredDateRange = [];
                this.vipDateRange = [];
                this.getUserList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .user-search-container {
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
