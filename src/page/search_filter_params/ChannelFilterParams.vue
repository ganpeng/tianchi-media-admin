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
                        @click="getChannelList(true)"
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
                <el-form-item id="multi-selecter" label="适用客户端">
                    <el-select
                        v-model="listQueryParams.applicableClientList"
                        clearable
                        multiple
                        @change="getChannelList(true)"
                        placeholder="全部">
                        <el-option
                            v-for="item in applicableClientListOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
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
                <el-form-item label="关联">
                    <el-select
                        v-model="listQueryParams.refCount"
                        clearable
                        placeholder="请选择关联"
                        @change="getChannelList(true)">
                        <el-option
                            v-for="(item, index) in refCountOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员">
                    <el-select
                        v-model="listQueryParams.paymentType"
                        clearable
                        placeholder="请选择会员"
                        @change="getChannelList(true)">
                        <el-option
                            v-for="(item, index) in paymentTypeOptions"
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
    import role from '@/util/config/role';

    export default {
        name: 'ChannelFilterParams',
        data() {
            return {
                listQueryParams: {
                    category: 'CAROUSEL',
                    typeIdList: '',
                    common: '',
                    protocolList: [],
                    companyCode: '',
                    visible: '',
                    keyword: '',
                    refCount: '',
                    paymentType: ''
                },
                applicableClientListOption: role.APPLICABLE_CLIENT_LIST_OPTION,
                protocolOptions: ['UDP', 'HLS'],
                refCountOptions: [
                    {name: '有', value: 1},
                    {name: '无', value: 0}],
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
                paymentTypeOptions: [{
                    value: 'VIP',
                    name: '是'
                }, {
                    value: 'FREE',
                    name: '否'
                }],
                companyList: [],
                typeOptions: [],
                moreFilters: false
            };
        },
        computed: {
            companyOptions: function () {
                return this.listQueryParams.common ? [] : this.companyList;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.typeIdList = params.typeIdList ? params.typeIdList : '';
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.protocolList = params.protocolList ? params.protocolList : '';
                this.listQueryParams.companyCode = params.companyCode ? params.companyCode : '';
                this.listQueryParams.refCount = params.refCount ? params.refCount : '';
                this.listQueryParams.paymentType = params.paymentType ? params.paymentType : '';
                this.listQueryParams.common = params.common !== '' ? params.common : '';
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
                        this.companyList = response.data;
                    }
                });
            },
            getChannelList(isReset) {
                if (isReset) {
                    if (!this.$authority.isHasAuthority('content:channel:page')) {
                        for (let key in this.listQueryParams) {
                            if (Array.isArray(this.listQueryParams[key])) {
                                this.listQueryParams[key] = [];
                            } else {
                                this.listQueryParams[key] = '';
                            }
                        }
                        this.listQueryParams.category = 'CAROUSEL';
                        return;
                    }
                }
                if (this.listQueryParams.common) {
                    this.listQueryParams.companyCode = '';
                }
                this.$emit('getChannelList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
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
