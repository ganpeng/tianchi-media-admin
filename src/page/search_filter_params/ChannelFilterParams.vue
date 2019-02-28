<!--轮播频道列表搜索参数设置组件-->
<template>
    <div class="channel-search-container">
        <div @keyup.enter="getChannelList" class="filters-container">
            <el-form :inline="true" class="text-left filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getChannelList(true)"
                        placeholder="频道名称、编号等"
                        class="border-input"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getChannelList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select
                        v-model="listQueryParams.typeIdList"
                        @change="getChannelList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公共频道">
                    <el-select
                        v-model="listQueryParams.common"
                        @change="getChannelList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="(item, index) in commonOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getChannelList(true)"
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
                <el-form-item label="区域码">
                    <el-select
                        v-model="listQueryParams.companyCode"
                        @change="getChannelList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in companyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="推流方式">
                    <el-select
                        v-model="listQueryParams.protocolList"
                        @change="getChannelList(true)"
                        clearable
                        multiple
                        placeholder="全部">
                        <el-option
                            v-for="(item, index) in protocolOptions"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ChannelFilterParams',
        data() {
            return {
                listQueryParams: {
                    category: 'CAROUSEL',
                    typeIdList: '',
                    common: '',
                    companyCode: '',
                    visible: '',
                    keyword: ''
                },
                protocolOptions: ['UDP', 'HLS'],
                visibleOptions: [{
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '禁播'
                }],
                commonOptions: [{
                    value: true,
                    name: '是'
                }, {
                    value: false,
                    name: '否'
                }],
                companyOptions: [],
                typeOptions: [],
                moreFilters: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.typeIdList = params.typeIdList ? params.typeIdList : '';
                this.listQueryParams.visible = params.visible ? params.visible : '';
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
            },
            init() {
                // 初始化频道类别列表
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                // 获取所属区域的数据
                this.$service.getFilialeList().then(response => {
                    if (response && response.code === 0) {
                        this.companyOptions = response.data;
                    }
                });
            },
            getChannelList(isReset) {
                this.$emit('getChannelList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.listQueryParams.category = 'CAROUSEL';
                this.getChannelList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .channel-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }
    }

</style>
