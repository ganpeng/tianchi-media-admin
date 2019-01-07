<!--搜索用户参数设置组件-->
<template>
    <div @keyup.enter="getUserList" class="text-left">
        <div class="search-field">
            <div class="field-row">
                <div class="search-field-item">
                    <el-input
                        v-model="listQueryParams.keyword"
                        clearable
                        class="border-input"
                        placeholder="搜索你想要的信息">
                    </el-input>
                </div>
                <el-button class="btn-style-one" @click="getUserList" type="primary">
                    <svg-icon icon-class="search"></svg-icon>
                    搜索
                </el-button>
                <div class="search-field-item">
                    <label class="search-field-item-label">日期</label>
                    <el-date-picker
                        v-model="listQueryParams.dateRange"
                        type="daterange"
                        value-format="timestamp"
                        :unlink-panels="true"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                    <svg-icon icon-class="reset"></svg-icon>
                    重置
                </el-button>
                <span
                    @click="toggleSearchField"
                    :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                    更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
            </div>
            <div v-show="searchFieldVisible" class="field-row">
                <div class="search-field-item">
                    <label class="search-field-item-label">省份</label>
                    <el-select v-model="listQueryParams.province"
                            @change="selectDistrict('PROVINCE')"
                            placeholder="请选择省份">
                        <el-option
                            v-for="item in provinceOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">城市</label>
                    <el-select
                        v-model="listQueryParams.city"
                        @change="selectDistrict('CITY')"
                        placeholder="请选择城市"
                        :disabled="cityDisabled">
                        <el-option
                            v-for="item in cityOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">县区</label>
                    <el-select
                        v-model="listQueryParams.county"
                        @change="selectDistrict('COUNTY')"
                        placeholder="请选择县区"
                        :disabled="countyDisabled">
                        <el-option
                            v-for="item in countyOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">乡镇/街道</label>
                    <el-select
                        v-model="listQueryParams.street"
                        @change="selectDistrict('STREET')"
                        placeholder="请选择乡镇/街道"
                        :disabled="streetDisabled">
                        <el-option
                            v-for="item in streetOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';
    export default {
        name: 'ProgrammeFilterParams',
        props: [],
        data() {
            return {
                listQueryParams: {
                    dateRange: [],
                    registeredAtStart: '',
                    registeredAtEnd: '',
                    keyword: '',
                    province: '',
                    city: '',
                    county: '',
                    street: ''
                },
                provinceOptions: [],
                cityOptions: [],
                countyOptions: [],
                streetOptions: [],
                cityDisabled: true,
                countyDisabled: true,
                streetDisabled: true,
                searchFieldVisible: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getDistrictList({level: 'PROVINCE'});
            },
            // 获取地区列表
            getDistrictList({level, code}) {
                this.$service.getDistrictList({level, code}).then(response => {
                    if (response && response.code === 0) {
                        switch (level) {
                            case 'PROVINCE':
                                this.provinceOptions = response.data.list;
                                break;
                            case 'CITY':
                                this.cityOptions = response.data.list;
                                break;
                            case 'COUNTY':
                                this.countyOptions = response.data.list;
                                break;
                            case 'STREET':
                                this.streetOptions = response.data.list;
                                break;
                            default:
                                break;
                        }
                    }
                });
            },
            // 选择某个地区
            selectDistrict(level) {
                switch (level) {
                    // 选择省份
                    case 'PROVINCE':
                        this.getDistrictList({level: 'CITY', code: this.listQueryParams.province});
                        this.cityDisabled = false;
                        this.listQueryParams.city = '';
                        this.countyDisabled = true;
                        this.listQueryParams.county = '';
                        this.countyOptions = [];
                        this.streetDisabled = true;
                        this.listQueryParams.street = '';
                        this.streetOptions = [];
                        break;
                    // 选择城市
                    case 'CITY':
                        this.getDistrictList({level: 'COUNTY', code: this.listQueryParams.city});
                        this.countyDisabled = false;
                        this.listQueryParams.county = '';
                        this.streetDisabled = true;
                        this.listQueryParams.street = '';
                        this.streetOptions = [];
                        break;
                    // 选择县区
                    case 'COUNTY':
                        this.getDistrictList({level: 'STREET', code: this.listQueryParams.county});
                        this.streetDisabled = false;
                        this.listQueryParams.street = '';
                        this.streetOptions = [];
                        break;
                    // 选择街道乡镇
                    case 'STREET':
                        break;
                    default:
                        break;
                }
            },
            getUserList() {
                let districtCode = '';
                if (this.listQueryParams.street) {
                    districtCode = this.listQueryParams.street;
                } else if (this.listQueryParams.county) {
                    districtCode = this.listQueryParams.county;
                } else if (this.listQueryParams.city) {
                    districtCode = this.listQueryParams.city;
                } else if (this.listQueryParams.province) {
                    districtCode = this.listQueryParams.province;
                }
                // 设置过滤条件
                this.$emit('getUserList', {
                    keyword: this.listQueryParams.keyword,
                    registeredAtStart: _.get(this.listQueryParams, 'dateRange.0'),
                    registeredAtEnd: _.get(this.listQueryParams, 'dateRange.1'),
                    districtCode: districtCode
                });
            },
            // 清空搜索条件
            clearSearchFields() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
            },
            toggleSearchField() {
                this.searchFieldVisible = !this.searchFieldVisible;
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
