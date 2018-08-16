<!--轮播频道列表搜索参数设置组件-->
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
            <el-form-item label="频道状态">
                <el-select v-model="listQueryParams.visible" clearable placeholder="请选择频道状态">
                    <el-option
                        v-for="item in visibleOptions"
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
        </el-form>
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
                    visible: '',
                    keyword: ''
                },
                visibleOptions: [{
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '禁播'
                }],
                typeOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.typeIdList = params.typeIdList;
                this.listQueryParams.visible = params.visible;
                this.listQueryParams.keyword = params.keyword;
            },
            init() {
                // 初始化频道类别列表
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
            },
            getChannelList() {
                this.$emit('getChannelList', this.listQueryParams);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form-item {
        margin-right: 60px;
        &:first-child {
            margin-left: 20px;
        }
    }

</style>
