<!--人物列表搜索参数设置组件-->
<template>
    <div @keyup.enter="getPersonList" class="text-left">
        <el-form :inline="true">
            <el-form-item label="地区">
                <el-select
                    v-model="listQueryParams.area"
                    clearable
                    placeholder="请选择制片地区">
                    <el-option
                        v-for="(item, index) in areaOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="search">
                <el-input
                    v-model="listQueryParams.name"
                    placeholder="请输入关键字"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="getPersonList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain class="clear-filter" @click="clearFilters">
                    <svg-icon
                        icon-class="clear_filter">
                    </svg-icon>
                    清除筛选项
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import store from 'store';

    export default {
        name: 'PersonFilterParams',
        data() {
            return {
                areaOptions: store.get('areaList'),
                listQueryParams: {
                    area: '',
                    name: ''
                }
            };
        },
        methods: {
            getPersonList() {
                this.$emit('getPersonList', this.listQueryParams);
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
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form-item {
        margin-right: 30px;
    }

</style>
