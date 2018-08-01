<!--搜索节目参数设置组件-->
<template>
    <div>
        <el-form :inline="true" class="search-form">
            <el-form-item class="search">
                <el-input
                    v-model="listQueryParams.keyword"
                    clearable
                    placeholder="搜索你想要的信息">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getUserList" type="primary">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="clearSearchFields">清空筛选条件</el-button>
            </el-form-item>
            <el-form-item class="create-user">
                <el-button type="primary" @click="toCreateUser">创建用户</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true">
            <el-form-item label="创建起始时间">
                <el-date-picker
                    v-model="listQueryParams.createStart"
                    type="date"
                    clearable
                    placeholder="请选择创建起始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="创建结束时间">
                <el-date-picker
                    v-model="listQueryParams.createEnd"
                    type="date"
                    clearable
                    placeholder="请选择创建结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="省份" prop="province">
                <el-select v-model="listQueryParams.province" placeholder="请选择省份" clearable>
                    <el-option
                        v-for="item in provinceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="city">
                <el-select v-model="listQueryParams.city" placeholder="请选择城市" clearable>
                    <el-option
                        v-for="item in cityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="县区" prop="county">
                <el-select v-model="listQueryParams.county" placeholder="请选择县区" clearable>
                    <el-option
                        v-for="item in countyOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇/街道" prop="town">
                <el-select v-model="listQueryParams.town" placeholder="请选择乡镇/街道" clearable>
                    <el-option
                        v-for="item in townOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
                    createStart: '',
                    createEnd: '',
                    keyword: '',
                    province: '',
                    city: '',
                    county: '',
                    town: ''
                },
                provinceOptions: [
                    {value: '001', label: '北京'},
                    {value: '002', label: '河北省'}
                ],
                cityOptions: [
                    {value: '001', label: '北京市'},
                    {value: '002', label: '石家庄市'}
                ],
                countyOptions: [
                    {value: '001', label: '裕华区'},
                    {value: '002', label: '桥西区'}
                ],
                townOptions: [
                    {value: '001', label: '雨花路'},
                    {value: '002', label: '绵阳路'}
                ]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            getUserList() {
                this.$emit('getUserList', this.listQueryParams);
            },
            toCreateUser() {
                this.$router.push({name: 'CreateUser'});
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .search-title {
        display: inline-block;
        font-size: 20px;
        line-height: 40px
    }

    .create-user {
        margin-left: 50px;
    }

</style>
