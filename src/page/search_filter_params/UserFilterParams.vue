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
                        @click="getUserList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="CA">
                    <el-select
                        v-model="listQueryParams.caStatus"
                        @change="getUserList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in caStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="APP版本">
                    <el-select
                        v-model="listQueryParams.appVersion"
                        @change="getUserList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in appVersionList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
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
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
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
                        v-model="memberDateRange"
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
                <el-form-item label="最后登录">
                    <el-date-picker
                        v-model="loginDateRange"
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
                    caStatus: '',
                    registeredAtStart: '',
                    registeredAtEnd: '',
                    memberAtStart: '',
                    memberAtEnd: '',
                    loginAtStart: '',
                    loginAtEnd: ''
                },
                registeredDateRange: [],
                memberDateRange: [],
                loginDateRange: [],
                appVersionList: [],
                tvVersionList: [],
                caStatusOptions: [
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
            },
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.caStatus = params.caStatus !== '' ? params.caStatus : '';
                this.listQueryParams.category = params.category ? params.category : '';
                this.listQueryParams.registeredAtStart = params.registeredAtStart ? params.registeredAtStart : '';
                this.listQueryParams.registeredAtEnd = params.registeredAtEnd ? params.registeredAtEnd : '';
                this.registeredDateRange = params.registeredAtStart ? [params.registeredAtStart, params.registeredAtEnd] : [];
                this.listQueryParams.memberAtStart = params.memberAtStart ? params.memberAtStart : '';
                this.listQueryParams.memberAtEnd = params.memberAtEnd ? params.memberAtEnd : '';
                this.memberDateRange = params.memberAtStart ? [params.memberAtStart, params.memberAtEnd] : [];
                this.listQueryParams.loginAtStart = params.loginAtStart ? params.loginAtStart : '';
                this.listQueryParams.loginAtEnd = params.loginAtEnd ? params.loginAtEnd : '';
                this.loginDateRange = params.loginAtStart ? [params.loginAtStart, params.loginAtEnd] : [];
            },
            getUserList(isReset) {
                if (this.registeredDateRange && this.registeredDateRange.length === 2) {
                    this.listQueryParams.registeredAtStart = this.registeredDateRange[0];
                    this.listQueryParams.registeredAtEnd = this.registeredDateRange[1];
                } else {
                    this.listQueryParams.registeredAtStart = '';
                    this.listQueryParams.registeredAtEnd = '';
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
                this.memberDateRange = [];
                this.loginDateRange = [];
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
