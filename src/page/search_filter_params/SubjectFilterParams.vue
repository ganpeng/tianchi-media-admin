<!--专题列表搜索参数设置组件-->
<template>
    <div @keyup.enter="getSubjectList" class="text-left">
        <el-form :inline="true" class="filter-form">
            <el-form-item label="专题类型" v-if="!mode">
                <el-select v-model="listQueryParams.category" clearable placeholder="请选择专题类型">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <template v-if="listQueryParams.category === 'PROGRAMME'">
                <el-form-item label="节目类别">
                    <el-select v-model="listQueryParams.programmeCategoryIdList" multiple clearable
                               placeholder="请选择节目类别">
                        <el-option
                            v-for="item in programmeCategoryIdListOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="createRangeTime"
                    type="daterange"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="专题名称">
                <el-input v-model="listQueryParams.name" placeholder="请填写专题名称">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="getSubjectList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain class="clear-filter" @click="clearFilters">
                    <svg-icon
                        icon-class="clear_filter">
                    </svg-icon>
                    清空筛选条件
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'SubjectFilterParams',
        props: {
            mode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                listQueryParams: {
                    category: '',
                    programmeCategoryIdList: [],
                    createdAtBegin: '',
                    createdAtEnd: '',
                    name: ''
                },
                programmeCategoryIdListOptions: [],
                createRangeTime: [],
                categoryOptions: [{
                    value: 'PROGRAMME',
                    label: '节目专题'
                }, {
                    value: 'FIGURE',
                    label: '人物专题'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.category = params.category ? params.category : '';
                this.listQueryParams.programmeCategoryIdList = params.programmeCategoryIdList ? params.programmeCategoryIdList : [];
                this.listQueryParams.createdAtBegin = params.createdAtBegin ? params.createdAtBegin : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.createRangeTime = params.createdAtBegin ? [params.createdAtBegin, params.createdAtEnd] : [];
                this.listQueryParams.name = params.name ? params.name : '';
            },
            init() {
                if (this.mode) {
                    this.listQueryParams.category = this.mode;
                }
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryIdListOptions = response.data;
                    }
                });
            },
            getSubjectList() {
                if (this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtBegin = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                }
                this.$emit('getSubjectList', this.listQueryParams);
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
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-date-picker {
        width: 700px;
    }

</style>
