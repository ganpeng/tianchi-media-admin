<!--直播频道列表搜索参数设置组件-->
<template>
    <div @keyup.enter="getChannelList">
        <el-form :inline="true" class="text-left">
            <el-form-item label="频道类别">
                <el-select v-model="listQueryParams.typeIdList" clearable multiple placeholder="请选择频道类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="录制状态">
                <el-select v-model="listQueryParams.record" clearable placeholder="请选择频道状态">
                    <el-option
                        v-for="item in recordOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键字">
                <el-input v-model="listQueryParams.keyword" placeholder="请填写频道名称或编号" clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="getChannelList">搜索</el-button>
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
        name: 'ChannelFilterParams',
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
                this.listQueryParams.visible = params.visible ? params.visible : '';
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
                this.listQueryParams.category = 'CAROUSEL';
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        margin-right: 210px;
    }

</style>
