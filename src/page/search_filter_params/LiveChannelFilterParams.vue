<!--直播频道列表搜索参数设置组件-->
<template>
    <div class="channel-search-container">
        <div @keyup.enter="getChannelList" class="filters-container">
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
                        @click="getChannelList"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="频道类别">
                    <el-select
                        v-model="listQueryParams.typeIdList"
                        @change="getChannelList"
                        clearable
                        multiple
                        placeholder="全部">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="录制状态">
                    <el-select
                        v-model="listQueryParams.record"
                        @change="getChannelList"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in recordOptions"
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
        name: 'LiveChannelFilterParams',
        data() {
            return {
                listQueryParams: {
                    category: 'LIVE',
                    typeIdList: [],
                    visible: '',
                    keyword: ''
                },
                recordOptions: [
                    {
                        label: '是',
                        value: true
                    },
                    {
                        label: '否',
                        value: false
                    }
                ],
                typeOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.typeIdList = params.typeIdList ? params.typeIdList : [];
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
            },
            init() {
                // 初始化频道类别列表
                this.$service.getChannelType({category: 'LIVE'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
            },
            getChannelList() {
                this.$emit('getChannelList', this.listQueryParams);
            },
            clearFilters() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.listQueryParams.category = 'LIVE';
                this.getChannelList();
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
