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
                    this.listQueryParams.createdAtBegin = Date.parse(this.createRangeTime[0]);
                    this.listQueryParams.createdAtEnd = Date.parse(this.createRangeTime[1]);
                }
                this.$emit('getSubjectList', this.listQueryParams);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form-item {
        margin-bottom: 0px;
        margin-right: 30px;
    }

</style>
