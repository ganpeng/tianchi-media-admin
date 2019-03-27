<!--轮播插播列表搜索参数设置组件-->
<template>
    <div class="channel-search-container">
        <div @keyup.enter="getInterCutList" class="filters-container">
            <el-form :inline="true" class="text-left filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        @change="getInterCutList(true)"
                        placeholder="插播名称等"
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
                        v-model="listQueryParams.channelIdList"
                        @change="getInterCutList(true)"
                        filterable
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
                        v-model="listQueryParams.scheduled"
                        @change="getInterCutList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="(item, index) in scheduledOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.playStatus"
                        @change="getInterCutList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in playStatusOptions"
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
                    channelIdList: '',
                    scheduled: '',
                    playStatus: ''
                },
                playStatusOptions: [
                    {value: 'ACTIVE', label: '生效中'},
                    {value: 'WAITING', label: '未生效'},
                    {value: 'EXPIRED', label: '已失效'}
                ],
                scheduledOptions: [{
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
                this.listQueryParams.channelIdList = params.channelIdList ? params.channelIdList : '';
                this.listQueryParams.scheduled = params.scheduled !== '' ? params.scheduled : '';
                this.listQueryParams.playStatus = params.playStatus ? params.playStatus : '';
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
