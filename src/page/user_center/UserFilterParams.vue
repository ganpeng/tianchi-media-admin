<!--搜索用户参数设置组件-->
<template>
    <div @keyup.enter="getUserList" class="text-left">
        <el-form :inline="true">
            <el-form-item label="创建起始时间">
                <el-date-picker
                    v-model="listQueryParams.registeredAtStart"
                    type="date"
                    clearable
                    placeholder="请选择创建起始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="创建结束时间">
                <el-date-picker
                    v-model="listQueryParams.registeredAtEnd"
                    type="date"
                    clearable
                    placeholder="请选择创建结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="省份" prop="province">
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
            </el-form-item>
            <el-form-item label="城市" prop="city">
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
            </el-form-item>
        </el-form>
        <el-form :inline="true">
            <el-form-item label="县区" prop="county">
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
            </el-form-item>
            <el-form-item label="乡镇/街道" prop="street">
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
            </el-form-item>
            <el-form-item>
                <el-input
                    v-model="listQueryParams.keyword"
                    clearable
                    placeholder="搜索你想要的信息">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-input v-show="false"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getUserList" type="primary" plain icon="el-icon-search">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    plain
                    class="clear-filter"
                    @click="clearSearchFields">
                    <svg-icon icon-class="clear_filter"></svg-icon>
                    清空筛选条件
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'ProgrammeFilterParams',
        props: [],
        data() {
            return {
                listQueryParams: {
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
                streetDisabled: true
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
                    registeredAtStart: this.listQueryParams.registeredAtStart,
                    registeredAtEnd: this.listQueryParams.registeredAtEnd,
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
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form-item {
        margin-right: 30px;
    }

</style>
