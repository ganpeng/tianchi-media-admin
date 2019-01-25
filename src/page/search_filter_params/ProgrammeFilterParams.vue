<!--搜索节目参数设置组件-->
<template>
    <div class="programme-search-container">
        <div @keyup.enter="getProgrammeList" class="text-left filters-container">
            <el-form :inline="true" class="text-left filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        placeholder="频道名称、编号等"
                        class="border-input"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getProgrammeList"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="listQueryParams.programmeCategoryIdList"
                               clearable
                               multiple
                               placeholder="请选择分类"
                               @change="setCategory">
                        <el-option
                            v-for="item in categoryOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" v-if="listQueryParams.programmeCategoryIdList">
                    <el-select v-model="listQueryParams.programmeTypeIdList"
                               multiple clearable placeholder="请选择类型">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="listQueryParams.visible" placeholder="请选择节目状态">
                        <el-option
                            v-for="item in statusOptions"
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
                <el-form-item label="发行日期">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="createRangeTime"
                        type="daterange"
                        @change="getSubjectList"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制片地区">
                    <el-select
                        v-model="listQueryParams.produceAreaList"
                        clearable
                        multiple
                        placeholder="请选择制片地区">
                        <el-option
                            v-for="(item, index) in areaOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    import store from 'store';

    export default {
        name: 'ProgrammeFilterParams',
        props: [],
        data() {
            return {
                moreFilters: false,
                listQueryParams: {
                    releaseAtStart: '',
                    releaseAtEnd: '',
                    produceAreaList: [],
                    programmeCategoryIdList: [],
                    programmeTypeIdList: [],
                    visible: '',
                    keyword: ''
                },
                createRangeTime: [],
                areaOptions: store.get('areaList'),
                categoryOptions: [],
                typeOptions: [],
                statusOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '已下架'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 节目类型分类
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
            },
            // 设置节目的分类，例如电视剧
            setCategory() {
                this.typeOptions = [];
                for (let i = 0; i < this.listQueryParams.programmeCategoryIdList.length; i++) {
                    for (let k = 0; k < this.categoryOptions.length; k++) {
                        if (this.categoryOptions[k].id === this.listQueryParams.programmeCategoryIdList[i]) {
                            this.typeOptions = this.typeOptions.concat(this.categoryOptions[k].programmeTypeList);
                        }
                    }
                }
                let array = [];
                this.listQueryParams.programmeTypeIdList.map(typeId => {
                    this.typeOptions.map(type => {
                        if (type.id === typeId) {
                            array.push(typeId);
                        }
                    });
                });
                this.listQueryParams.programmeTypeIdList = array;
            },
            getProgrammeList() {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.releaseAtStart = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.releaseAtStart = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getProgrammeList', this.listQueryParams);
            },
            // 清空搜索条件
            clearFilters() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.getProgrammeList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .programme-search-container {
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
