<!--专题列表搜索参数设置组件-->
<template>
    <div class="subject-search-container">
        <div @keyup.enter="getSubjectList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.name"
                        clearable
                        class="border-input"
                        placeholder="专题名称等">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getSubjectList"
                        icon="el-icon-search"
                        type="primary"
                        plain>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getSubjectList"
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
                <el-form-item label="类型">
                    <el-select
                        v-model="listQueryParams.category"
                        @change="getSubjectList"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select
                        v-model="listQueryParams.programmeCategoryId"
                        @change="getSubjectList"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in programmeCategoryOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearFilters"
                        type="primary"
                        plain>
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
                <el-form-item label="开始时间">
                    <el-date-picker
                        v-model="listQueryParams.createdAtBegin"
                        @change="getSubjectList('BEGIN')"
                        clearable
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                        v-model="listQueryParams.createdAtEnd"
                        @change="getSubjectList"
                        :disabled="!listQueryParams.createdAtBegin"
                        clearable
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'SubjectFilterParams',
        data() {
            return {
                listQueryParams: {
                    category: '',
                    programmeCategoryId: '',
                    createdAtBegin: '',
                    createdAtEnd: '',
                    name: ''
                },
                programmeCategoryOptions: [],
                visibleOptions: [{
                    value: true,
                    label: '上架'
                }, {
                    value: false,
                    label: '下架'
                }],
                categoryOptions: [{
                    value: 'PROGRAMME',
                    label: '节目专题'
                }, {
                    value: 'FIGURE',
                    label: '人物专题'
                }],
                moreFilters: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.category = params.category ? params.category : '';
                this.listQueryParams.programmeCategoryId = params.programmeCategoryId ? params.programmeCategoryId : '';
                this.listQueryParams.createdAtBegin = params.createdAtBegin ? params.createdAtBegin : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.listQueryParams.name = params.name ? params.name : '';
            },
            init() {
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryOptions = response.data;
                    }
                });
            },
            getSubjectList(command) {
                if (command === 'BEGIN' && !this.listQueryParams.createdAtBegin) {
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getSubjectList', this.listQueryParams);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.getSubjectList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .subject-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
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

</style>
