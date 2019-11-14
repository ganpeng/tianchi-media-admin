<!--专题列表搜索参数设置组件-->
<template>
    <div class="subject-search-container">
        <div @keyup.enter="getSubjectList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getSubjectList(true)"
                        clearable
                        class="border-input"
                        placeholder="专题名称等">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getSubjectList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getSubjectList(true)"
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
                        @change="getSubjectList(true)"
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
                        @change="getSubjectList(true)"
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
                <el-form-item label="开始时间">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="createRangeTime"
                        type="daterange"
                        @change="getSubjectList(true)"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="关联">
                    <el-select
                        v-model="listQueryParams.refCount"
                        clearable
                        placeholder="请选择关联"
                        @change="getSubjectList(true)">
                        <el-option
                            v-for="(item, index) in refCountOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
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
                    keyword: '',
                    refCount: '',
                    visible: ''
                },
                createRangeTime: [],
                programmeCategoryOptions: [],
                refCountOptions: [
                    {name: '有', value: 1},
                    {name: '无', value: 0}],
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
                this.createRangeTime = params.createdAtBegin ? [params.createdAtBegin, params.createdAtEnd] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.refCount = params.refCount ? params.refCount : '';
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
            },
            init() {
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.programmeCategoryOptions = response.data;
                    }
                });
            },
            getSubjectList(isReset) {
                if (!this.$authority.isHasAuthority('content:subject:page')) {
                    for (let key in this.listQueryParams) {
                        if (Array.isArray(this.listQueryParams[key])) {
                            this.listQueryParams[key] = [];
                        } else {
                            this.listQueryParams[key] = '';
                        }
                    }
                    this.createRangeTime = [];
                    return;
                }
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtBegin = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtBegin = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getSubjectList', this.listQueryParams, isReset);
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
                this.getSubjectList(true);
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
