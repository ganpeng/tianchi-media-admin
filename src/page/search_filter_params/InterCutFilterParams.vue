<!--轮播插播列表搜索参数设置组件-->
<template>
    <div class="channel-search-container">
        <div @keyup.enter="getInterCutList" class="filters-container">
            <el-form :inline="true" class="text-left filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getInterCutList(true)"
                        placeholder="插播名称、编号等"
                        class="border-input"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getInterCutList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="频道">
                    <el-select
                        v-model="listQueryParams.channel"
                        @change="getInterCutList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in channelOptions"
                            :key="item.id"
                            :label="item.innerName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定时">
                    <el-select
                        v-model="listQueryParams.timing"
                        @change="getInterCutList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="(item, index) in timingOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.status"
                        @change="getInterCutList(true)"
                        clearable
                        placeholder="全部">
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
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'InterCutFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    channel: '',
                    timing: '',
                    status: ''
                },
                statusOptions: [
                    {value: 'ACTIVE', label: '生效中'},
                    {value: 'WAITING', label: '未生效'},
                    {value: 'EXPIRED', label: '已失效'}
                ],
                timingOptions: [{
                    value: true,
                    name: '是'
                }, {
                    value: false,
                    name: '否'
                }],
                channelOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.channel = params.channel ? params.channel : '';
                this.listQueryParams.timing = params.timing ? params.timing : '';
                this.listQueryParams.status = params.status ? params.status : '';
            },
            init() {
                this.$service.getChannelList({
                    category: 'CAROUSEL',
                    pageNum: 0,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.channelOptions = response.data.list;
                    }
                });
            },
            getInterCutList(isReset) {
                this.$emit('getInterCutList', this.listQueryParams, isReset);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.getInterCutList(true);
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
